import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, User, LoginData, RegisterData, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Invalid stored user, will fetch from API
        }
      }
    }
    setIsLoading(false);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    
    try {
      const userData = await api.getProfile(token);
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.message?.includes('unauthorized') || apiError.message?.includes('invalid')) {
        logout();
      }
      throw error;
    }
  }, [token]);

  // Fetch profile when token changes
  useEffect(() => {
    if (token && !user) {
      fetchProfile().catch(() => {
        // Silent fail, user can manually retry
      });
    }
  }, [token, user, fetchProfile]);

  const login = async (data: LoginData) => {
    const response = await api.login(data);
    const newToken = response.token;
    
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    
    if (response.user) {
      setUser(response.user);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  };

  const register = async (data: RegisterData) => {
    const response = await api.register(data);
    const newToken = response.token;
    
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    
    if (response.user) {
      setUser(response.user);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
