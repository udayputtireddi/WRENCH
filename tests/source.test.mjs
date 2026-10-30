import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('client has no simulated accounts or locally trusted roles',()=>{
 const auth=read('client/lib/auth.ts'), session=read('client/lib/session.ts'), reports=read('client/lib/taskCompletionTracking.ts');
 assert.doesNotMatch(auth,/userDatabase|localStorage|includes\(.admin/);
 assert.doesNotMatch(session,/localStorage|firebase-admin|const\s+env\s*=\s*import.meta.env/);
 assert.doesNotMatch(reports,/localStorage|saveTaskCompletion/);
 assert.match(session,/inMemoryPersistence/);
});
test('production API initialization verifies revocation and forbids emulator endpoints',()=>{
 const src=read('server/security/firebase.mjs');assert.match(src,/verifyIdToken\(token,revoked\)/);assert.match(src,/NODE_ENV==='production'/);assert.match(src,/getFirestore\(app,'wrench'\)/);
});
test('API rewrite precedes SPA and rules target only named wrench database',()=>{
 const config=JSON.parse(read('firebase.json'));assert.equal(config.hosting.rewrites[0].source,'/api/**');assert.deepEqual(config.firestore,[{database:'wrench',rules:'firestore.rules'}]);assert.match(read('firestore.rules'),/allow read, write: if false/);
});
test('workflows cannot deploy',()=>{
 for(const f of readdirSync('.github/workflows')) assert.doesNotMatch(read(`.github/workflows/${f}`),/hosting-deploy|firebase deploy|gcloud run deploy|FIREBASE_SERVICE_ACCOUNT/);
});
