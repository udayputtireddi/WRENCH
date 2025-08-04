// Role-based authentication system
export type UserRole = 'user' | 'admin' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shift?: 'morning' | 'afternoon' | 'night';
  department?: string;
}

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Operator',
    email: 'john.operator@company.com',
    role: 'user',
    shift: 'morning',
    department: 'Production'
  },
  {
    id: 'admin-001',
    name: 'Sarah Manager',
    email: 'sarah.manager@company.com',
    role: 'admin',
    department: 'Maintenance'
  },
  {
    id: 'supervisor-001',
    name: 'Mike Supervisor',
    email: 'mike.supervisor@company.com',
    role: 'supervisor',
    shift: 'afternoon',
    department: 'Quality'
  }
];

class AuthService {
  private static currentUser: User | null = null;

  // Simulate login
  static login(email: string): User | null {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  // Check if user has admin access
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'supervisor';
  }

  // Check if user is regular user
  static isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }

  // Logout
  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Quick login for demo purposes
  static quickLogin(role: UserRole): User {
    const user = mockUsers.find(u => u.role === role) || mockUsers[0];
    this.login(user.email);
    return user;
  }
}

export default AuthService;
