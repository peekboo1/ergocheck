import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  error: boolean;
  message: string;
  data: {
    token: string;
    name: string;
    email: string;
    role: 'supervisor' | 'employee' | 'personal' | 'superadmin';
  };
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  // Login (enterprise & personal)
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  
  // Supervisor login
  supervisorLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  
  // Personal login
  personalLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  
  // Superadmin login
  superadminLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/super-admin/login', data);
    return response.data;
  },
  
  // Register personal account
  registerPersonal: async (data: { name: string; email: string; password: string }): Promise<any> => {
    const response = await api.post('/personal/register', data);
    return response.data;
  },
  
  // Register supervisor account
  registerSupervisor: async (data: { name: string; email: string; password: string; companyId: string }): Promise<any> => {
    const response = await api.post('/supervisor/register', data);
    return response.data;
  },
  
  // Register employee
  registerEmployee: async (data: { name: string; email: string; password: string; divisionId: string }): Promise<any> => {
    const response = await api.post('/employee/register', data);
    return response.data;
  },
  
  // Logout
  logout: async (): Promise<any> => {
    const response = await api.post('/auth/logout');
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return response.data;
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
};