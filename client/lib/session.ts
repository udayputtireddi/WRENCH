import { useSyncExternalStore } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, onIdTokenChanged, signInWithEmailAndPassword, signOut, inMemoryPersistence, setPersistence, updatePassword } from 'firebase/auth';
import type { User } from './auth';
import type { Task } from './database';

const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
const auth=Object.values(config).every(Boolean)?getAuth(initializeApp(config)):null;
let state: {user:User|null; users:User[]; tasks:Task[]; loading:boolean; error:string}={user:null,users:[],tasks:[],loading:true,error:''};
const listeners=new Set<()=>void>();
let generation=0;
let started=false;
let refreshSequence=0;
const publish=(next:typeof state)=>{state=next;listeners.forEach(fn=>fn());};
const empty=(loading=false,error='')=>({user:null,users:[],tasks:[],loading,error});
const dateFields=new Set(['createdAt','createdDate','nextDueDate','lastCompletedDate','completedDate','savedDate','lastLogin']);
const revive=(key:string,value:unknown)=> dateFields.has(key) && typeof value==='string' && Number.isFinite(Date.parse(value))?new Date(value):value;
export const session={get:()=>state,subscribe:(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};}};

export async function api(path:string, method='GET', body?:unknown) {
  const current=auth?.currentUser;
  if(!current) throw new Error('Sign in required');
  const epoch=generation;
  const token=await current.getIdToken();
  if(epoch!==generation || auth.currentUser?.uid!==current.uid) throw new Error('Session changed');
  const res=await fetch(`/api${path}`, {method,headers:{Authorization:`Bearer ${token}`,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000),cache:'no-store'});
  if(epoch!==generation || auth.currentUser?.uid!==current.uid) throw new Error('Session changed');
  if(!res.ok) {
    const data=await res.json().catch(()=>({}));
    if(res.status===401 || res.status===403) {++generation; publish(empty(false,data.error || 'Access denied'));}
    throw new Error(data.error || 'Request failed');
  }
  return JSON.parse(await res.text(),revive);
}
export async function refresh() {
  const epoch=generation, seq=++refreshSequence;
  const data=await api('/session');
  if(epoch===generation && seq===refreshSequence) publish({...data,loading:false,error:''});
}
export async function startSession() {
  if(started) return;
  started=true;
  if(!auth) {publish(empty(false,'Sign-in is not configured. Contact the administrator.'));return;}
  // Do not retain accounts or protected records across browser restarts.
  try {await setPersistence(auth,inMemoryPersistence);}
  catch {publish(empty(false,'Unable to initialize sign-in. Reload and try again.'));return;}
  onIdTokenChanged(auth, async user=>{
    const epoch=++generation;
    publish(empty(Boolean(user)));
    if(!user) return;
    try {await refresh();}
    catch(e) {if(epoch===generation) publish(empty(false,(e as Error).message));}
  });
  const revalidate=()=>{const epoch=generation;if(auth.currentUser) refresh().catch(()=>{if(epoch===generation)publish(empty(false,'Unable to verify access. Sign in again.'));});};
  window.addEventListener('focus',revalidate);
  window.setInterval(revalidate,60000);
}
export async function login(email:string,password:string) {
  if(!auth) throw new Error('Sign-in is not configured');
  await signInWithEmailAndPassword(auth,email,password);
}
export async function logout() {
  ++generation;
  publish(empty());
  if(auth) await signOut(auth);
}
export async function changePassword(password:string) {
  if(!auth?.currentUser) throw new Error('Sign in required');
  await updatePassword(auth.currentUser,password);
}

export function useSession() {return useSyncExternalStore(session.subscribe,session.get);}
