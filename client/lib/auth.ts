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

// User database - In production, this would be a real database
const userDatabase: Array<User & { password: string }> = [
  {
    id: "admin-001",
    name: "System Administrator",
    email: "admin@checkmate.com",
    password: "admin123",
    role: "admin",
    department: "IT",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "operator-001", 
    name: "Production Operator",
    email: "operator@checkmate.com",
    password: "operator123",
    role: "user",
    department: "Production",
    createdAt: new Date("2024-01-15"),
  }
];

class AuthService {
  private static currentUser: User | null = null;

  // Authenticate user with email and password
  static login(email: string, password: string): User | null {
    const userRecord = userDatabase.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (userRecord) {
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
    return null;
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
}

export default AuthService;
