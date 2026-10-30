// Trusted administrator tool. No public HTTP provisioning route exists.
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { member } from '../server/security/policy.mjs';
const [projectId,uid,role,confirmation]=process.argv.slice(2);
if(!projectId || !uid || !['admin','user','disabled'].includes(role) || confirmation!==`CONFIRM:${projectId}:${uid}:${role}`) {
  console.error('Usage: node scripts/set-member.mjs PROJECT UID admin|user|disabled CONFIRM:PROJECT:UID:ROLE');
  process.exit(1);
}
if(process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Provisioning tool does not accept emulator overrides');
const app=initializeApp({projectId});
const account=await getAuth(app).getUser(uid);
if(account.disabled || !account.email) throw new Error('Use an enabled Firebase Auth account with an email address');
const ref=getFirestore(app,'wrench').collection('members').doc(uid);
await getFirestore(app,'wrench').runTransaction(async tx=>{
  const prior=await tx.get(ref);
  if(role==='disabled') {if(!prior.exists) throw new Error('Member not found');tx.update(ref,{active:false});return;}
  const value={name:account.displayName || account.email,email:account.email,role,active:true,department:prior.data()?.department || '',createdAt:prior.data()?.createdAt || new Date().toISOString()};
  member(value,uid);
  tx.set(ref,value);
});
console.log('WRENCH membership updated. No Firebase account was created or deleted.');
