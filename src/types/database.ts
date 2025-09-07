// Enhanced TypeScript types for the professional event management platform
// Corresponding to the enhanced database schema

// ================================
// USER TYPES
// ================================

export type UserRole = 'student' | 'admin' | 'organizer' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLogin?: string;
  loginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId?: string;
  course?: string;
  year?: number;
  graduationYear?: number;
  gpa?: number;
  academicStanding?: string;
  interests: string[];
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  employeeId?: string;
  department?: string;
  position?: string;
  permissions: string[];
  officeLocation?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// EVENT TYPES
// ================================

export type EventStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'published' 
  | 'cancelled' 
  | 'postponed' 
  | 'in_progress' 
  | 'completed' 
  | 'archived';

export type EventVisibility = 'public' | 'private' | 'internal';
export type LocationType = 'physical' | 'virtual' | 'hybrid';

export interface Event {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  status: EventStatus;
  visibility: EventVisibility;
  categoryId?: string;
  
  // Scheduling
  startDate: string;
  endDate: string;
  registrationStart?: string;
  registrationEnd?: string;
  timezone: string;
  
  // Location
  locationType: LocationType;
  venue?: string;
  address?: string;
  room?: string;
  virtualLink?: string;
  virtualPlatform?: string;
  
  // Capacity
  maxParticipants?: number;
  minParticipants: number;
  currentRegistrations: number;
  waitlistEnabled: boolean;
  maxWaitlist?: number;
  
  // Requirements
  requiresApproval: boolean;
  requiresPayment: boolean;
  paymentAmount?: number;
  prerequisites: string[];
  
  // Media
  bannerImageUrl?: string;
  galleryImages: string[];
  documents: string[];
  
  // Settings
  allowCancellation: boolean;
  cancellationDeadline?: string;
  sendReminders: boolean;
  collectFeedback: boolean;
  generateCertificates: boolean;
  certificateTemplateId?: string;
  
  // Analytics
  viewsCount: number;
  featured: boolean;
  tags: string[];
  
  // Audit
  createdBy?: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

// ================================
// REGISTRATION & TICKETING TYPES
// ================================

export type RegistrationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'waitlisted' 
  | 'cancelled' 
  | 'rejected' 
  | 'no_show' 
  | 'attended';

export type RegistrationType = 'regular' | 'waitlist' | 'staff' | 'vip' | 'speaker';
export type PaymentStatus = 'not_required' | 'pending' | 'completed' | 'failed' | 'refunded';
export type CheckInMethod = 'qr_scan' | 'manual' | 'self_check' | 'automatic';

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketId?: string;
  
  // Registration Details
  status: RegistrationStatus;
  registrationType: RegistrationType;
  source?: string;
  
  // Approval
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  
  // Attendance
  checkedIn: boolean;
  checkInTime?: string;
  checkedInBy?: string;
  checkInMethod?: CheckInMethod;
  
  // Additional Data
  registrationData?: Record<string, any>;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Notifications
  confirmationSent: boolean;
  reminderSent: boolean;
  
  registeredAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  registrationId: string;
  ticketNumber: string;
  qrCodeData: string;
  qrCodeImageUrl?: string;
  
  // Details
  ticketType: string;
  seatNumber?: string;
  section?: string;
  specialInstructions?: string;
  
  // Validity
  validFrom: string;
  validUntil?: string;
  isValid: boolean;
  
  // Usage
  scannedCount: number;
  firstScanTime?: string;
  lastScanTime?: string;
  scanLocations: string[];
  
  createdAt: string;
  updatedAt: string;
}

// ================================
// CERTIFICATE & ACHIEVEMENT TYPES
// ================================

export type CertificateType = 'attendance' | 'completion' | 'achievement' | 'participation' | 'award';
export type CertificateStatus = 'pending' | 'generated' | 'sent' | 'downloaded' | 'revoked';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  templateType: CertificateType;
  
  // Design
  backgroundImageUrl?: string;
  layoutConfig: Record<string, any>;
  
  // Content
  titleTemplate: string;
  contentTemplate: string;
  signatureFields: Record<string, any>;
  
  // Settings
  autoGenerate: boolean;
  requiresAttendance: boolean;
  minimumAttendancePercentage: number;
  
  // Verification
  verificationEnabled: boolean;
  verificationUrlTemplate?: string;
  
  active: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  eventId: string;
  templateId: string;
  
  // Details
  certificateNumber: string;
  title: string;
  content: string;
  
  // Generation
  status: CertificateStatus;
  generatedAt?: string;
  generatedBy?: string;
  
  // Files
  pdfUrl?: string;
  imageUrl?: string;
  
  // Verification
  verificationCode: string;
  verificationUrl?: string;
  verifiedCount: number;
  
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  criteria: Record<string, any>;
  points: number;
  rarity: BadgeRarity;
  category?: string;
  active: boolean;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  badgeId: string;
  eventId?: string;
  earnedAt: string;
  progressData?: Record<string, any>;
}

// ================================
// COMMUNICATION TYPES
// ================================

export type NotificationType = 
  | 'event_reminder' 
  | 'registration_confirmed' 
  | 'event_updated' 
  | 'event_cancelled' 
  | 'certificate_ready' 
  | 'achievement_earned'
  | 'payment_required' 
  | 'approval_required' 
  | 'general';

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content?: string;
  
  // Targeting
  eventId?: string;
  relatedId?: string;
  
  // Delivery
  channels: NotificationChannel[];
  scheduledFor: string;
  sentAt?: string;
  
  // Status
  status: NotificationStatus;
  readAt?: string;
  
  data?: Record<string, any>;
  createdAt: string;
}

// ================================
// ANALYTICS TYPES
// ================================

export interface EventAnalytics {
  id: string;
  eventId: string;
  date: string;
  
  // Engagement
  views: number;
  uniqueViews: number;
  registrations: number;
  cancellations: number;
  attendance: number;
  noShows: number;
  
  // Satisfaction
  feedbackSubmissions: number;
  averageRating?: number;
  
  // Demographics
  studentAttendees: number;
  staffAttendees: number;
  
  createdAt: string;
}

export type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'view' 
  | 'register' 
  | 'cancel' 
  | 'checkin' 
  | 'download' 
  | 'share' 
  | 'feedback' 
  | 'search';

export interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  entityType?: string;
  entityId?: string;
  
  // Context
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  
  data?: Record<string, any>;
  createdAt: string;
}

// ================================
// SYSTEM TYPES
// ================================

export type SettingDataType = 'string' | 'integer' | 'boolean' | 'json';

export interface SystemSetting {
  id: string;
  key: string;
  value?: string;
  dataType: SettingDataType;
  category?: string;
  description?: string;
  isPublic: boolean;
  updatedBy?: string;
  updatedAt: string;
}

// ================================
// VIEW TYPES (for common queries)
// ================================

export interface EventSummary extends Event {
  categoryName?: string;
  organizerName?: string;
  totalRegistrations: number;
  confirmedRegistrations: number;
  attendanceCount: number;
  averageRating?: number;
}

export interface UserDashboard {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  totalRegistrations: number;
  eventsAttended: number;
  certificatesEarned: number;
  achievementsEarned: number;
}

// ================================
// API REQUEST/RESPONSE TYPES
// ================================

export interface CreateEventRequest {
  title: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  startDate: string;
  endDate: string;
  locationType: LocationType;
  venue?: string;
  maxParticipants?: number;
  requiresApproval?: boolean;
  bannerImageUrl?: string;
  tags?: string[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: EventStatus;
}

export interface RegisterForEventRequest {
  eventId: string;
  registrationData?: Record<string, any>;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface CheckInRequest {
  registrationId: string;
  method: CheckInMethod;
  location?: string;
  notes?: string;
}

export interface GenerateCertificateRequest {
  userId: string;
  eventId: string;
  templateId?: string;
  customData?: Record<string, any>;
}

// ================================
// FILTER & SEARCH TYPES
// ================================

export interface EventFilters {
  status?: EventStatus[];
  category?: string[];
  startDateFrom?: string;
  startDateTo?: string;
  locationType?: LocationType[];
  featured?: boolean;
  search?: string;
  tags?: string[];
}

export interface RegistrationFilters {
  eventId?: string;
  status?: RegistrationStatus[];
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: PaymentStatus[];
  checkedIn?: boolean;
}

export interface UserFilters {
  role?: UserRole[];
  status?: UserStatus[];
  emailVerified?: boolean;
  createdAfter?: string;
  search?: string;
}

// ================================
// PAGINATION TYPES
// ================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ================================
// ERROR TYPES
// ================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
