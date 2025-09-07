import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  STUDENT_ID: 'student_id',
  STUDENT_DATA: 'student_data',
} as const;

/**
 * Student authentication storage utilities
 */
export const studentStorage = {
  /**
   * Store student ID for authentication
   */
  async setStudentId(studentId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENT_ID, studentId);
    } catch (error) {
      console.error('Failed to store student ID:', error);
      throw new Error('Failed to save login session');
    }
  },

  /**
   * Get stored student ID
   */
  async getStudentId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_ID);
    } catch (error) {
      console.error('Failed to get student ID:', error);
      return null;
    }
  },

  /**
   * Remove student ID (logout)
   */
  async removeStudentId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
    } catch (error) {
      console.error('Failed to remove student ID:', error);
    }
  },

  /**
   * Store student profile data for caching
   */
  async setStudentData(studentData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.STUDENT_DATA,
        JSON.stringify(studentData)
      );
    } catch (error) {
      console.error('Failed to store student data:', error);
    }
  },

  /**
   * Get cached student profile data
   */
  async getStudentData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get student data:', error);
      return null;
    }
  },

  /**
   * Clear all student-related storage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.STUDENT_ID,
        STORAGE_KEYS.STUDENT_DATA,
      ]);
    } catch (error) {
      console.error('Failed to clear student storage:', error);
    }
  },
};

export default studentStorage;
