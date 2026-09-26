import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { AuthUser } from './auth-context';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('matrixflow_token');
    const email = localStorage.getItem('matrixflow_email');
    if (!token || !email) return null;
    return { email, token, role: localStorage.getItem('matrixflow_role') || 'user' };
  });

  const login = (email: string, token: string, role: string = 'Admin') => {
    localStorage.setItem('matrixflow_token', token);
    localStorage.setItem('matrixflow_email', email);
    localStorage.setItem('matrixflow_role', role);
    setUser({ email, role, token });
  };

  const logout = () => {
    localStorage.removeItem('matrixflow_token');
    localStorage.removeItem('matrixflow_email');
    localStorage.removeItem('matrixflow_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};