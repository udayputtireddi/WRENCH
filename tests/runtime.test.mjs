import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout} from 'node:timers/promises';
test('built runtime serves SPA and fails closed without server configuration',async()=>{
 const env={...process.env,NODE_ENV:'production',PORT:'18763'};delete env.GCLOUD_PROJECT;
 const processHandle=spawn(process.execPath,['dist/server/node-build.mjs'],{env,stdio:['ignore','pipe','pipe']});
 let output='';processHandle.stdout.on('data',s=>output+=s);processHandle.stderr.on('data',s=>output+=s);
 try {
   let started=false;
   for(let i=0;i<50;i++) {try {await fetch('http://127.0.0.1:18763/api/ping');started=true;break;}catch{await setTimeout(100);}}
   assert.ok(started,output);
   const page=await fetch('http://127.0.0.1:18763/');assert.equal(page.status,200);assert.match(await page.text(),/id="root"/);
   const api=await fetch('http://127.0.0.1:18763/api/session');assert.equal(api.status,503);assert.equal(api.headers.get('cache-control'),'no-store');
 } finally {processHandle.kill('SIGTERM');}
});
