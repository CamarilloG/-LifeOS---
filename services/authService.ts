import { User } from '../types';

// Mock storage keys
const USERS_KEY = 'lifeos-users';
const SESSION_KEY = 'lifeos-session';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login
  async login(email: string, password: string): Promise<User> {
    await delay(800); // Simulate network delay

    const usersStr = localStorage.getItem(USERS_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    // Simple mock check (In reality, never store plain text passwords)
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    const sessionUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.name[0].toUpperCase()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Register
  async register(email: string, password: string, name: string): Promise<User> {
    await delay(1000);

    const usersStr = localStorage.getItem(USERS_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (users.some((u: any) => u.email === email)) {
      throw new Error('该邮箱已被注册');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // Mock: Storing plain text for demo only
      name
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto login after register
    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.name[0].toUpperCase()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return sessionUser;
  },

  // Logout
  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(SESSION_KEY);
  },

  // Check Session
  restoreSession(): User | null {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
};