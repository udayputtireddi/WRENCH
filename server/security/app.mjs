import express from 'express';
import { authenticate, HttpError } from './policy.mjs';

export function createApi({verify,store}) {
  const api=express.Router();
  api.use((_req,res,next)=>{res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');next();});
  api.use(async(req,res,next)=>{
    try {res.locals.uid=await authenticate(req.headers.authorization,verify);next();}
    catch(e) {next(e);}
  });
  api.use(express.json({limit:'600kb',strict:true}));
  const run=(action,input)=>(req,res,next)=>Promise.resolve().then(()=>store.execute(res.locals.uid,action,input(req))).then(result=>res.json(result)).catch(next);
  api.get('/session',run('snapshot',()=>({})));
  api.post('/tasks/import',run('import',req=>req.body));
  api.delete('/tasks',run('clear',req=>req.body));
  api.post('/tasks/:id/complete',run('complete',req=>({id:req.params.id,entry:req.body})));
  api.put('/tasks/:id/progress',run('progress',req=>({id:req.params.id,entry:req.body})));
  api.delete('/members/:id',run('removeMember',req=>({id:req.params.id})));
  api.use((_req,_res,next)=>next(new HttpError(404,'API endpoint not found')));
  api.use((err,_req,res,_next)=>{
    const status=err instanceof HttpError?err.status:err.type==='entity.too.large'?413:err.type==='entity.parse.failed'?400:503;
    res.status(status).json({error:err instanceof HttpError?err.message:status===413?'Request too large':status===400?'Invalid JSON':'Service unavailable; please retry'});
  });
  return api;
}
