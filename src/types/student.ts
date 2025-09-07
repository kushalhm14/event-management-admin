// Student-specific types for the event management system

export interface Student {
  id: string;
  college_id: string;
  name: string;
  roll_no: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  college_id: string;
  title: string;
  description: string;
  type: 'workshop' | 'seminar' | 'hackathon' | 'cultural' | 'sports';
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  registered_count: number;
  status: 'active' | 'cancelled' | 'completed';
  image_url?: string;
  mentors?: string[];
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  student_id: string;
  event_id: string;
  registered_at: string;
  attendance_status: 'present' | 'absent' | 'pending';
  feedback?: {
    rating: number;
    comment?: string;
    submitted_at: string;
  };
  cert_url?: string;
  event_title?: string; // Populated when fetching registrations
}

export interface FeedbackSubmission {
  rating: number;
  comment?: string;
}

export interface RegistrationError {
  code: 'DUPLICATE' | 'CAPACITY_FULL' | 'EVENT_CANCELLED' | 'VALIDATION_ERROR';
  message: string;
}

export interface StudentUpdateData {
  name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
}

// Navigation types
export type StudentStackParamList = {
  Login: undefined;
  EventList: undefined;
  EventDetails: { eventId: string };
  MyRegistrations: undefined;
  FeedbackScreen: { registrationId: string };
  ProfileScreen: undefined;
};
