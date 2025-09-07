-- Professional Event Management Platform Database Schema
-- Enhanced schema with user roles, event lifecycle, tickets, certificates, and analytics

-- ================================
-- CORE USER MANAGEMENT
-- ================================

-- Enhanced Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role_enum NOT NULL DEFAULT 'student',
    status user_status_enum NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles enum
CREATE TYPE user_role_enum AS ENUM ('student', 'admin', 'organizer', 'super_admin');

-- User status enum
CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- Student profiles with academic information
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE,
    course VARCHAR(255),
    year INTEGER,
    graduation_year INTEGER,
    gpa DECIMAL(3,2),
    academic_standing VARCHAR(50),
    interests TEXT[],
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff profiles for admins and organizers
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    department VARCHAR(255),
    position VARCHAR(255),
    permissions TEXT[],
    office_location VARCHAR(255),
    phone VARCHAR(20),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- EVENT MANAGEMENT SYSTEM
-- ================================

-- Enhanced Events table with lifecycle management
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    status event_status_enum NOT NULL DEFAULT 'draft',
    visibility event_visibility_enum NOT NULL DEFAULT 'public',
    category_id UUID REFERENCES event_categories(id),
    
    -- Scheduling
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    registration_start TIMESTAMP,
    registration_end TIMESTAMP,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Location
    location_type location_type_enum NOT NULL,
    venue VARCHAR(255),
    address TEXT,
    room VARCHAR(100),
    virtual_link TEXT,
    virtual_platform VARCHAR(100),
    
    -- Capacity Management
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    current_registrations INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT TRUE,
    max_waitlist INTEGER,
    
    -- Requirements
    requires_approval BOOLEAN DEFAULT FALSE,
    requires_payment BOOLEAN DEFAULT FALSE,
    payment_amount DECIMAL(10,2),
    prerequisites TEXT[],
    
    -- Media
    banner_image_url TEXT,
    gallery_images TEXT[],
    documents TEXT[],
    
    -- Settings
    allow_cancellation BOOLEAN DEFAULT TRUE,
    cancellation_deadline TIMESTAMP,
    send_reminders BOOLEAN DEFAULT TRUE,
    collect_feedback BOOLEAN DEFAULT TRUE,
    generate_certificates BOOLEAN DEFAULT FALSE,
    certificate_template_id UUID REFERENCES certificate_templates(id),
    
    -- Analytics
    views_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    
    -- Audit
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event status enum
CREATE TYPE event_status_enum AS ENUM (
    'draft', 'pending_approval', 'published', 'cancelled', 
    'postponed', 'in_progress', 'completed', 'archived'
);

-- Event visibility enum
CREATE TYPE event_visibility_enum AS ENUM ('public', 'private', 'internal');

-- Location type enum
CREATE TYPE location_type_enum AS ENUM ('physical', 'virtual', 'hybrid');

-- Event categories for organization
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    parent_id UUID REFERENCES event_categories(id),
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- REGISTRATION & TICKETING SYSTEM
-- ================================

-- Enhanced registrations with detailed tracking
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ticket_id UUID UNIQUE REFERENCES tickets(id),
    
    -- Registration Details
    status registration_status_enum NOT NULL DEFAULT 'pending',
    registration_type registration_type_enum NOT NULL DEFAULT 'regular',
    source VARCHAR(100), -- How they found/registered for the event
    
    -- Approval Workflow
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Payment
    payment_status payment_status_enum DEFAULT 'not_required',
    payment_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP,
    
    -- Attendance
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMP,
    checked_in_by UUID REFERENCES users(id),
    check_in_method check_in_method_enum,
    
    -- Additional Data
    registration_data JSONB, -- Custom form fields
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    emergency_contact JSONB,
    
    -- Notifications
    confirmation_sent BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    
    -- Audit
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, user_id)
);

-- Registration status enum
CREATE TYPE registration_status_enum AS ENUM (
    'pending', 'confirmed', 'waitlisted', 'cancelled', 
    'rejected', 'no_show', 'attended'
);

-- Registration type enum
CREATE TYPE registration_type_enum AS ENUM ('regular', 'waitlist', 'staff', 'vip', 'speaker');

-- Payment status enum
CREATE TYPE payment_status_enum AS ENUM (
    'not_required', 'pending', 'completed', 'failed', 'refunded'
);

-- Check-in method enum
CREATE TYPE check_in_method_enum AS ENUM ('qr_scan', 'manual', 'self_check', 'automatic');

-- Digital tickets with QR codes
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code_data TEXT NOT NULL,
    qr_code_image_url TEXT,
    
    -- Ticket Details
    ticket_type VARCHAR(100) DEFAULT 'General Admission',
    seat_number VARCHAR(20),
    section VARCHAR(20),
    special_instructions TEXT,
    
    -- Validity
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_valid BOOLEAN DEFAULT TRUE,
    
    -- Usage Tracking
    scanned_count INTEGER DEFAULT 0,
    first_scan_time TIMESTAMP,
    last_scan_time TIMESTAMP,
    scan_locations TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- CERTIFICATE & ACHIEVEMENT SYSTEM
-- ================================

-- Certificate templates
CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type certificate_type_enum NOT NULL,
    
    -- Design
    background_image_url TEXT,
    layout_config JSONB, -- Template layout configuration
    
    -- Content
    title_template VARCHAR(500),
    content_template TEXT,
    signature_fields JSONB, -- Signatories configuration
    
    -- Settings
    auto_generate BOOLEAN DEFAULT FALSE,
    requires_attendance BOOLEAN DEFAULT TRUE,
    minimum_attendance_percentage INTEGER DEFAULT 80,
    
    -- Verification
    verification_enabled BOOLEAN DEFAULT TRUE,
    verification_url_template VARCHAR(500),
    
    active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificate type enum
CREATE TYPE certificate_type_enum AS ENUM (
    'attendance', 'completion', 'achievement', 'participation', 'award'
);

-- Generated certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),
    template_id UUID REFERENCES certificate_templates(id),
    
    -- Certificate Details
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    
    -- Generation
    status certificate_status_enum DEFAULT 'pending',
    generated_at TIMESTAMP,
    generated_by UUID REFERENCES users(id),
    
    -- Files
    pdf_url TEXT,
    image_url TEXT,
    
    -- Verification
    verification_code VARCHAR(50) UNIQUE,
    verification_url TEXT,
    verified_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB, -- Additional certificate data
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificate status enum
CREATE TYPE certificate_status_enum AS ENUM (
    'pending', 'generated', 'sent', 'downloaded', 'revoked'
);

-- Achievement badges system
CREATE TABLE achievement_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB, -- Achievement criteria
    points INTEGER DEFAULT 0,
    rarity badge_rarity_enum DEFAULT 'common',
    category VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badge rarity enum
CREATE TYPE badge_rarity_enum AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');

-- User achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    badge_id UUID REFERENCES achievement_badges(id),
    event_id UUID REFERENCES events(id), -- Optional: achievement from specific event
    
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_data JSONB, -- Progress towards achievement
    
    UNIQUE(user_id, badge_id)
);

-- ================================
-- COMMUNICATION SYSTEM
-- ================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type notification_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    
    -- Targeting
    event_id UUID REFERENCES events(id),
    related_id UUID, -- Generic reference for related entities
    
    -- Delivery
    channels notification_channel_enum[] DEFAULT ARRAY['in_app'],
    scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    
    -- Status
    status notification_status_enum DEFAULT 'pending',
    read_at TIMESTAMP,
    
    -- Metadata
    data JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification type enum
CREATE TYPE notification_type_enum AS ENUM (
    'event_reminder', 'registration_confirmed', 'event_updated', 
    'event_cancelled', 'certificate_ready', 'achievement_earned',
    'payment_required', 'approval_required', 'general'
);

-- Notification channel enum
CREATE TYPE notification_channel_enum AS ENUM ('in_app', 'email', 'push', 'sms');

-- Notification status enum
CREATE TYPE notification_status_enum AS ENUM ('pending', 'sent', 'failed', 'cancelled');

-- ================================
-- ANALYTICS & REPORTING
-- ================================

-- Event analytics
CREATE TABLE event_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    date DATE NOT NULL,
    
    -- Engagement Metrics
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    registrations INTEGER DEFAULT 0,
    cancellations INTEGER DEFAULT 0,
    attendance INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    
    -- Satisfaction
    feedback_submissions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Demographics
    student_attendees INTEGER DEFAULT 0,
    staff_attendees INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, date)
);

-- User activity tracking
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    activity_type activity_type_enum NOT NULL,
    entity_type VARCHAR(50), -- 'event', 'certificate', etc.
    entity_id UUID,
    
    -- Context
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    data JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity type enum
CREATE TYPE activity_type_enum AS ENUM (
    'login', 'logout', 'view', 'register', 'cancel', 'checkin', 
    'download', 'share', 'feedback', 'search'
);

-- ================================
-- SYSTEM CONFIGURATION
-- ================================

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    data_type setting_data_type_enum DEFAULT 'string',
    category VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Setting data type enum
CREATE TYPE setting_data_type_enum AS ENUM ('string', 'integer', 'boolean', 'json');

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Event indexes
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_featured ON events(featured);
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || description));

-- Registration indexes
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_date ON registrations(registered_at);

-- Ticket indexes
CREATE INDEX idx_tickets_qr_code ON tickets(qr_code_data);
CREATE INDEX idx_tickets_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_valid ON tickets(is_valid);

-- Certificate indexes
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_event ON certificates(event_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);

-- Analytics indexes
CREATE INDEX idx_event_analytics_event_date ON event_analytics(event_id, date);
CREATE INDEX idx_user_activity_user_type ON user_activity(user_id, activity_type);
CREATE INDEX idx_user_activity_created ON user_activity(created_at);

-- ================================
-- TRIGGERS FOR AUTOMATION
-- ================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate ticket when registration is confirmed
CREATE OR REPLACE FUNCTION generate_ticket_for_confirmed_registration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        INSERT INTO tickets (registration_id, ticket_number, qr_code_data)
        VALUES (
            NEW.id,
            'TKT-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(nextval('ticket_sequence')::text, 6, '0'),
            'event:' || NEW.event_id || '|user:' || NEW.user_id || '|reg:' || NEW.id || '|ts:' || EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_generate_ticket AFTER UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION generate_ticket_for_confirmed_registration();

-- Create sequence for ticket numbers
CREATE SEQUENCE ticket_sequence START 1;

-- ================================
-- VIEWS FOR COMMON QUERIES
-- ================================

-- Event summary view
CREATE VIEW event_summary AS
SELECT 
    e.*,
    ec.name as category_name,
    u.name as organizer_name,
    COUNT(r.id) as total_registrations,
    COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as confirmed_registrations,
    COUNT(CASE WHEN r.checked_in = true THEN 1 END) as attendance_count,
    AVG(CASE WHEN f.rating IS NOT NULL THEN f.rating END) as average_rating
FROM events e
LEFT JOIN event_categories ec ON e.category_id = ec.id
LEFT JOIN users u ON e.created_by = u.id
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN feedback f ON e.id = f.event_id
GROUP BY e.id, ec.name, u.name;

-- User dashboard view
CREATE VIEW user_dashboard AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT CASE WHEN r.checked_in = true THEN r.id END) as events_attended,
    COUNT(DISTINCT c.id) as certificates_earned,
    COUNT(DISTINCT ua.id) as achievements_earned
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
LEFT JOIN certificates c ON u.id = c.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.name, u.email, u.role;
