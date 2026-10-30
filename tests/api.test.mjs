import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createApi } from '../server/security/app.mjs';
import { HttpError } from '../server/security/policy.mjs';
async function withApi(fn) {
 const calls=[];const app=express();
 app.use('/api',createApi({verify:async(token,revoked)=>{assert.equal(revoked,true);if(token==='invalid')throw Error();return {uid:token,firebase:{sign_in_provider:token==='anon'?'anonymous':'password'}};},store:{execute:async(...args)=>{calls.push(args);if(args[0]==='operator' && ['clear','import','removeMember'].includes(args[1]))throw new HttpError(403,'Administrator access required');return {ok:true};}}}));
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const request=(path,options={})=>fetch(`http://127.0.0.1:${server.address().port}/api${path}`,options);
 try {await fn(request,calls);} finally {await new Promise(r=>server.close(r));}
}
for(const token of [undefined,'invalid','anon']) test(`HTTP denies ${token}`,()=>withApi(async(request,calls)=>{const res=await request('/session',{headers:token?{Authorization:`Bearer ${token}`}:{}});assert.equal(res.status,401);assert.equal(calls.length,0);assert.equal(res.headers.get('cache-control'),'no-store');}));
test('HTTP route maps authenticated UID, ignores role headers',()=>withApi(async(request,calls)=>{
 const res=await request('/tasks/task-1/progress',{method:'PUT',headers:{Authorization:'Bearer operator','Content-Type':'application/json','X-Role':'admin'},body:JSON.stringify({notes:'work'})});assert.equal(res.status,200);assert.deepEqual(calls,[['operator','progress',{id:'task-1',entry:{notes:'work'}}]]);
}));
test('non-admin errors propagate; no permissive CORS',()=>withApi(async request=>{const res=await request('/tasks',{method:'DELETE',headers:{Authorization:'Bearer operator',Origin:'https://evil.test'}});assert.equal(res.status,403);assert.equal(res.headers.get('access-control-allow-origin'),null);}));
test('malformed JSON rejected before storage',()=>withApi(async(request,calls)=>{const res=await request('/tasks/import',{method:'POST',headers:{Authorization:'Bearer admin','Content-Type':'application/json'},body:'{'});assert.equal(res.status,400);assert.equal(calls.length,0);}));
test('oversize body rejected before storage',()=>withApi(async(request,calls)=>{const res=await request('/tasks/import',{method:'POST',headers:{Authorization:'Bearer admin','Content-Type':'application/json'},body:JSON.stringify({data:'a'.repeat(620000)})});assert.equal(res.status,413);assert.equal(calls.length,0);}));
test('unimplemented role mutation routes are closed',()=>withApi(async(request,calls)=>{const res=await request('/members/me',{method:'PATCH',headers:{Authorization:'Bearer operator'}});assert.equal(res.status,404);assert.equal(calls.length,0);}));
