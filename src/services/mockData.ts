/**
 * Mock data for admin portal development and testing
 * This simulates backend API responses with realistic data
 */

import { 
  College, 
  Event, 
  Student, 
  Registration, 
  AdminDashboardStats,
  PopularEvent,
  TopStudent,
  EventSummary 
} from '../types/admin';

// Mock Colleges
export const mockColleges: College[] = [
  {
    id: 'col-1',
    name: 'Tech University',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'col-2',
    name: 'Engineering College',
    created_at: '2024-01-15T00:00:00Z',
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    college_id: 'col-1',
    title: 'Introduction to Machine Learning',
    description: 'A comprehensive workshop covering the basics of ML algorithms and implementation.',
    type: 'Workshop',
    start_time: '2025-09-15T10:00:00Z',
    end_time: '2025-09-15T16:00:00Z',
    location: 'Auditorium A',
    capacity: 100,
    status: 'scheduled',
    created_at: '2025-08-01T10:00:00Z',
    registrations_count: 45,
  },
  {
    id: 'evt-2',
    college_id: 'col-1',
    title: 'Web Development Bootcamp',
    description: 'Learn modern web development with React, Node.js, and databases.',
    type: 'Bootcamp',
    start_time: '2025-09-20T09:00:00Z',
    end_time: '2025-09-22T17:00:00Z',
    location: 'Computer Lab 1',
    capacity: 30,
    status: 'scheduled',
    created_at: '2025-08-05T10:00:00Z',
    registrations_count: 28,
  },
  {
    id: 'evt-3',
    college_id: 'col-1',
    title: 'Data Science Conference',
    description: 'Annual conference featuring industry experts and latest trends in data science.',
    type: 'Conference',
    start_time: '2025-10-01T09:00:00Z',
    end_time: '2025-10-02T18:00:00Z',
    location: 'Main Auditorium',
    capacity: 200,
    status: 'scheduled',
    created_at: '2025-08-10T10:00:00Z',
    registrations_count: 120,
  },
  {
    id: 'evt-4',
    college_id: 'col-1',
    title: 'AI Ethics Seminar',
    description: 'Discussion on ethical implications of artificial intelligence.',
    type: 'Seminar',
    start_time: '2025-08-30T14:00:00Z',
    end_time: '2025-08-30T16:00:00Z',
    location: 'Room 201',
    capacity: 50,
    status: 'completed',
    created_at: '2025-08-01T10:00:00Z',
    registrations_count: 35,
  },
  {
    id: 'evt-5',
    college_id: 'col-1',
    title: 'Hackathon 2025',
    description: '48-hour coding competition for students.',
    type: 'Competition',
    start_time: '2025-09-05T18:00:00Z',
    end_time: '2025-09-07T18:00:00Z',
    location: 'Innovation Hub',
    capacity: 80,
    status: 'cancelled',
    created_at: '2025-07-15T10:00:00Z',
    registrations_count: 65,
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'stu-1',
    college_id: 'col-1',
    name: 'Asha Patel',
    roll_no: 'CS2025-001',
    email: 'asha.patel@college.edu',
    created_at: '2024-08-01T10:00:00Z',
  },
  {
    id: 'stu-2',
    college_id: 'col-1',
    name: 'Rahul Kumar',
    roll_no: 'CS2025-002',
    email: 'rahul.kumar@college.edu',
    created_at: '2024-08-01T10:30:00Z',
  },
  {
    id: 'stu-3',
    college_id: 'col-1',
    name: 'Priya Sharma',
    roll_no: 'CS2025-003',
    email: 'priya.sharma@college.edu',
    created_at: '2024-08-01T11:00:00Z',
  },
  {
    id: 'stu-4',
    college_id: 'col-1',
    name: 'Arjun Singh',
    roll_no: 'CS2025-004',
    email: 'arjun.singh@college.edu',
    created_at: '2024-08-01T11:30:00Z',
  },
  {
    id: 'stu-5',
    college_id: 'col-1',
    name: 'Sneha Gupta',
    roll_no: 'CS2025-005',
    email: 'sneha.gupta@college.edu',
    created_at: '2024-08-01T12:00:00Z',
  },
];

// Mock Registrations
export const mockRegistrations: Registration[] = [
  {
    registration_id: 'reg-101',
    student_id: 'stu-1',
    name: 'Asha Patel',
    roll_no: 'CS2025-001',
    email: 'asha.patel@college.edu',
    registered_at: '2025-09-01T10:10:00Z',
    attendance_status: 'present',
    feedback: { rating: 5, comment: 'Great workshop, very informative!' },
  },
  {
    registration_id: 'reg-102',
    student_id: 'stu-2',
    name: 'Rahul Kumar',
    roll_no: 'CS2025-002',
    email: 'rahul.kumar@college.edu',
    registered_at: '2025-09-01T10:15:00Z',
    attendance_status: 'present',
    feedback: { rating: 4, comment: 'Good content, could use more hands-on exercises.' },
  },
  {
    registration_id: 'reg-103',
    student_id: 'stu-3',
    name: 'Priya Sharma',
    roll_no: 'CS2025-003',
    email: 'priya.sharma@college.edu',
    registered_at: '2025-09-01T10:20:00Z',
    attendance_status: 'absent',
    feedback: undefined,
  },
  {
    registration_id: 'reg-104',
    student_id: 'stu-4',
    name: 'Arjun Singh',
    roll_no: 'CS2025-004',
    email: 'arjun.singh@college.edu',
    registered_at: '2025-09-01T10:25:00Z',
    attendance_status: null,
    feedback: undefined,
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: AdminDashboardStats = {
  total_events: 5,
  total_registrations: 293,
  total_students: 150,
  upcoming_events: 3,
};

// Mock Popular Events
export const mockPopularEvents: PopularEvent[] = [
  { event_id: 'evt-3', title: 'Data Science Conference', registrations: 120 },
  { event_id: 'evt-5', title: 'Hackathon 2025', registrations: 65 },
  { event_id: 'evt-1', title: 'Introduction to Machine Learning', registrations: 45 },
  { event_id: 'evt-4', title: 'AI Ethics Seminar', registrations: 35 },
  { event_id: 'evt-2', title: 'Web Development Bootcamp', registrations: 28 },
];

// Mock Top Students
export const mockTopStudents: TopStudent[] = [
  { student_id: 'stu-1', name: 'Asha Patel', event_count: 5, attendance_rate: 0.95 },
  { student_id: 'stu-2', name: 'Rahul Kumar', event_count: 4, attendance_rate: 0.85 },
  { student_id: 'stu-3', name: 'Priya Sharma', event_count: 4, attendance_rate: 0.80 },
];

// Mock Event Summary
export const mockEventSummary: Record<string, EventSummary> = {
  'evt-1': {
    event_id: 'evt-1',
    title: 'Introduction to Machine Learning',
    registrations: 45,
    attendees: 38,
    attendance_percent: 84.4,
    avg_feedback: 4.3,
  },
  'evt-4': {
    event_id: 'evt-4',
    title: 'AI Ethics Seminar',
    registrations: 35,
    attendees: 32,
    attendance_percent: 91.4,
    avg_feedback: 4.1,
  },
};

// Mock Event Feedback
export const mockEventFeedback: Record<string, Array<{
  registration_id: string;
  rating: number;
  comment: string;
  student_name: string;
}>> = {
  'evt-1': [
    {
      registration_id: 'reg-101',
      rating: 5,
      comment: 'Great workshop, very informative!',
      student_name: 'Asha Patel',
    },
    {
      registration_id: 'reg-102',
      rating: 4,
      comment: 'Good content, could use more hands-on exercises.',
      student_name: 'Rahul Kumar',
    },
  ],
};
