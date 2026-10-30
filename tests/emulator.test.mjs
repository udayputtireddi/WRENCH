import test from 'node:test';
import express from 'express';
import {createApi} from '../server/security/app.mjs';
import assert from 'node:assert/strict';
import {initializeApp as adminApp} from 'firebase-admin/app';
import {getAuth as adminAuth} from 'firebase-admin/auth';
import {getFirestore as adminDb} from 'firebase-admin/firestore';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,getDoc,setDoc} from 'firebase/firestore';
import {WrenchStore} from '../server/security/store.mjs';
import {authenticate,taskInput} from '../server/security/policy.mjs';

if(!process.env.FIREBASE_AUTH_EMULATOR_HOST || !process.env.FIRESTORE_EMULATOR_HOST || process.env.GCLOUD_PROJECT!=='demo-wrench') throw new Error('Tests require isolated demo-wrench emulators');
const projectId='demo-wrench', app=adminApp({projectId});
const auth=adminAuth(app), db=adminDb(app); // Default emulator binds the exact deny-all rules file.
const store=new WrenchStore(db), apps=[];
const task={id:'task-1',machineId:'machine-1',machineName:'Machine',taskName:'Inspect',description:'',frequency:'daily',category:'inspection',estimatedTimeMinutes:10,safetyNotes:[],requiredTools:[],isActive:true};
const entry=(id)=>({requestId:id,checklistItems:[{id:'a',text:'Inspect',completed:true}],notes:'',photos:[],timeSpentMinutes:1});
let a,b,owner,unapproved;
async function account(name,role) {
 const client=initializeApp({projectId,apiKey:'fake-key',authDomain:'localhost'},name);apps.push(client);
 const ca=getAuth(client);connectAuthEmulator(ca,`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`,{disableWarnings:true});
 const {user}=await createUserWithEmailAndPassword(ca,`${name}@example.test`,'Strong-test-password-123!');
 if(role) await db.collection('members').doc(user.uid).set({name,email:user.email,role,active:true,createdAt:new Date().toISOString()});
 return {uid:user.uid,token:await user.getIdToken(),client};
}
test.before(async()=>{owner=await account('admin','admin');a=await account('operator-a','user');b=await account('operator-b','user');unapproved=await account('unapproved');});
test.after(async()=>{await Promise.all(apps.map(deleteApp));await db.terminate();});
test('real Firebase token accepted and malformed token rejected',async()=>{
 assert.equal(await authenticate(`Bearer ${a.token}`,(t,r)=>auth.verifyIdToken(t,r)),a.uid);
 await assert.rejects(authenticate('Bearer forged',(t,r)=>auth.verifyIdToken(t,r)),{status:401});
});
test('valid Firebase user without membership denied',async()=>{await assert.rejects(store.execute(unapproved.uid,'snapshot'),{status:403});});
test('operators cannot import, clear, remove members or self-promote',async()=>{
 for(const action of ['import','clear','removeMember','setRole'])await assert.rejects(store.execute(a.uid,action,{}),{status:403});
});
test('admin import validates schema and refuses collisions atomically',async()=>{
 await store.execute(owner.uid,'import',{tasks:[task]});
 await assert.rejects(store.execute(owner.uid,'import',{tasks:[task,{...task,id:'new'}]}),{status:409});
 assert.equal((await db.collection('tasks').doc('new').get()).exists,false);
 await assert.rejects(store.execute(owner.uid,'import',{tasks:[{...task,id:'forged',completionHistory:[]}]}),{status:400});
});
test('server attribution, ownership filtering, concurrent writes and idempotent retries',async()=>{
 await Promise.all([store.execute(a.uid,'complete',{id:'task-1',entry:entry('a-first')}),store.execute(b.uid,'complete',{id:'task-1',entry:entry('b-first')})]);
 await Promise.all(Array.from({length:3},()=>store.execute(a.uid,'complete',{id:'task-1',entry:entry('same-request')})));
 const snapshot=await store.execute(owner.uid,'snapshot');assert.equal(snapshot.tasks[0].completionHistory.length,3);assert.equal(snapshot.users.length,3);
 const own=await store.execute(a.uid,'snapshot');assert.equal(own.tasks[0].completionHistory.length,2);assert.ok(own.tasks[0].completionHistory.every(c=>c.userId===a.uid));assert.deepEqual(own.users,[]);
 await assert.rejects(store.execute(a.uid,'progress',{id:'task-1',entry:{...entry('forged'),userId:b.uid}}),{status:400});
});
test('progress replacement affects only current operator',async()=>{
 await store.execute(a.uid,'progress',{id:'task-1',entry:entry('p-a')});await store.execute(b.uid,'progress',{id:'task-1',entry:entry('p-b')});await store.execute(a.uid,'progress',{id:'task-1',entry:entry('p-a2')});
 const all=await store.execute(owner.uid,'snapshot');assert.equal(all.tasks[0].progressSaves.length,2);
 const own=await store.execute(a.uid,'snapshot');assert.equal(own.tasks[0].progressSaves.length,1);assert.equal(own.tasks[0].progressSaves[0].requestId,'p-a2');
});
test('demotion takes effect with an existing token; client token claims cannot promote',async()=>{
 await auth.setCustomUserClaims(a.uid,{admin:true,role:'admin'});
 await assert.rejects(store.execute(a.uid,'import',{tasks:[task]}),{status:403});
 await db.collection('members').doc(owner.uid).update({role:'user'});
 await assert.rejects(store.execute(owner.uid,'clear',{confirmation:'DELETE ALL TASKS'}),{status:403});
 await db.collection('members').doc(owner.uid).update({role:'admin'});
});
test('removal revokes application access and protects self-removal',async()=>{
 await assert.rejects(store.execute(owner.uid,'removeMember',{id:owner.uid}),{status:409});
 await store.execute(owner.uid,'removeMember',{id:b.uid});
 await assert.rejects(store.execute(b.uid,'snapshot'),{status:403});
 await assert.rejects(store.execute(b.uid,'complete',{id:'task-1',entry:entry('removed')}),{status:403});
});
test('disabled Auth account rejected with previously issued token',async()=>{
 await auth.updateUser(unapproved.uid,{disabled:true});
 await assert.rejects(authenticate(`Bearer ${unapproved.token}`,(t,r)=>auth.verifyIdToken(t,r)),{status:401});
});
test('direct client Firestore access denied even for administrator',async()=>{
 for(const account of [a,owner]){
   const clientDb=getFirestore(account.client);const [host,port]=process.env.FIRESTORE_EMULATOR_HOST.split(':');connectFirestoreEmulator(clientDb,host,Number(port));
   for(const path of [`members/${account.uid}`,'tasks/task-1','arbitrary/document']) {
    await assert.rejects(getDoc(doc(clientDb,path)),e=>e.code==='permission-denied');
    await assert.rejects(setDoc(doc(clientDb,path),{role:'admin',active:true}),e=>e.code==='permission-denied');
   }
 }
});
test('clear requires explicit confirmation',async()=>{
 await assert.rejects(store.execute(owner.uid,'clear',{}),{status:400});assert.equal((await db.collection('tasks').get()).size,1);
 await store.execute(owner.uid,'clear',{confirmation:'DELETE ALL TASKS'});assert.equal((await db.collection('tasks').get()).size,0);
});

test('full HTTP route uses real Auth verification and transactional membership',async()=>{
 const apiApp=express();apiApp.use('/api',createApi({verify:(t,r)=>auth.verifyIdToken(t,r),store}));
 const server=apiApp.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 try {
   const root=`http://127.0.0.1:${server.address().port}/api`;
   let res=await fetch(root+'/session',{headers:{Authorization:`Bearer ${a.token}`}});assert.equal(res.status,200);assert.equal((await res.json()).user.id,a.uid);
   res=await fetch(root+'/tasks/import',{method:'POST',headers:{Authorization:`Bearer ${a.token}`,'Content-Type':'application/json'},body:JSON.stringify({tasks:[task]})});assert.equal(res.status,403);
   res=await fetch(root+'/session',{headers:{Authorization:`Bearer ${b.token}`}});assert.equal(res.status,403);
 } finally {await new Promise(r=>server.close(r));}
});
test('persistent request limit rejects and rolls over without mutating tasks',async()=>{
 const ref=db.collection('requestLimits').doc(a.uid);await ref.set({minute:Math.floor(Date.now()/60000),count:120});
 await assert.rejects(store.execute(a.uid,'snapshot'),{status:429});
 await ref.set({minute:Math.floor(Date.now()/60000)-1,count:120});
 await store.execute(a.uid,'snapshot');assert.equal((await ref.get()).data().count,1);
});
