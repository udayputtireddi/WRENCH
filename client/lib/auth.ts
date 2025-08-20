import { supabase } from './supabase';

// Role-based authentication system with Supabase
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
}

class AuthService {
  private static currentUser: User | null = null;

  // Authenticate user with email and password (auto-registration)
  static async login(email: string, password: string): Promise<User | null> {
    try {
      // Check if user exists in our users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        return null;
      }

      if (!existingUser) {
        // Auto-register new user
        const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
        const name = email.split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        const department = role === 'admin' ? 'Management' : 'Production';

        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            name,
            email: email.toLowerCase(),
            role,
            department,
            last_login: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          return null;
        }

        const user: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as UserRole,
          department: newUser.department,
          createdAt: new Date(newUser.created_at),
          lastLogin: new Date()
        };

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      } else {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', existingUser.id);

        const user: User = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role as UserRole,
          department: existingUser.department,
          createdAt: new Date(existingUser.created_at),
          lastLogin: new Date()
        };

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Register new user (admin only)
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
  }): Promise<User | null> {
    try {
      if (!this.isAdmin()) {
        console.error('Only admins can register new users');
        return null;
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email.toLowerCase(),
          role: userData.role,
          department: userData.department
        }])
        .select()
        .single();

      if (error) {
        console.error('Error registering user:', error);
        return null;
      }

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as UserRole,
        department: newUser.department,
        createdAt: new Date(newUser.created_at)
      };
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const userData = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (userData.createdAt) {
        userData.createdAt = new Date(userData.createdAt);
      }
      if (userData.lastLogin) {
        userData.lastLogin = new Date(userData.lastLogin);
      }
      this.currentUser = userData;
      return this.currentUser;
    }

    return null;
  }

  // Check if user has admin access
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
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

  // Get all users (admin only)
  static async getAllUsers(): Promise<User[]> {
    if (!this.isAdmin()) {
      return [];
    }

    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        department: user.department,
        createdAt: new Date(user.created_at),
        lastLogin: user.last_login ? new Date(user.last_login) : undefined
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Update user (admin only)
  static async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    if (!this.isAdmin()) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // Delete user (admin only)
  static async deleteUser(userId: string): Promise<boolean> {
    if (!this.isAdmin()) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Clear all users (admin only - for system reset)
  static async clearAllUsers(): Promise<void> {
    if (!this.isAdmin()) {
      return;
    }

    try {
      await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep system users

      this.currentUser = null;
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error clearing users:', error);
    }
  }
}

export default AuthService;
