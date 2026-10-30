import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { WrenchStore } from './store.mjs';

export function dependencies() {
  const projectId=process.env.GCLOUD_PROJECT;
  if(!projectId) throw new Error('GCLOUD_PROJECT must be explicitly configured');
  if(process.env.NODE_ENV==='production' && (process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST)) throw new Error('Emulator endpoints are forbidden in production');
  const app=getApps().find(a=>a.name==='wrench-server') || initializeApp({projectId},'wrench-server');
  return {verify:(token,revoked)=>getAuth(app).verifyIdToken(token,revoked),store:new WrenchStore(getFirestore(app,'wrench'))};
}
