import { createContext } from 'react';

export interface AuthUser {
  email: string;
  role: string;
  token: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, token: string, role?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);