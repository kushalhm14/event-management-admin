import { Event, EventCategory, Registration, UserDashboard, Certificate } from '../types/database';

// ================================
// EVENT CATEGORIES
// ================================

const categories: EventCategory[] = [
  {
    id: 'cat1',
    name: 'Technology',
    description: 'Tech workshops, conferences, and innovation events',
    color: '#2196F3',
    active: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat2',
    name: 'Cultural',
    description: 'Cultural festivals, performances, and art exhibitions',
    color: '#FF9800',
    active: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat3',
    name: 'Academic',
    description: 'Academic conferences, seminars, and research presentations',
    color: '#4CAF50',
    active: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ================================
// EVENTS
// ================================

const events: Event[] = [
  {
    id: 'event1',
    title: 'Annual Tech Conference 2024',
    description: 'Join us for the biggest technology conference of the year featuring industry leaders and cutting-edge innovations.',
    categoryId: 'cat1',
    startDate: '2024-03-15T09:00:00Z',
    endDate: '2024-03-15T17:00:00Z',
    status: 'published',
    createdBy: 'admin1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'event2',
    title: 'AI Workshop: Machine Learning Fundamentals',
    description: 'Hands-on workshop covering the fundamentals of machine learning and artificial intelligence.',
    categoryId: 'cat1',
    startDate: '2024-02-20T14:00:00Z',
    endDate: '2024-02-20T17:00:00Z',
    status: 'published',
    createdBy: 'admin1',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
  },
  {
    id: 'event3',
    title: 'Spring Cultural Festival',
    description: 'Celebrate diversity and culture at our annual Spring Cultural Festival.',
    categoryId: 'cat2',
    startDate: '2024-04-12T11:00:00Z',
    endDate: '2024-04-12T20:00:00Z',
    status: 'published',
    createdBy: 'admin1',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-15T16:45:00Z',
  },
];

// ================================
// REGISTRATIONS
// ================================

const registrations: Registration[] = [
  {
    id: 'reg1',
    eventId: 'event1',
    userId: 'student1',
    status: 'confirmed',
    checkedIn: false,
    registeredAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:30:00Z',
  },
  {
    id: 'reg2',
    eventId: 'event2',
    userId: 'student1',
    status: 'confirmed',
    checkedIn: true,
    checkInTime: '2024-02-20T13:55:00Z',
    registeredAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-02-20T13:55:00Z',
  },
  {
    id: 'reg3',
    eventId: 'event3',
    userId: 'student2',
    status: 'confirmed',
    checkedIn: false,
    registeredAt: '2024-03-05T16:45:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
  },
];

// ================================
// USER DASHBOARDS
// ================================

const userDashboards: UserDashboard[] = [
  {
    id: 'student1',
    name: 'Alex Thompson',
    email: 'student@university.edu',
    role: 'student',
    totalRegistrations: 2,
    eventsAttended: 1,
    certificatesEarned: 1,
    achievementsEarned: 2,
  },
  {
    id: 'student2',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    role: 'student',
    totalRegistrations: 1,
    eventsAttended: 0,
    certificatesEarned: 0,
    achievementsEarned: 0,
  },
];

// ================================
// CERTIFICATES
// ================================

const certificates: Certificate[] = [
  {
    id: 'cert1',
    userId: 'student1',
    eventId: 'event2',
    templateId: 'cert-template-2',
    certificateNumber: 'CERT-2024-000001',
    title: 'AI Workshop Completion Certificate',
    content: 'This certifies that Alex Thompson has successfully completed the AI Workshop.',
    status: 'generated',
    generatedAt: '2024-02-20T18:00:00Z',
    metadata: {
      eventTitle: 'AI Workshop: Machine Learning Fundamentals',
      eventDate: '2024-02-20',
      attendancePercentage: 100,
    },
    createdAt: '2024-02-20T18:00:00Z',
    updatedAt: '2024-02-20T18:00:00Z',
  },
];

// ================================
// TICKETS
// ================================

const mockTickets = [
  {
    id: 'ticket1',
    registrationId: 'reg1',
    ticketNumber: 'TKT-2024-000001',
    qrCodeData: 'event1|student1|reg1',
    isValid: true,
    createdAt: '2024-02-05T10:30:00Z',
  },
];

// ================================
// ACHIEVEMENTS  
// ================================

const mockAchievementBadges = [
  {
    id: 'badge1',
    name: 'Early Bird',
    description: 'Registered early',
    points: 10,
    active: true,
  },
];

const mockUserAchievements = [
  {
    id: 'ua1',
    userId: 'student1',
    badgeId: 'badge1',
    earnedAt: '2024-02-05T10:00:00Z',
  },
];

// ================================
// NOTIFICATIONS
// ================================

const mockNotifications = [
  {
    id: 'notif1',
    userId: 'student1',
    type: 'registration_confirmed',
    title: 'Registration Confirmed',
    content: 'Your registration has been confirmed!',
    status: 'sent',
    createdAt: '2024-02-05T10:30:00Z',
  },
];

// ================================
// ANALYTICS
// ================================

const mockEventAnalytics = [
  {
    id: 'analytics1',
    eventId: 'event1',
    date: '2024-02-05',
    views: 45,
    registrations: 12,
    attendance: 8,
    createdAt: '2024-02-06T00:00:00Z',
  },
];

// ================================
// EVENT SUMMARIES
// ================================

const mockEventSummaries = events.map(event => ({
  ...event,
  categoryName: categories.find(cat => cat.id === event.categoryId)?.name,
  organizerName: 'Admin User',
  totalRegistrations: registrations.filter(reg => reg.eventId === event.id).length,
  confirmedRegistrations: registrations.filter(reg => reg.eventId === event.id && reg.status === 'confirmed').length,
  attendanceCount: registrations.filter(reg => reg.eventId === event.id && reg.checkedIn).length,
}));

// ================================
// COMBINED MOCK DATA
// ================================

export const mockEnhancedData = {
  events,
  categories,
  registrations,
  userDashboards,
  certificates,
  eventSummaries: mockEventSummaries,
  analytics: mockEventAnalytics,
  tickets: mockTickets,
  badges: mockAchievementBadges,
  userAchievements: mockUserAchievements,
  notifications: mockNotifications,
};
