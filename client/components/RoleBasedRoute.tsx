import { ReactNode } from 'react';
import AuthService, { UserRole } from '@/lib/auth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export default function RoleBasedRoute({ children, allowedRoles, fallback }: RoleBasedRouteProps) {
  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    return fallback || <div>Please log in to access this page.</div>;
  }
  
  if (!allowedRoles.includes(currentUser.role)) {
    return fallback || <div>You don't have permission to access this page.</div>;
  }
  
  return <>{children}</>;
}
