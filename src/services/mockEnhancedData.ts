import {
  Event,
  EventCategory,
  Registration,
  Ticket,
  Certificate,
  AchievementBadge,
  UserAchievement,
  Notification,
  EventAnalytics,
  EventSummary,
  UserDashboard,
} from '../types/database';

// ================================
// EVENT CATEGORIES
// ================================

export const mockEventCategories: EventCategory[] = [
  {
    id: 'cat1',
    name: 'Academic',
    description: 'Educational workshops, seminars, and lectures',
    color: '#1976D2',
    icon: 'school',
    sortOrder: 1,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat2',
    name: 'Cultural',
    description: 'Cultural events, festivals, and celebrations',
    color: '#7B1FA2',
    icon: 'theater',
    sortOrder: 2,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat3',
    name: 'Sports',
    description: 'Sports competitions, tournaments, and fitness events',
    color: '#388E3C',
    icon: 'sports-soccer',
    sortOrder: 3,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat4',
    name: 'Technology',
    description: 'Tech talks, hackathons, and innovation showcases',
    color: '#F57C00',
    icon: 'laptop',
    sortOrder: 4,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat5',
    name: 'Career',
    description: 'Career fairs, networking, and professional development',
    color: '#5D4037',
    icon: 'briefcase',
    sortOrder: 5,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ================================
// ENHANCED EVENTS
// ================================

export const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Annual Tech Conference 2024',
    description: 'Join us for the biggest technology conference of the year featuring industry leaders, cutting-edge innovations, and networking opportunities. This comprehensive event covers AI, blockchain, cloud computing, and emerging technologies that are shaping the future.',
    shortDescription: 'The biggest technology conference featuring AI, blockchain, and future innovations.',
    status: 'published',
    visibility: 'public',
    categoryId: 'cat4',
    
    startDate: '2024-03-15T09:00:00Z',
    endDate: '2024-03-15T17:00:00Z',
    registrationStart: '2024-02-01T00:00:00Z',
    registrationEnd: '2024-03-10T23:59:59Z',
    timezone: 'UTC',
    
    locationType: 'hybrid',
    venue: 'Main Auditorium',
    address: '123 University Avenue, Tech Campus',
    room: 'Hall A',
    virtualLink: 'https://meet.university.edu/tech-conf-2024',
    virtualPlatform: 'Zoom',
    
    maxParticipants: 500,
    minParticipants: 50,
    currentRegistrations: 342,
    waitlistEnabled: true,
    maxWaitlist: 100,
    
    requiresApproval: false,
    requiresPayment: true,
    paymentAmount: 25.00,
    prerequisites: ['Basic programming knowledge'],
    
    bannerImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    ],
    documents: ['agenda.pdf', 'speaker-bios.pdf'],
    
    allowCancellation: true,
    cancellationDeadline: '2024-03-13T23:59:59Z',
    sendReminders: true,
    collectFeedback: true,
    generateCertificates: true,
    certificateTemplateId: 'cert-template-1',
    
    viewsCount: 1250,
    featured: true,
    tags: ['technology', 'AI', 'blockchain', 'networking'],
    
    createdBy: 'admin1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'event2',
    title: 'AI Workshop: Machine Learning Fundamentals',
    description: 'Hands-on workshop covering the fundamentals of machine learning and artificial intelligence. Perfect for beginners looking to understand AI concepts and practical applications.',
    shortDescription: 'Hands-on ML workshop for beginners to understand AI fundamentals.',
    status: 'published',
    visibility: 'public',
    categoryId: 'cat1',
    
    startDate: '2024-02-20T14:00:00Z',
    endDate: '2024-02-20T17:00:00Z',
    registrationStart: '2024-01-20T00:00:00Z',
    registrationEnd: '2024-02-18T23:59:59Z',
    timezone: 'UTC',
    
    locationType: 'physical',
    venue: 'Computer Lab 3',
    address: '456 Science Building, Main Campus',
    room: 'Room 301',
    
    maxParticipants: 30,
    minParticipants: 10,
    currentRegistrations: 28,
    waitlistEnabled: true,
    maxWaitlist: 15,
    
    requiresApproval: true,
    requiresPayment: false,
    prerequisites: ['Basic Python knowledge'],
    
    bannerImageUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800',
    galleryImages: [],
    documents: ['workshop-materials.pdf'],
    
    allowCancellation: true,
    cancellationDeadline: '2024-02-19T23:59:59Z',
    sendReminders: true,
    collectFeedback: true,
    generateCertificates: true,
    certificateTemplateId: 'cert-template-2',
    
    viewsCount: 680,
    featured: false,
    tags: ['AI', 'machine-learning', 'workshop', 'python'],
    
    createdBy: 'organizer1',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
  },
  {
    id: 'event3',
    title: 'Spring Cultural Festival',
    description: 'Celebrate diversity and culture at our annual Spring Cultural Festival. Experience music, dance, food, and traditions from around the world in this vibrant community celebration.',
    shortDescription: 'Annual celebration of diversity with music, dance, and food from around the world.',
    status: 'published',
    visibility: 'public',
    categoryId: 'cat2',
    
    startDate: '2024-04-12T11:00:00Z',
    endDate: '2024-04-12T20:00:00Z',
    registrationStart: '2024-03-01T00:00:00Z',
    registrationEnd: '2024-04-10T23:59:59Z',
    timezone: 'UTC',
    
    locationType: 'physical',
    venue: 'Central Courtyard',
    address: 'Main Campus Courtyard',
    
    maxParticipants: 1000,
    minParticipants: 100,
    currentRegistrations: 756,
    waitlistEnabled: false,
    
    requiresApproval: false,
    requiresPayment: false,
    prerequisites: [],
    
    bannerImageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    ],
    documents: ['festival-schedule.pdf', 'vendor-list.pdf'],
    
    allowCancellation: true,
    cancellationDeadline: '2024-04-11T23:59:59Z',
    sendReminders: true,
    collectFeedback: true,
    generateCertificates: false,
    
    viewsCount: 2100,
    featured: true,
    tags: ['culture', 'festival', 'music', 'food', 'community'],
    
    createdBy: 'organizer1',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-15T16:45:00Z',
  },
  {
    id: 'event4',
    title: 'Career Fair 2024',
    description: 'Connect with top employers and explore career opportunities across various industries. Meet recruiters, attend company presentations, and discover internship and full-time positions.',
    shortDescription: 'Connect with top employers and explore career opportunities across industries.',
    status: 'published',
    visibility: 'public',
    categoryId: 'cat5',
    
    startDate: '2024-03-25T09:00:00Z',
    endDate: '2024-03-25T16:00:00Z',
    registrationStart: '2024-02-15T00:00:00Z',
    registrationEnd: '2024-03-20T23:59:59Z',
    timezone: 'UTC',
    
    locationType: 'physical',
    venue: 'Exhibition Center',
    address: '789 Career Building, Campus East',
    
    maxParticipants: 800,
    minParticipants: 50,
    currentRegistrations: 623,
    waitlistEnabled: true,
    maxWaitlist: 200,
    
    requiresApproval: false,
    requiresPayment: false,
    prerequisites: [],
    
    bannerImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    galleryImages: [],
    documents: ['company-list.pdf', 'career-tips.pdf'],
    
    allowCancellation: true,
    cancellationDeadline: '2024-03-24T23:59:59Z',
    sendReminders: true,
    collectFeedback: true,
    generateCertificates: false,
    
    viewsCount: 1850,
    featured: true,
    tags: ['career', 'jobs', 'networking', 'employers'],
    
    createdBy: 'admin1',
    createdAt: '2024-01-30T12:00:00Z',
    updatedAt: '2024-02-10T10:15:00Z',
  },
  {
    id: 'event5',
    title: 'Sustainable Living Workshop',
    description: 'Learn practical tips and strategies for sustainable living. This interactive workshop covers eco-friendly practices, waste reduction, and environmental consciousness for students.',
    shortDescription: 'Interactive workshop on eco-friendly practices and sustainable living for students.',
    status: 'draft',
    visibility: 'public',
    categoryId: 'cat1',
    
    startDate: '2024-04-05T13:00:00Z',
    endDate: '2024-04-05T16:00:00Z',
    registrationStart: '2024-03-15T00:00:00Z',
    registrationEnd: '2024-04-03T23:59:59Z',
    timezone: 'UTC',
    
    locationType: 'physical',
    venue: 'Environmental Science Building',
    address: '321 Green Campus Drive',
    room: 'Room 205',
    
    maxParticipants: 40,
    minParticipants: 15,
    currentRegistrations: 0,
    waitlistEnabled: true,
    maxWaitlist: 20,
    
    requiresApproval: false,
    requiresPayment: false,
    prerequisites: [],
    
    bannerImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    galleryImages: [],
    documents: [],
    
    allowCancellation: true,
    cancellationDeadline: '2024-04-04T23:59:59Z',
    sendReminders: true,
    collectFeedback: true,
    generateCertificates: true,
    certificateTemplateId: 'cert-template-3',
    
    viewsCount: 45,
    featured: false,
    tags: ['sustainability', 'environment', 'workshop', 'eco-friendly'],
    
    createdBy: 'organizer1',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
];

// ================================
// REGISTRATIONS
// ================================

export const mockRegistrations: Registration[] = [
  {
    id: 'reg1',
    eventId: 'event1',
    userId: 'student1',
    ticketId: 'ticket1',
    status: 'confirmed',
    registrationType: 'regular',
    source: 'website',
    requiresApproval: false,
    paymentStatus: 'completed',
    paymentAmount: 25.00,
    paymentMethod: 'credit_card',
    paymentReference: 'PAY_123456',
    paymentDate: '2024-02-05T10:30:00Z',
    checkedIn: false,
    registrationData: {
      dietaryRequirements: 'Vegetarian',
      tshirtSize: 'M',
    },
    confirmationSent: true,
    reminderSent: false,
    registeredAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:30:00Z',
  },
  {
    id: 'reg2',
    eventId: 'event2',
    userId: 'student1',
    ticketId: 'ticket2',
    status: 'confirmed',
    registrationType: 'regular',
    source: 'mobile_app',
    requiresApproval: true,
    approvedBy: 'organizer1',
    approvedAt: '2024-01-25T14:20:00Z',
    paymentStatus: 'not_required',
    checkedIn: true,
    checkInTime: '2024-02-20T13:55:00Z',
    checkedInBy: 'organizer1',
    checkInMethod: 'qr_scan',
    confirmationSent: true,
    reminderSent: true,
    registeredAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-02-20T13:55:00Z',
  },
  {
    id: 'reg3',
    eventId: 'event3',
    userId: 'student2',
    status: 'confirmed',
    registrationType: 'regular',
    source: 'friend_referral',
    requiresApproval: false,
    paymentStatus: 'not_required',
    checkedIn: false,
    confirmationSent: true,
    reminderSent: false,
    registeredAt: '2024-03-05T16:45:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
  },
];

// ================================
// TICKETS
// ================================

export const mockTickets: Ticket[] = [
  {
    id: 'ticket1',
    registrationId: 'reg1',
    ticketNumber: 'TKT-2024-000001',
    qrCodeData: 'event:event1|user:student1|reg:reg1|ts:1707134400',
    qrCodeImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-2024-000001',
    ticketType: 'General Admission',
    validFrom: '2024-02-05T10:30:00Z',
    validUntil: '2024-03-15T17:00:00Z',
    isValid: true,
    scannedCount: 0,
    scanLocations: [],
    createdAt: '2024-02-05T10:30:00Z',
    updatedAt: '2024-02-05T10:30:00Z',
  },
  {
    id: 'ticket2',
    registrationId: 'reg2',
    ticketNumber: 'TKT-2024-000002',
    qrCodeData: 'event:event2|user:student1|reg:reg2|ts:1706190000',
    qrCodeImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-2024-000002',
    ticketType: 'Workshop Pass',
    validFrom: '2024-01-25T14:20:00Z',
    validUntil: '2024-02-20T17:00:00Z',
    isValid: true,
    scannedCount: 1,
    firstScanTime: '2024-02-20T13:55:00Z',
    lastScanTime: '2024-02-20T13:55:00Z',
    scanLocations: ['Computer Lab 3 Entrance'],
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-02-20T13:55:00Z',
  },
];

// ================================
// ACHIEVEMENT BADGES
// ================================

export const mockAchievementBadges: AchievementBadge[] = [
  {
    id: 'badge1',
    name: 'Early Bird',
    description: 'Registered for an event within 24 hours of announcement',
    iconUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=100',
    criteria: {
      type: 'registration_speed',
      hours: 24,
    },
    points: 10,
    rarity: 'common',
    category: 'Participation',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'badge2',
    name: 'Tech Enthusiast',
    description: 'Attended 5 technology-related events',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100',
    criteria: {
      type: 'category_attendance',
      category: 'technology',
      count: 5,
    },
    points: 50,
    rarity: 'uncommon',
    category: 'Specialization',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'badge3',
    name: 'Perfect Attendance',
    description: 'Attended 10 events without missing any',
    iconUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100',
    criteria: {
      type: 'attendance_streak',
      count: 10,
    },
    points: 100,
    rarity: 'rare',
    category: 'Achievement',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ================================
// USER ACHIEVEMENTS
// ================================

export const mockUserAchievements: UserAchievement[] = [
  {
    id: 'ua1',
    userId: 'student1',
    badgeId: 'badge1',
    eventId: 'event1',
    earnedAt: '2024-02-05T10:00:00Z',
    progressData: {
      registrationTime: '2024-02-05T10:00:00Z',
      eventAnnouncementTime: '2024-02-04T10:00:00Z',
      hoursAfterAnnouncement: 24,
    },
  },
  {
    id: 'ua2',
    userId: 'student1',
    badgeId: 'badge2',
    earnedAt: '2024-02-20T17:00:00Z',
    progressData: {
      techEventsAttended: 5,
      lastTechEvent: 'event2',
    },
  },
];

// ================================
// CERTIFICATES
// ================================

export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    userId: 'student1',
    eventId: 'event2',
    templateId: 'cert-template-2',
    certificateNumber: 'CERT-2024-000001',
    title: 'AI Workshop Completion Certificate',
    content: 'This certifies that Alex Thompson has successfully completed the AI Workshop: Machine Learning Fundamentals.',
    status: 'generated',
    generatedAt: '2024-02-20T18:00:00Z',
    generatedBy: 'organizer1',
    pdfUrl: 'https://certificates.university.edu/cert1.pdf',
    imageUrl: 'https://certificates.university.edu/cert1.png',
    verificationCode: 'VERIFY-CERT1-2024',
    verificationUrl: 'https://university.edu/verify/VERIFY-CERT1-2024',
    verifiedCount: 0,
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
// NOTIFICATIONS
// ================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'student1',
    type: 'registration_confirmed',
    title: 'Registration Confirmed',
    content: 'Your registration for Annual Tech Conference 2024 has been confirmed!',
    eventId: 'event1',
    channels: ['in_app', 'email'],
    scheduledFor: '2024-02-05T10:30:00Z',
    sentAt: '2024-02-05T10:30:00Z',
    status: 'sent',
    data: {
      eventTitle: 'Annual Tech Conference 2024',
      ticketNumber: 'TKT-2024-000001',
    },
    createdAt: '2024-02-05T10:30:00Z',
  },
  {
    id: 'notif2',
    userId: 'student1',
    type: 'event_reminder',
    title: 'Event Reminder',
    content: 'AI Workshop starts in 1 hour. Don\'t forget to bring your laptop!',
    eventId: 'event2',
    channels: ['in_app', 'push'],
    scheduledFor: '2024-02-20T13:00:00Z',
    sentAt: '2024-02-20T13:00:00Z',
    status: 'sent',
    readAt: '2024-02-20T13:05:00Z',
    data: {
      eventTitle: 'AI Workshop: Machine Learning Fundamentals',
      venue: 'Computer Lab 3',
    },
    createdAt: '2024-02-20T12:00:00Z',
  },
  {
    id: 'notif3',
    userId: 'student1',
    type: 'certificate_ready',
    title: 'Certificate Ready',
    content: 'Your completion certificate for AI Workshop is now available for download!',
    eventId: 'event2',
    relatedId: 'cert1',
    channels: ['in_app', 'email'],
    scheduledFor: '2024-02-20T18:00:00Z',
    sentAt: '2024-02-20T18:00:00Z',
    status: 'sent',
    data: {
      certificateId: 'cert1',
      downloadUrl: 'https://certificates.university.edu/cert1.pdf',
    },
    createdAt: '2024-02-20T18:00:00Z',
  },
];

// ================================
// ANALYTICS
// ================================

export const mockEventAnalytics: EventAnalytics[] = [
  {
    id: 'analytics1',
    eventId: 'event1',
    date: '2024-02-05',
    views: 45,
    uniqueViews: 38,
    registrations: 12,
    cancellations: 0,
    attendance: 0,
    noShows: 0,
    feedbackSubmissions: 0,
    studentAttendees: 0,
    staffAttendees: 0,
    createdAt: '2024-02-06T00:00:00Z',
  },
  {
    id: 'analytics2',
    eventId: 'event2',
    date: '2024-02-20',
    views: 15,
    uniqueViews: 12,
    registrations: 0,
    cancellations: 0,
    attendance: 28,
    noShows: 0,
    feedbackSubmissions: 25,
    averageRating: 4.8,
    studentAttendees: 26,
    staffAttendees: 2,
    createdAt: '2024-02-21T00:00:00Z',
  },
];

// ================================
// AGGREGATED VIEWS
// ================================

export const mockEventSummaries: EventSummary[] = mockEvents.map(event => ({
  ...event,
  categoryName: mockEventCategories.find(cat => cat.id === event.categoryId)?.name,
  organizerName: event.createdBy === 'admin1' ? 'Dr. Sarah Johnson' : 'Prof. Michael Chen',
  totalRegistrations: mockRegistrations.filter(reg => reg.eventId === event.id).length,
  confirmedRegistrations: mockRegistrations.filter(reg => reg.eventId === event.id && reg.status === 'confirmed').length,
  attendanceCount: mockRegistrations.filter(reg => reg.eventId === event.id && reg.checkedIn).length,
  averageRating: event.id === 'event2' ? 4.8 : undefined,
}));

export const mockUserDashboards: UserDashboard[] = [
  {
    id: 'student1',
    name: 'Alex Thompson',
    email: 'student@university.edu',
    role: 'student',
    totalRegistrations: 3,
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
// EXPORT ALL MOCK DATA
// ================================

export const mockEnhancedData = {
  categories: mockEventCategories,
  events: mockEvents,
  registrations: mockRegistrations,
  tickets: mockTickets,
  badges: mockAchievementBadges,
  userAchievements: mockUserAchievements,
  certificates: mockCertificates,
  notifications: mockNotifications,
  analytics: mockEventAnalytics,
  eventSummaries: mockEventSummaries,
  userDashboards: mockUserDashboards,
};
