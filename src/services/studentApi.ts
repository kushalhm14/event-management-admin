import { api } from './commonApi';
import { mockStudentApi } from './mockStudentData';
import { Event, Student, Registration, FeedbackSubmission, StudentUpdateData } from '../types/student';

// Configuration - toggle between mock and real API
const USE_MOCK = process.env.EXPO_USE_MOCK_DATA !== 'false'; // default true

/**
 * Student API service with mock toggle
 */
export const studentApi = {
  /**
   * Fetch all events for browsing
   */
  async fetchEvents(): Promise<Event[]> {
    if (USE_MOCK) {
      return mockStudentApi.fetchEvents();
    }

    try {
      const response = await api.get('/colleges/col-1/events');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw new Error('Failed to load events');
    }
  },

  /**
   * Fetch single event details
   */
  async fetchEvent(eventId: string): Promise<Event> {
    if (USE_MOCK) {
      return mockStudentApi.fetchEvent(eventId);
    }

    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event:', error);
      throw new Error('Failed to load event details');
    }
  },

  /**
   * Register student for an event
   */
  async registerForEvent(eventId: string, studentId: string): Promise<Registration> {
    if (USE_MOCK) {
      return mockStudentApi.registerForEvent(eventId, studentId);
    }

    try {
      const response = await api.post(`/events/${eventId}/register`, {
        student_id: studentId,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to register for event:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        if (error.response.data?.message?.includes('already registered')) {
          const err = new Error('Already registered for this event') as any;
          err.code = 409;
          throw err;
        }
        if (error.response.data?.message?.includes('full') || error.response.data?.message?.includes('capacity')) {
          const err = new Error('Event is full') as any;
          err.code = 409;
          throw err;
        }
      }
      
      if (error.response?.status === 400) {
        const err = new Error('Cannot register for this event') as any;
        err.code = 400;
        throw err;
      }

      throw new Error('Failed to register for event');
    }
  },

  /**
   * Fetch student's registrations
   */
  async fetchStudentRegistrations(studentId: string): Promise<Registration[]> {
    if (USE_MOCK) {
      return mockStudentApi.fetchStudentRegistrations(studentId);
    }

    try {
      const response = await api.get(`/registrations?student_id=${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      throw new Error('Failed to load registrations');
    }
  },

  /**
   * Submit feedback for a registration
   */
  async submitFeedback(registrationId: string, feedback: FeedbackSubmission): Promise<Registration> {
    if (USE_MOCK) {
      return mockStudentApi.submitFeedback(registrationId, feedback);
    }

    try {
      const response = await api.post(`/registrations/${registrationId}/feedback`, feedback);
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      
      if (error.response?.status === 409) {
        const err = new Error('Feedback already submitted') as any;
        err.code = 409;
        throw err;
      }

      throw new Error('Failed to submit feedback');
    }
  },

  /**
   * Update student profile
   */
  async updateProfile(collegeId: string, studentId: string, updates: StudentUpdateData): Promise<Student> {
    if (USE_MOCK) {
      return mockStudentApi.updateProfile(collegeId, studentId, updates);
    }

    try {
      const response = await api.put(`/colleges/${collegeId}/students/${studentId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile');
    }
  },

  /**
   * Get student profile
   */
  async getStudent(studentId: string): Promise<Student> {
    if (USE_MOCK) {
      return mockStudentApi.getStudent(studentId);
    }

    try {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch student:', error);
      throw new Error('Failed to load student profile');
    }
  },

  /**
   * Get certificate for a registration
   */
  async fetchCertificate(registrationId: string): Promise<{ cert_url: string }> {
    if (USE_MOCK) {
      return mockStudentApi.fetchCertificate(registrationId);
    }

    try {
      const response = await api.get(`/registrations/${registrationId}/certificate`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch certificate:', error);
      
      if (error.response?.status === 404) {
        const err = new Error('Certificate not found') as any;
        err.code = 404;
        throw err;
      }

      throw new Error('Failed to load certificate');
    }
  },

  /**
   * Search events by query (client-side filtering in mock mode)
   */
  async searchEvents(query: string): Promise<Event[]> {
    const events = await this.fetchEvents();
    
    if (!query.trim()) {
      return events;
    }

    const searchTerm = query.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.type.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm)
    );
  },
};

export default studentApi;
