import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { session, startSession } from '@/lib/session';

export function SessionProvider({children}:{children:ReactNode}) {
  useSyncExternalStore(session.subscribe,session.get);
  useEffect(()=>{startSession().catch(()=>{});},[]);
  return <>{children}</>;
}
export function RequireSession() {
  const current=useSyncExternalStore(session.subscribe,session.get);
  if(current.loading) return <p className="p-8">Verifying access…</p>;
  if(!current.user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
