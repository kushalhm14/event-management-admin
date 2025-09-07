import { Event, Student, Registration, FeedbackSubmission } from '../types/student';

// Mock data for student module
export const mockStudents: Student[] = [
  {
    id: 'stu-1',
    college_id: 'col-1',
    name: 'Asha Patel',
    roll_no: '2023CS001',
    email: 'asha.patel@college.edu',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    bio: 'Computer Science student passionate about AI and machine learning.',
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'stu-2',
    college_id: 'col-1',
    name: 'Rahul Kumar',
    roll_no: '2023CS002',
    email: 'rahul.kumar@college.edu',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
    bio: 'Aspiring software developer with interest in web technologies.',
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
  },
  {
    id: 'stu-3',
    college_id: 'col-1',
    name: 'Priya Sharma',
    roll_no: '2023CS003',
    email: 'priya.sharma@college.edu',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    bio: 'Data science enthusiast and hackathon winner.',
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
];

export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    college_id: 'col-1',
    title: 'AI Workshop Series',
    description: 'Comprehensive workshop on artificial intelligence and machine learning fundamentals. Learn about neural networks, deep learning, and practical applications.',
    type: 'workshop',
    start_time: '2024-09-15T10:00:00Z',
    end_time: '2024-09-15T16:00:00Z',
    location: 'Computer Lab - Block A',
    capacity: 50,
    registered_count: 23,
    status: 'active',
    image_url: 'https://picsum.photos/400/200?random=1',
    mentors: ['Dr. Sarah Johnson', 'Prof. Mike Chen'],
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-08-15T00:00:00Z',
  },
  {
    id: 'evt-2',
    college_id: 'col-1',
    title: 'Tech Talk: Future of Web Development',
    description: 'Industry experts share insights on modern web development trends, frameworks, and career opportunities.',
    type: 'seminar',
    start_time: '2024-09-20T14:00:00Z',
    end_time: '2024-09-20T17:00:00Z',
    location: 'Main Auditorium',
    capacity: 200,
    registered_count: 85,
    status: 'active',
    image_url: 'https://picsum.photos/400/200?random=2',
    mentors: ['John Smith (Google)', 'Lisa Wang (Microsoft)'],
    created_at: '2024-08-05T00:00:00Z',
    updated_at: '2024-08-20T00:00:00Z',
  },
  {
    id: 'evt-3',
    college_id: 'col-1',
    title: 'CodeFest 2024',
    description: '48-hour hackathon featuring exciting challenges, prizes, and networking opportunities with industry professionals.',
    type: 'hackathon',
    start_time: '2024-10-05T18:00:00Z',
    end_time: '2024-10-07T18:00:00Z',
    location: 'Innovation Hub',
    capacity: 100,
    registered_count: 78,
    status: 'active',
    image_url: 'https://picsum.photos/400/200?random=3',
    mentors: ['Dev Team Mentors', 'Industry Judges'],
    created_at: '2024-08-10T00:00:00Z',
    updated_at: '2024-08-25T00:00:00Z',
  },
  {
    id: 'evt-4',
    college_id: 'col-1',
    title: 'Photography Workshop (Cancelled)',
    description: 'Learn the basics of digital photography and photo editing techniques.',
    type: 'workshop',
    start_time: '2024-09-10T10:00:00Z',
    end_time: '2024-09-10T15:00:00Z',
    location: 'Art Studio',
    capacity: 25,
    registered_count: 8,
    status: 'cancelled',
    image_url: 'https://picsum.photos/400/200?random=4',
    mentors: ['Prof. Jane Doe'],
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'evt-5',
    college_id: 'col-1',
    title: 'React Native Masterclass',
    description: 'Intensive hands-on session on building mobile apps with React Native and Expo.',
    type: 'workshop',
    start_time: '2024-09-25T09:00:00Z',
    end_time: '2024-09-25T17:00:00Z',
    location: 'Mobile Dev Lab',
    capacity: 2, // Small capacity for testing "event full" scenario
    registered_count: 2,
    status: 'active',
    image_url: 'https://picsum.photos/400/200?random=5',
    mentors: ['React Native Expert', 'Mobile Dev Specialist'],
    created_at: '2024-08-15T00:00:00Z',
    updated_at: '2024-08-30T00:00:00Z',
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: 'reg-1',
    student_id: 'stu-1',
    event_id: 'evt-1',
    registered_at: '2024-08-20T10:30:00Z',
    attendance_status: 'present',
    feedback: {
      rating: 5,
      comment: 'Excellent workshop! Learned a lot about AI fundamentals.',
      submitted_at: '2024-09-15T17:30:00Z',
    },
    cert_url: 'https://example.com/certificates/ai-workshop-asha-patel.pdf',
    event_title: 'AI Workshop Series',
  },
  {
    id: 'reg-2',
    student_id: 'stu-1',
    event_id: 'evt-2',
    registered_at: '2024-08-25T14:15:00Z',
    attendance_status: 'pending',
    event_title: 'Tech Talk: Future of Web Development',
  },
  {
    id: 'reg-3',
    student_id: 'stu-2',
    event_id: 'evt-1',
    registered_at: '2024-08-22T09:45:00Z',
    attendance_status: 'present',
    feedback: {
      rating: 4,
      comment: 'Great content, would love more hands-on exercises.',
      submitted_at: '2024-09-15T18:00:00Z',
    },
    event_title: 'AI Workshop Series',
  },
  {
    id: 'reg-4',
    student_id: 'stu-2',
    event_id: 'evt-3',
    registered_at: '2024-08-28T16:20:00Z',
    attendance_status: 'pending',
    event_title: 'CodeFest 2024',
  },
];

// In-memory storage for mock operations
let studentsData = [...mockStudents];
let eventsData = [...mockEvents];
let registrationsData = [...mockRegistrations];

/**
 * Mock API functions for student module
 */
export const mockStudentApi = {
  /**
   * Fetch all events for browsing
   */
  async fetchEvents(): Promise<Event[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return eventsData.filter(event => event.status !== 'cancelled' || event.status === 'cancelled');
  },

  /**
   * Fetch single event details
   */
  async fetchEvent(eventId: string): Promise<Event> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
      const error = new Error('Event not found') as any;
      error.code = 404;
      throw error;
    }
    return event;
  },

  /**
   * Register student for an event
   */
  async registerForEvent(eventId: string, studentId: string): Promise<Registration> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
      const error = new Error('Event not found') as any;
      error.code = 404;
      throw error;
    }

    // Check if event is cancelled
    if (event.status === 'cancelled') {
      const error = new Error('Cannot register for cancelled event') as any;
      error.code = 400;
      throw error;
    }

    // Check if already registered
    const existingRegistration = registrationsData.find(
      r => r.event_id === eventId && r.student_id === studentId
    );
    if (existingRegistration) {
      const error = new Error('Already registered for this event') as any;
      error.code = 409;
      throw error;
    }

    // Check capacity
    if (event.registered_count >= event.capacity) {
      const error = new Error('Event is full') as any;
      error.code = 409;
      throw error;
    }

    // Create new registration
    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      student_id: studentId,
      event_id: eventId,
      registered_at: new Date().toISOString(),
      attendance_status: 'pending',
      event_title: event.title,
    };

    registrationsData.push(newRegistration);
    
    // Update event registered count
    event.registered_count += 1;
    
    return newRegistration;
  },

  /**
   * Fetch student's registrations
   */
  async fetchStudentRegistrations(studentId: string): Promise<Registration[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return registrationsData.filter(r => r.student_id === studentId);
  },

  /**
   * Submit feedback for a registration
   */
  async submitFeedback(registrationId: string, feedback: FeedbackSubmission): Promise<Registration> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const registration = registrationsData.find(r => r.id === registrationId);
    if (!registration) {
      const error = new Error('Registration not found') as any;
      error.code = 404;
      throw error;
    }

    if (registration.feedback) {
      const error = new Error('Feedback already submitted') as any;
      error.code = 409;
      throw error;
    }

    // Update registration with feedback
    registration.feedback = {
      ...feedback,
      submitted_at: new Date().toISOString(),
    };

    return registration;
  },

  /**
   * Update student profile
   */
  async updateProfile(collegeId: string, studentId: string, updates: Partial<Student>): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const studentIndex = studentsData.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      const error = new Error('Student not found') as any;
      error.code = 404;
      throw error;
    }

    // Update student data
    studentsData[studentIndex] = {
      ...studentsData[studentIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return studentsData[studentIndex];
  },

  /**
   * Get student profile
   */
  async getStudent(studentId: string): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const student = studentsData.find(s => s.id === studentId);
    if (!student) {
      const error = new Error('Student not found') as any;
      error.code = 404;
      throw error;
    }

    return student;
  },

  /**
   * Get certificate for a registration
   */
  async fetchCertificate(registrationId: string): Promise<{ cert_url: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const registration = registrationsData.find(r => r.id === registrationId);
    if (!registration || !registration.cert_url) {
      const error = new Error('Certificate not found') as any;
      error.code = 404;
      throw error;
    }

    return { cert_url: registration.cert_url };
  },
};
