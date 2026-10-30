import express from 'express';
import { createApi } from './security/app.mjs';
import { dependencies } from './security/firebase.mjs';

export function createServer() {
  const app=express();
  app.disable('x-powered-by');
  app.get('/api/ping',(_req,res)=>res.json({message:'Server operational'}));
  // Lazy initialization allows builds without credentials; requests fail closed until configured.
  let api: ReturnType<typeof createApi>;
  app.use('/api', (req,res,next)=>{
    try { api ||= createApi(dependencies()); api(req,res,next); }
    catch { res.set('Cache-Control','no-store').status(503).json({error:'Service is not configured'}); }
  });
  return app;
}
