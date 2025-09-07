# Student Module - Event Management System

A complete student interface for browsing events, registering, providing feedback, and managing profile within the existing Expo React Native project.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run web
   ```

2. **Open in browser:**
   ```
   http://localhost:8081
   ```

3. **Access Student Portal:**
   - Choose "Student" from the main interface
   - Or access `StudentPortalDemo` component directly

4. **Login with demo credentials:**
   - `stu-1` (Asha Patel)
   - `stu-2` (Rahul Kumar) 
   - `stu-3` (Priya Sharma)

## 🔧 Configuration

### Mock Data Toggle
The student module uses mock data by default. To switch between mock and real backend:

**Environment Variable:**
```bash
EXPO_USE_MOCK_DATA=true   # Use mock data (default)
EXPO_USE_MOCK_DATA=false  # Use real backend
```

**Backend URL:**
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Mock Data Features
- ✅ 5 realistic events (workshops, seminars, hackathons)
- ✅ 3 demo students with complete profiles
- ✅ Sample registrations with attendance tracking
- ✅ Feedback submissions and certificate links
- ✅ Error handling for full capacity, cancelled events, duplicates

## 📱 Features

### 🔐 Authentication
- **Demo Login**: Simple student ID-based authentication
- **Persistence**: Login state preserved across app reloads using AsyncStorage
- **Auto-logout**: Session management with manual logout option

### 📋 Event Management
- **Browse Events**: Search and filter events by title, type, location
- **Event Details**: Full event information with mentor details
- **Registration**: One-click registration with error handling:
  - ✅ Success confirmation and navigation to "My Registrations"
  - ❌ Duplicate registration prevention
  - ❌ Capacity full notification
  - ❌ Cancelled event prevention
- **Real-time Updates**: Automatic query invalidation and data refresh

### 📚 My Registrations
- **Registration History**: View all registered events
- **Attendance Status**: Present/Absent/Pending indicators
- **Feedback Tracking**: Show submitted ratings and comments
- **Certificate Downloads**: Direct links to certificates (opens in new tab on web)

### ⭐ Feedback System
- **Star Rating**: Interactive 1-5 star rating component
- **Comments**: Optional text feedback
- **Validation**: Prevents duplicate feedback submission
- **Confirmation**: Success notification and automatic navigation

### 👤 Profile Management
- **View Profile**: Display student information and metadata
- **Edit Profile**: Update name, email, avatar URL, and bio
- **Form Validation**: Email format validation and required fields
- **Persistence**: Profile changes saved and cached

## 🧪 Manual Testing Guide

### Test Scenario 1: Student Registration Flow
1. **Login**: Use `stu-1` demo ID
2. **Browse Events**: Verify events load with search functionality
3. **Register**: Click "AI Workshop Series" → Register
4. **Verify Success**: Should show success message and navigate to registrations
5. **Check Registration**: Verify event appears in "My Registrations"

### Test Scenario 2: Error Handling
1. **Duplicate Registration**: Try registering for same event again
   - Expected: "Already registered" message
2. **Full Event**: Try registering for "React Native Masterclass" (capacity: 2)
   - Expected: "Event is full" message  
3. **Cancelled Event**: Try registering for "Photography Workshop"
   - Expected: "Event cancelled" message

### Test Scenario 3: Feedback Submission
1. **Navigate**: Go to "My Registrations"
2. **Give Feedback**: Click "Give Feedback" on a present registration
3. **Submit**: Rate 4-5 stars, add comment, submit
4. **Verify**: Return to registrations, verify feedback displays

### Test Scenario 4: Profile Management
1. **Access Profile**: Click profile icon in header
2. **Edit Profile**: Click "Edit Profile", modify name and bio
3. **Save**: Submit changes
4. **Verify**: Reload and confirm changes persist

### Test Scenario 5: Certificate Download
1. **View Registration**: Find registration with certificate (stu-1 → AI Workshop)
2. **Download**: Click "Certificate" button
3. **Verify**: New tab opens with certificate URL

## 🔌 API Integration

### Mock API Functions
Located in `src/services/mockStudentData.ts`:

- `fetchEvents()` - Get all events
- `fetchEvent(id)` - Get single event details  
- `registerForEvent(eventId, studentId)` - Register for event
- `fetchStudentRegistrations(studentId)` - Get student's registrations
- `submitFeedback(registrationId, feedback)` - Submit event feedback
- `updateProfile(collegeId, studentId, data)` - Update student profile
- `fetchCertificate(registrationId)` - Get certificate URL

### Real API Endpoints
When `EXPO_USE_MOCK_DATA=false`:

- `GET /api/colleges/col-1/events` - List events
- `GET /api/events/:id` - Event details
- `POST /api/events/:id/register` - Register student
- `GET /api/registrations?student_id=:id` - Student registrations
- `POST /api/registrations/:id/feedback` - Submit feedback
- `PUT /api/colleges/:collegeId/students/:id` - Update profile

## 🏗️ Architecture

### File Structure
```
src/
├── student/
│   ├── screens/
│   │   ├── StudentLogin.tsx        # Demo login screen
│   │   ├── EventList.tsx          # Browse events with search
│   │   ├── EventDetails.tsx       # Event details + registration
│   │   ├── MyRegistrations.tsx    # Student's registrations
│   │   ├── FeedbackScreen.tsx     # Rating and feedback form
│   │   └── ProfileScreen.tsx      # Profile view and edit
│   ├── components/
│   │   ├── EventCard.tsx          # Event list item component
│   │   ├── RegistrationButton.tsx # Registration CTA with states
│   │   └── RatingStars.tsx        # Interactive star rating
│   └── hooks/
│       └── useStudentAuth.tsx     # Authentication state management
├── services/
│   ├── studentApi.ts             # API layer with mock toggle
│   └── mockStudentData.ts        # Mock data and API functions
├── types/
│   └── student.ts               # TypeScript interfaces
├── utils/
│   └── storage.ts              # AsyncStorage utilities
└── StudentPortalDemo.tsx       # Main app component with navigation
```

### State Management
- **React Query**: Server state and caching for all API calls
- **React Hooks**: Local component state for forms and UI
- **AsyncStorage**: Persistent storage for authentication

### Navigation
- Simple state-based navigation with proper back button handling
- Authentication guard redirects to login when not authenticated
- Deep linking support for event details and feedback screens

## 🎨 UI/UX Design

### Material Design 3
- Uses React Native Paper components throughout
- Consistent color scheme and typography
- Responsive design for web and mobile

### Accessibility
- Proper touch targets (44px minimum)
- Screen reader compatible
- Keyboard navigation support on web
- Color contrast compliance

### Cross-Platform
- Works on iOS, Android, and Web
- Platform-specific adaptations (e.g., certificate download)
- Responsive layouts for different screen sizes

## 🐛 Known Issues & Limitations

1. **Certificate Downloads**: Mock certificates are placeholder URLs
2. **Real-time Updates**: No WebSocket support for live event updates  
3. **Offline Support**: Limited offline functionality
4. **Image Upload**: Avatar changes require external URL (no file upload)
5. **Push Notifications**: Not implemented for event reminders

## 🚧 Future Enhancements

- [ ] QR code generation for event check-ins
- [ ] Push notifications for event updates
- [ ] Offline-first architecture with sync
- [ ] Social features (event sharing, comments)
- [ ] Advanced search and filtering
- [ ] Calendar integration
- [ ] File upload for profile avatars

## 🧑‍💻 Development

### Adding New Features
1. Add types to `src/types/student.ts`
2. Extend mock data in `src/services/mockStudentData.ts`
3. Update API layer in `src/services/studentApi.ts`
4. Create/update components and screens
5. Update navigation in `StudentPortalDemo.tsx`

### Testing
- Manual testing scenarios provided above
- React Query DevTools available in development
- Console logging for API calls and errors

### Deployment
- Same build process as admin portal
- Environment variables configurable for production
- Mock data easily disabled for production backend

---

**Demo Student IDs**: `stu-1`, `stu-2`, `stu-3`  
**Mock Data**: Enabled by default  
**Tech Stack**: Expo + React Native + TypeScript + React Query + React Native Paper
