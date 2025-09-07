import { User } from '../types/auth';

export const mockAuthData = {
  users: [
    {
      id: 'admin1',
      email: 'admin@university.edu',
      name: 'Dr. Sarah Johnson',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      createdAt: '2023-01-15T08:00:00Z',
      lastActive: '2024-01-15T10:30:00Z',
      verified: true,
      department: 'Computer Science',
      permissions: [
        'manage_events',
        'manage_users',
        'view_reports',
        'manage_system',
        'export_data',
      ],
    },
    {
      id: 'organizer1',
      email: 'organizer@university.edu',
      name: 'Prof. Michael Chen',
      role: 'organizer' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: '2023-02-20T09:15:00Z',
      lastActive: '2024-01-15T09:45:00Z',
      verified: true,
      department: 'Events Management',
      permissions: [
        'manage_events',
        'view_reports',
        'export_data',
      ],
    },
    {
      id: 'student1',
      email: 'student@university.edu',
      name: 'Alex Thompson',
      role: 'student' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2023-08-15T14:20:00Z',
      lastActive: '2024-01-15T11:15:00Z',
      verified: true,
      studentId: 'CS2024001',
      course: 'Computer Science',
      year: 2024,
    },
    {
      id: 'student2',
      email: 'jane.smith@university.edu',
      name: 'Jane Smith',
      role: 'student' as const,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      createdAt: '2023-08-20T10:30:00Z',
      lastActive: '2024-01-14T16:22:00Z',
      verified: true,
      studentId: 'EE2024002',
      course: 'Electrical Engineering',
      year: 2024,
    },
    {
      id: 'student3',
      email: 'david.wilson@university.edu',
      name: 'David Wilson',
      role: 'student' as const,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      createdAt: '2023-09-01T12:45:00Z',
      lastActive: '2024-01-15T08:30:00Z',
      verified: false,
      studentId: 'ME2023003',
      course: 'Mechanical Engineering',
      year: 2023,
    },
  ] as User[],
  
  // Password for all mock users (in real app, these would be hashed)
  defaultPassword: 'password123',
  
  // Sample verification tokens
  verificationTokens: {
    'student3': 'verify_token_123',
  },
  
  // Sample reset tokens
  resetTokens: {
    'forgot_token_456': 'student1',
  },
};
