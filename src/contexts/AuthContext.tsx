'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      
      // Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
      
      setUser({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      
      // Redirect based on role
      const roleRouteMap = {
        'supervisor': '/dashboard/supervisor',
        'employee': '/dashboard/employee',
        'personal': '/dashboard/personal',
        'superadmin': '/dashboard/superadmin'
      };
      
      router.push(roleRouteMap[response.data.role] || '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};