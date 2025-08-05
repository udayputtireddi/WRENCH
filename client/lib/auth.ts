// Role-based authentication system
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

// User database - starts empty, users are added when they sign in
const userDatabase: Array<User & { password: string }> = [];

class AuthService {
  private static currentUser: User | null = null;

  // Authenticate user with email and password
  static login(email: string, password: string): User | null {
    let userRecord = userDatabase.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    
    // If user doesn't exist, create a new account automatically
    if (!userRecord) {
      // Determine role based on email domain or specific patterns
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const department = role === 'admin' ? 'Management' : 'Production';
      
      userRecord = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        password, // In production, this would be hashed
        role,
        department,
        createdAt: new Date(),
      };
      
      userDatabase.push(userRecord);
    } else if (userRecord.password !== password) {
      // If user exists but password doesn't match, reject login
      return null;
    }

    // Create user object without password
    const user: User = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role,
      department: userRecord.department,
      createdAt: userRecord.createdAt,
      lastLogin: new Date(),
    };

    this.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    
    // Update last login in database
    userRecord.lastLogin = new Date();
    
    return user;
  }

  // Register new user (admin only)
  static register(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
  }): User | null {
    // Check if user already exists
    if (userDatabase.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return null;
    }

    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      ...userData,
      createdAt: new Date(),
    };

    userDatabase.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = localStorage.getItem("currentUser");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }

  // Check if user has admin access
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  }

  // Check if user is regular user
  static isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "user";
  }

  // Logout
  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
  }

  // Get all users (admin only)
  static getAllUsers(): User[] {
    return userDatabase.map(({ password, ...user }) => user);
  }

  // Update user (admin only)
  static updateUser(userId: string, updates: Partial<User>): boolean {
    const userIndex = userDatabase.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      userDatabase[userIndex] = { ...userDatabase[userIndex], ...updates };
      return true;
    }
    return false;
  }

  // Delete user (admin only)
  static deleteUser(userId: string): boolean {
    const userIndex = userDatabase.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      userDatabase.splice(userIndex, 1);
      return true;
    }
    return false;
  }

  // Clear all users (admin only - for system reset)
  static clearAllUsers(): void {
    userDatabase.length = 0;
    this.currentUser = null;
    localStorage.removeItem("currentUser");
  }
}

export default AuthService;
