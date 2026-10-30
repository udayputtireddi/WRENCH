import { randomUUID } from 'node:crypto';

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const fail = (message = 'Invalid request') => { throw new HttpError(400, message); };
export function object(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k => !allowed.includes(k))) fail();
  return value;
}
export function identifier(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) fail();
  return value;
}
const string = (v, max = 200, empty = false) => {
  if (typeof v !== 'string' || v.length > max || (!empty && !v.trim())) fail();
  return v;
};
const list = (v, max, fn) => {
  if (!Array.isArray(v) || v.length > max) fail();
  return v.map(fn);
};
export function member(value, uid) {
  if (!value || value.active !== true || !['admin','user'].includes(value.role)) throw new HttpError(403, 'WRENCH access has not been granted');
  return { id: uid, name: string(value.name), email: string(value.email, 320), role: value.role,
    department: string(value.department || '', 100, true), createdAt: value.createdAt };
}
export function admin(user) {
  if (user.role !== 'admin') throw new HttpError(403, 'Administrator access required');
}
export async function authenticate(header, verify) {
  if (typeof header !== 'string' || !/^Bearer [^\s]{1,8192}$/.test(header)) throw new HttpError(401, 'Sign in required');
  let token;
  try { token = await verify(header.slice(7), true); } catch { throw new HttpError(401, 'Session is invalid or expired'); }
  if (!token?.uid || token.firebase?.sign_in_provider === 'anonymous') throw new HttpError(401, 'Sign in required');
  return token.uid;
}
export function taskInput(input, now = new Date().toISOString()) {
  object(input, ['id','machineId','machineName','taskName','description','frequency','category','estimatedTimeMinutes','weeklyDay','safetyNotes','requiredTools','isActive']);
  if (!['daily','weekly','monthly'].includes(input.frequency) || !['maintenance','inspection','cleaning'].includes(input.category)) fail();
  if (!Number.isInteger(input.estimatedTimeMinutes) || input.estimatedTimeMinutes < 1 || input.estimatedTimeMinutes > 1440 || typeof input.isActive !== 'boolean') fail();
  if (input.weeklyDay !== undefined && !['monday','tuesday','wednesday','thursday','friday'].includes(input.weeklyDay)) fail();
  return { id:identifier(input.id), machineId:identifier(input.machineId), machineName:string(input.machineName), taskName:string(input.taskName), description:string(input.description,4000,true), frequency:input.frequency, category:input.category, estimatedTimeMinutes:input.estimatedTimeMinutes,
    ...(input.weeklyDay ? {weeklyDay:input.weeklyDay}:{}), safetyNotes:list(input.safetyNotes,30,v=>string(v,1000)), requiredTools:list(input.requiredTools,30,v=>string(v,200)), isActive:input.isActive, createdDate:now, nextDueDate:now, completionHistory:[], progressSaves:[] };
}
export function entryInput(input) {
  object(input, ['checklistItems','notes','photos','timeSpentMinutes','requestId']);
  const checklistItems=list(input.checklistItems,100,v=>{
    object(v,['id','text','completed']);
    if(typeof v.completed !== 'boolean') fail();
    return {id:identifier(v.id),text:string(v.text,1000),completed:v.completed};
  });
  if(new Set(checklistItems.map(x=>x.id)).size!==checklistItems.length) fail();
  const photos=list(input.photos || [],2,v=>{
    if(typeof v !== 'string' || v.length>200000 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(v)) fail('Use at most two PNG, JPEG or WebP images under 150 KB each');
    return v;
  });
  if(!Number.isInteger(input.timeSpentMinutes ?? 0) || input.timeSpentMinutes<0 || input.timeSpentMinutes>1440) fail();
  return {checklistItems,photos,notes:string(input.notes || '',4000,true),timeSpentMinutes:input.timeSpentMinutes??0,requestId:identifier(input.requestId)};
}
export function visibleTask(task, user) {
  if(user.role==='admin') return task;
  return {...task, completionHistory:task.completionHistory.filter(x=>x.userId===user.id), progressSaves:task.progressSaves.filter(x=>x.userId===user.id)};
}
export function recordEntry(task, user, input, kind, now = new Date().toISOString()) {
  if(!task.isActive) throw new HttpError(409,'Task is inactive');
  const data=entryInput(input);
  const target=kind==='complete'?'completionHistory':'progressSaves';
  // Idempotent retry for a given operator and action. Never accept client identity or dates.
  if(task[target].some(x=>x.requestId===data.requestId && x.userId===user.id)) return task;
  if(kind==='complete' && task.completionHistory.length>=100) throw new HttpError(409,'Task history capacity reached; administrator archival is required');
  const result=structuredClone(task);
  const entry={...data,id:randomUUID(),taskId:task.id,userId:user.id,userName:user.name};
  if(kind==='complete') {
    if(!data.checklistItems.length || data.checklistItems.some(x=>!x.completed)) fail('Complete the checklist first');
    result.completionHistory.push({...entry,completedDate:now});
    result.lastCompletedDate=now;
    const due=new Date(now);
    if(task.frequency==='monthly') due.setUTCMonth(due.getUTCMonth()+1);
    else due.setUTCDate(due.getUTCDate()+(task.frequency==='weekly'?7:1));
    result.nextDueDate=due.toISOString();
    result.progressSaves=result.progressSaves.filter(x=>x.userId!==user.id);
  } else {
    result.progressSaves=result.progressSaves.filter(x=>x.userId!==user.id);
    result.progressSaves.push({...entry,savedDate:now});
  }
  if(Buffer.byteLength(JSON.stringify(result))>700000) throw new HttpError(409,'Task storage capacity reached; no data was changed');
  return result;
}
