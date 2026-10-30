import test from 'node:test';
import assert from 'node:assert/strict';
import {authenticate,member,admin,taskInput,entryInput,recordEntry,visibleTask,identifier} from '../server/security/policy.mjs';
const user={id:'operator',name:'Operator',role:'user'};
const input={id:'task-1',machineId:'machine-1',machineName:'Machine',taskName:'Inspect',description:'',frequency:'daily',category:'inspection',estimatedTimeMinutes:10,safetyNotes:[],requiredTools:[],isActive:true};
const entry={checklistItems:[{id:'check-1',text:'Inspect guard',completed:true}],photos:[],notes:'Done',timeSpentMinutes:3,requestId:'request-1'};
for(const header of [undefined,'','Basic abc','Bearer ','Bearer a b','Bearer '+ 'x'.repeat(8193)]) test(`reject malformed authorization ${String(header).slice(0,30)}`,async()=>{
  let called=false;await assert.rejects(authenticate(header,()=>{called=true;}),{status:401});assert.equal(called,false);
});
for(const failure of ['expired','revoked','wrong audience','bad signature','disabled']) test(`verification fails closed: ${failure}`,async()=>{await assert.rejects(authenticate('Bearer bad',()=>{throw Error(failure);}),{status:401});});
test('verification requires revocation check',async()=>{assert.equal(await authenticate('Bearer valid',(token,revoked)=>{assert.equal(token,'valid');assert.equal(revoked,true);return {uid:'operator'};}),'operator');});
test('anonymous Firebase user is rejected',async()=>{await assert.rejects(authenticate('Bearer valid',()=>({uid:'anon',firebase:{sign_in_provider:'anonymous'}})),{status:401});});
for(const value of [undefined,{}, {active:false,role:'admin'},{active:true,role:'owner'}]) test(`membership denies ${JSON.stringify(value)}`,()=>assert.throws(()=>member(value,'uid'),{status:403}));
test('email does not grant admin',()=>{const u=member({active:true,role:'user',email:'admin@example.test',name:'Admin'},'uid');assert.throws(()=>admin(u),{status:403});});
for(const id of ['../users','a/b','','.', '__bad/path']) test(`reject document path ${id}`,()=>assert.throws(()=>identifier(id),{status:400}));
for(const field of ['role','userId','completionHistory','lastCompletedDate','createdDate']) test(`import rejects privileged field ${field}`,()=>assert.throws(()=>taskInput({...input,[field]:'forged'}),{status:400}));
for(const field of ['userId','userName','completedDate','savedDate','role','nextDueDate']) test(`entry rejects forged ${field}`,()=>assert.throws(()=>entryInput({...entry,[field]:'forged'}),{status:400}));
for(const patch of [{frequency:'never'},{estimatedTimeMinutes:-1},{isActive:'true'},{taskName:''},{safetyNotes:['x'.repeat(1001)]}]) test(`invalid task ${JSON.stringify(patch).slice(0,60)}`,()=>assert.throws(()=>taskInput({...input,...patch}),{status:400}));
for(const patch of [{photos:['https://evil.test/a.png']},{photos:['data:image/svg+xml;base64,AAAA']},{photos:['data:image/png;base64,'+'A'.repeat(200001)]},{timeSpentMinutes:-1},{notes:'x'.repeat(4001)},{checklistItems:[entry.checklistItems[0],entry.checklistItems[0]]}]) test(`invalid completion ${Object.keys(patch)}`,()=>assert.throws(()=>entryInput({...entry,...patch}),{status:400}));
test('server assigns identity, dates, schedule; retries do not duplicate history',()=>{
 const now='2026-10-29T12:00:00.000Z';const base=taskInput(input,now);const done=recordEntry(base,user,entry,'complete',now);
 assert.equal(base.completionHistory.length,0);assert.equal(done.completionHistory[0].userId,'operator');assert.equal(done.completionHistory[0].userName,'Operator');assert.equal(done.completionHistory[0].completedDate,now);assert.equal(done.nextDueDate,'2026-10-30T12:00:00.000Z');
 assert.equal(recordEntry(done,user,entry,'complete').completionHistory.length,1);
});
test('only caller progress replaced and cleared; other operator history stays private',()=>{
 const base=taskInput(input);const a=recordEntry(base,user,entry,'progress');const b=recordEntry(a,{...user,id:'other'},entry,'progress');
 assert.equal(b.progressSaves.length,2);
 const done=recordEntry(b,user,entry,'complete');assert.equal(done.progressSaves.length,1);
 const visible=visibleTask(done,{...user,id:'other'});assert.equal(visible.completionHistory.length,0);assert.equal(visible.progressSaves.length,1);
 assert.equal(visibleTask(done,{role:'admin'}).completionHistory.length,1);
});
test('inactive tasks and incomplete checklist reject completion',()=>{
 assert.throws(()=>recordEntry({...taskInput(input),isActive:false},user,entry,'complete'),{status:409});
 assert.throws(()=>recordEntry(taskInput(input),user,{...entry,checklistItems:[]},'complete'),{status:400});
});
test('full history refuses writes without dropping previous records',()=>{
 const task={...taskInput(input),completionHistory:Array.from({length:100},(_,i)=>({requestId:`old-${i}`,userId:'operator'}))};
 assert.throws(()=>recordEntry(task,user,entry,'complete'),{status:409});assert.equal(task.completionHistory.length,100);
});
