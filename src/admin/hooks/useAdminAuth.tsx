import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { adminApi } from '../../services/adminApi';

interface AdminAuthContextType {
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = !!token;

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = await adminApi.getAuthToken();
      if (storedToken) {
        const isValid = await adminApi.validateToken(storedToken);
        if (isValid) {
          setToken(storedToken);
        } else {
          await adminApi.removeAuthToken();
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (inputToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const isValid = await adminApi.validateToken(inputToken);
      
      if (isValid) {
        await adminApi.setAuthToken(inputToken);
        setToken(inputToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await adminApi.removeAuthToken();
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AdminAuthContextType = {
    token,
    isAdmin,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
