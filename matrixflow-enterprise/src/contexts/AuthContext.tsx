import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, token: string, role?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay una sesión guardada en localStorage al cargar
    const storedToken = localStorage.getItem('matrixflow_token');
    const storedEmail = localStorage.getItem('matrixflow_email');
    const storedRole = localStorage.getItem('matrixflow_role') || 'Admin';

    if (storedToken && storedEmail) {
      setUser({ email: storedEmail, role: storedRole, token: storedToken });
    }
  }, []);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};