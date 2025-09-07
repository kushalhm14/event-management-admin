import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer';
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        // Mock admin user
        setUser({
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@university.edu',
          role: 'admin',
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string): Promise<boolean> => {
    try {
      if (token === 'admin123') {
        await AsyncStorage.setItem('adminToken', token);
        setUser({
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@university.edu',
          role: 'admin',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('adminToken');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
