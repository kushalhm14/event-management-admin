import { useState, useEffect, useCallback } from 'react';
import { studentStorage } from '../../utils/storage';

interface UseStudentAuthReturn {
  studentId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (studentId: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Student authentication hook with AsyncStorage persistence
 */
export const useStudentAuth = (): UseStudentAuthReturn => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load student ID on hook initialization
  useEffect(() => {
    const loadStoredStudentId = async () => {
      try {
        const storedStudentId = await studentStorage.getStudentId();
        setStudentId(storedStudentId);
      } catch (error) {
        console.error('Failed to load student ID:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredStudentId();
  }, []);

  /**
   * Login with student ID
   */
  const login = useCallback(async (newStudentId: string) => {
    try {
      setIsLoading(true);
      
      // Validate student ID format (basic validation)
      if (!newStudentId || !newStudentId.trim()) {
        throw new Error('Student ID is required');
      }

      // Store in AsyncStorage
      await studentStorage.setStudentId(newStudentId.trim());
      
      // Update state
      setStudentId(newStudentId.trim());
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout and clear storage
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Clear AsyncStorage
      await studentStorage.clearAll();
      
      // Update state
      setStudentId(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    studentId,
    isLoading,
    isAuthenticated: !!studentId,
    login,
    logout,
  };
};
