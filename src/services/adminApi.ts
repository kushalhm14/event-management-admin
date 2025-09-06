import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  College,
  Event,
  EventFormData,
  Student,
  StudentFormData,
  Registration,
  AttendanceUpdate,
  EventSummary,
  PopularEvent,
  TopStudent,
  AdminDashboardStats,
} from '../types/admin';
import {
  mockColleges,
  mockEvents,
  mockStudents,
  mockRegistrations,
  mockDashboardStats,
  mockPopularEvents,
  mockTopStudents,
  mockEventSummary,
  mockEventFeedback,
} from './mockData';

// Configuration
const USE_MOCK_DATA = true; // Set to false when real backend is available
const MOCK_DELAY = 500; // Simulate network delay

// Helper function to simulate API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Token management
class TokenManager {
  private static TOKEN_KEY = 'admin_token';

  static async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      try {
        return await SecureStore.getItemAsync(this.TOKEN_KEY);
      } catch {
        return null;
      }
    }
  }

  static async setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      try {
        await SecureStore.setItemAsync(this.TOKEN_KEY, token);
      } catch (error) {
        console.warn('Failed to store token securely:', error);
      }
    }
  }

  static async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(this.TOKEN_KEY);
    } else {
      try {
        await SecureStore.deleteItemAsync(this.TOKEN_KEY);
      } catch (error) {
        console.warn('Failed to remove token:', error);
      }
    }
  }
}

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  const token = await TokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it
      await TokenManager.removeToken();
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminApi = {
  // Token management
  async validateToken(token: string): Promise<boolean> {
    try {
      // For prototype, check against env variable or use mock validation
      const expectedToken = process.env.EXPO_PUBLIC_ADMIN_TOKEN || 'admin123';
      return token === expectedToken;
    } catch {
      return false;
    }
  },

  async setAuthToken(token: string): Promise<void> {
    await TokenManager.setToken(token);
  },

  async getAuthToken(): Promise<string | null> {
    return TokenManager.getToken();
  },

  async removeAuthToken(): Promise<void> {
    await TokenManager.removeToken();
  },

  // Colleges
  async getColleges(): Promise<College[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockColleges;
    }
    const response = await api.get('/colleges');
    return response.data;
  },

  async createCollege(data: { name: string }): Promise<College> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const newCollege: College = {
        id: `col-${Date.now()}`,
        name: data.name,
        created_at: new Date().toISOString(),
      };
      return newCollege;
    }
    const response = await api.post('/colleges', data);
    return response.data;
  },

  // Events
  async getEvents(collegeId: string): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockEvents.filter(event => event.college_id === collegeId);
    }
    const response = await api.get(`/colleges/${collegeId}/events`);
    return response.data;
  },

  async createEvent(collegeId: string, data: EventFormData): Promise<Event> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        college_id: collegeId,
        ...data,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        registrations_count: 0,
      };
      // In real implementation, this would be stored
      mockEvents.push(newEvent);
      return newEvent;
    }
    const response = await api.post(`/colleges/${collegeId}/events`, data);
    return response.data;
  },

  async updateEvent(eventId: string, data: Partial<EventFormData>): Promise<Event> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex === -1) throw new Error('Event not found');
      
      mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...data };
      return mockEvents[eventIndex];
    }
    const response = await api.put(`/events/${eventId}`, data);
    return response.data;
  },

  async getEventDetails(eventId: string): Promise<Event> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      return event;
    }
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Registrations & Attendance
  async getEventRegistrations(eventId: string): Promise<Registration[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      // For demo, return mock registrations for any event
      return mockRegistrations;
    }
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },

  async updateAttendance(registrationId: string, data: AttendanceUpdate): Promise<{ success: boolean; attendance_id: string }> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      // In real implementation, this would update the database
      const registration = mockRegistrations.find(r => r.registration_id === registrationId);
      if (registration) {
        registration.attendance_status = data.status;
      }
      return { success: true, attendance_id: `att-${Date.now()}` };
    }
    const response = await api.post(`/registrations/${registrationId}/attendance`, data);
    return response.data;
  },

  async bulkUpdateAttendance(registrationIds: string[], status: string, markedBy: string): Promise<{ success: boolean; count: number }> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      // In real implementation, this would update multiple records
      registrationIds.forEach(id => {
        const registration = mockRegistrations.find(r => r.registration_id === id);
        if (registration) {
          registration.attendance_status = status as any;
        }
      });
      return { success: true, count: registrationIds.length };
    }
    const response = await api.post('/registrations/attendance/bulk', {
      registration_ids: registrationIds,
      status,
      marked_by: markedBy,
    });
    return response.data;
  },

  // Students
  async createStudent(collegeId: string, data: StudentFormData): Promise<Student> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        college_id: collegeId,
        ...data,
        created_at: new Date().toISOString(),
      };
      mockStudents.push(newStudent);
      return newStudent;
    }
    const response = await api.post(`/colleges/${collegeId}/students`, data);
    return response.data;
  },

  async getStudents(collegeId: string): Promise<Student[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockStudents.filter(student => student.college_id === collegeId);
    }
    const response = await api.get(`/colleges/${collegeId}/students`);
    return response.data;
  },

  async getStudentParticipation(studentId: string): Promise<Registration[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockRegistrations.filter(reg => reg.student_id === studentId);
    }
    const response = await api.get(`/reports/student/${studentId}/participation`);
    return response.data;
  },

  // Reports
  async getDashboardStats(collegeId: string): Promise<AdminDashboardStats> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockDashboardStats;
    }
    const response = await api.get(`/reports/dashboard?collegeId=${collegeId}`);
    return response.data;
  },

  async getEventPopularity(collegeId: string, type?: string, limit?: number): Promise<PopularEvent[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      let filtered = [...mockPopularEvents];
      if (limit) {
        filtered = filtered.slice(0, limit);
      }
      return filtered;
    }
    const params = new URLSearchParams({ collegeId });
    if (type) params.append('type', type);
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get(`/reports/event-popularity?${params.toString()}`);
    return response.data;
  },

  async getEventSummary(eventId: string): Promise<EventSummary> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const summary = mockEventSummary[eventId];
      if (!summary) throw new Error('Event summary not found');
      return summary;
    }
    const response = await api.get(`/reports/event/${eventId}/summary`);
    return response.data;
  },

  async getTopActiveStudents(collegeId: string, limit: number = 3): Promise<TopStudent[]> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockTopStudents.slice(0, limit);
    }
    const response = await api.get(`/reports/top-active-students?collegeId=${collegeId}&limit=${limit}`);
    return response.data;
  },

  // Feedback
  async getEventFeedback(eventId: string): Promise<Array<{ registration_id: string; rating: number; comment: string; student_name: string }>> {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return mockEventFeedback[eventId] || [];
    }
    const response = await api.get(`/events/${eventId}/feedback`);
    return response.data;
  },
};

export { TokenManager };
export default api;
