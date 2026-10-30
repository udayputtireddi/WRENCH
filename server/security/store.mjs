import { member, admin, identifier, taskInput, recordEntry, visibleTask, HttpError, object } from './policy.mjs';

// Every operation reads membership inside the same transaction as protected records.
export class WrenchStore {
  constructor(db) { this.db=db; }
  async execute(uid, action, input = {}) {
    return this.db.runTransaction(async tx=>{
      const quotaRef=this.db.collection('requestLimits').doc(uid);
      const quotaDoc=await tx.get(quotaRef);
      const minute=Math.floor(Date.now()/60000);
      const count=quotaDoc.data()?.minute===minute?quotaDoc.data().count:0;
      if(count>=120) throw new HttpError(429,'Too many requests; retry next minute');
      const result=await this.authorized(tx,uid,action,input);
      tx.set(quotaRef,{minute,count:count+1});
      return result;
    });
  }
  async authorized(tx,uid,action,input) {
      const members=this.db.collection('members');
      const tasks=this.db.collection('tasks');
      const user=member((await tx.get(members.doc(uid))).data(),uid);
      if(action==='snapshot') {
        const taskDocs=await tx.get(tasks.limit(251));
        if(taskDocs.size>250) throw new HttpError(409,'Catalog capacity exceeded');
        let users=[];
        if(user.role==='admin') {
          const docs=await tx.get(members.where('active','==',true).limit(251));
          if(docs.size>250) throw new HttpError(409,'Member capacity exceeded');
          users=docs.docs.map(d=>member(d.data(),d.id));
        }
        const snapshot={user,users,tasks:taskDocs.docs.map(d=>visibleTask(d.data(),user))};
        if(Buffer.byteLength(JSON.stringify(snapshot))>5000000) throw new HttpError(409,'Snapshot capacity reached; administrator archival is required');
        return snapshot;
      }
      if(action==='complete' || action==='progress') {
        identifier(input.id);
        const ref=tasks.doc(input.id);
        const doc=await tx.get(ref);
        if(!doc.exists) throw new HttpError(404,'Task not found');
        const task=recordEntry(doc.data(),user,input.entry,action);
        tx.set(ref,task);
        return {ok:true};
      }
      admin(user);
      if(action==='removeMember') {
        const id=identifier(input.id);
        if(id===uid) throw new HttpError(409,'You cannot remove your own access');
        const target=members.doc(id);
        const doc=await tx.get(target);
        if(!doc.exists) throw new HttpError(404,'Member not found');
        // Keeps historical attribution; removes WRENCH access without deleting a shared Firebase account.
        tx.update(target,{active:false});
        return {ok:true};
      }
      if(action==='import') {
        object(input,['tasks']);
        if(!Array.isArray(input.tasks) || !input.tasks.length || input.tasks.length>100) throw new HttpError(400,'Import 1–100 tasks');
        const fresh=input.tasks.map(t=>taskInput(t));
        if(new Set(fresh.map(t=>t.id)).size!==fresh.length) throw new HttpError(400,'Duplicate task IDs');
        const existing=await tx.get(tasks.limit(251));
        if(existing.size+fresh.length>250) throw new HttpError(409,'Maximum 250 tasks');
        const ids=new Set(existing.docs.map(d=>d.id));
        if(fresh.some(t=>ids.has(t.id))) throw new HttpError(409,'Task already exists; existing history was preserved');
        fresh.forEach(t=>tx.create(tasks.doc(t.id),t));
        return {ok:true};
      }
      if(action==='clear') {
        object(input,['confirmation']);
        if(input.confirmation!=='DELETE ALL TASKS') throw new HttpError(400,'Explicit confirmation required');
        const docs=await tx.get(tasks.limit(251));
        if(docs.size>250) throw new HttpError(409,'Catalog capacity exceeded');
        docs.docs.forEach(d=>tx.delete(d.ref));
        return {ok:true};
      }
      throw new HttpError(404,'Unknown operation');
  }
}
