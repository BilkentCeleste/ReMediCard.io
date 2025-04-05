export interface User {
  username?: string;
  email?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loginAuth: (body: any) => Promise<void>;
  registerAuth: (body: any) => Promise<void>;
  logoutAuth: () => Promise<void>;
  addToken: (token: string) => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
} 