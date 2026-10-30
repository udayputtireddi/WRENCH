import {test,expect,vi,beforeEach} from 'vitest';
const mocks=vi.hoisted(()=>({auth:{currentUser:null as any},onChange:null as any,signIn:vi.fn(),signOut:vi.fn(),persistence:vi.fn()}));
vi.mock('firebase/app',()=>({initializeApp:()=>({})}));
vi.mock('firebase/auth',()=>({
 getAuth:()=>mocks.auth, inMemoryPersistence:'memory',setPersistence:mocks.persistence,
 onIdTokenChanged:(_auth,fn)=>{mocks.onChange=fn;},signInWithEmailAndPassword:mocks.signIn,
 signOut:async()=>{mocks.auth.currentUser=null;await mocks.signOut();},updatePassword:vi.fn()
}));
let mod:typeof import('../client/lib/session');
let fetched:ReturnType<typeof vi.fn>;
const snapshot=(uid='a',role='user')=>({user:{id:uid,role,name:uid},users:[],tasks:[{id:'task',createdDate:'2026-10-29T12:00:00.000Z'}]});
const response=(body,status=200)=>({ok:status===200,status,json:async()=>body,text:async()=>JSON.stringify(body)});
beforeEach(async()=>{
 vi.resetModules();vi.clearAllMocks();mocks.auth.currentUser=null;
 for(const key of ['API_KEY','AUTH_DOMAIN','PROJECT_ID','APP_ID'])vi.stubEnv(`VITE_FIREBASE_${key}`,'demo');
 vi.stubGlobal('window',{addEventListener:vi.fn(),setInterval:vi.fn()});
 fetched=vi.fn();vi.stubGlobal('fetch',fetched);
 mod=await import('../client/lib/session');await mod.startSession();
});
async function signedIn(uid='a') {
 mocks.auth.currentUser={uid,getIdToken:async()=>`token-${uid}`};fetched.mockResolvedValue(response(snapshot(uid)));
 await mocks.onChange(mocks.auth.currentUser);
}
test('Firebase email/password sign-in does not fabricate user or role',async()=>{
 await mod.login('admin@example.test','password');expect(mocks.signIn).toHaveBeenCalledWith(mocks.auth,'admin@example.test','password');expect(mod.session.get().user).toBeNull();
 expect(mocks.persistence).toHaveBeenCalledWith(mocks.auth,'memory');
});
test('session snapshot comes from authorized API; dates revived',async()=>{
 await signedIn();expect(mod.session.get().user?.id).toBe('a');expect(mod.session.get().tasks[0].createdDate).toBeInstanceOf(Date);
 expect(fetched.mock.calls[0][1].headers.Authorization).toBe('Bearer token-a');
});
test('sign-out clears all protected state',async()=>{
 await signedIn();await mod.logout();expect(mod.session.get().tasks).toEqual([]);expect(mod.session.get().users).toEqual([]);expect(mod.session.get().user).toBeNull();
});
test('slow former-account snapshot cannot overwrite a new session',async()=>{
 await signedIn();let resolve:any;fetched.mockImplementationOnce(()=>new Promise(r=>resolve=r));
 const slow=mod.refresh().catch(()=>{});
 await new Promise(r=>setTimeout(r,0));
 await mod.logout();await signedIn('b');
 resolve(response(snapshot('a','admin')));await slow;expect(mod.session.get().user?.id).toBe('b');expect(mod.session.get().user?.role).toBe('user');
});
test('rejected membership clears previous data',async()=>{
 await signedIn();fetched.mockResolvedValue(response({error:'Access denied'},403));
 await expect(mod.refresh()).rejects.toThrow('Access denied');expect(mod.session.get().user).toBeNull();expect(mod.session.get().tasks).toEqual([]);
});
test('a token pending during sign-out cannot initiate a request',async()=>{
 await signedIn();fetched.mockClear();let resolve:any;mocks.auth.currentUser.getIdToken=()=>new Promise(r=>resolve=r);
 const pending=mod.api('/tasks','DELETE',{confirmation:'DELETE ALL TASKS'}).catch(e=>e);
 await mod.logout();resolve('old-token');await pending;expect(fetched).not.toHaveBeenCalled();
});

test('date-like user content stays text',async()=>{
 mocks.auth.currentUser={uid:'a',getIdToken:async()=>'token-a'};
 fetched.mockResolvedValue(response({...snapshot(),user:{id:'a',role:'user',name:'2026-10-29T12:00:00.000Z'}}));
 await mocks.onChange(mocks.auth.currentUser);expect(mod.session.get().user?.name).toBe('2026-10-29T12:00:00.000Z');
});
