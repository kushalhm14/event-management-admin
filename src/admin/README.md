# Admin Portal

This admin portal provides comprehensive management capabilities for the Event Management System. It is built with React Native and runs on both web and mobile platforms.

## Features

### ✅ Implemented Features

1. **Authentication**
   - Token-based admin login
   - Secure token storage (localStorage on web, SecureStore on mobile)
   - Demo token: `admin123`

2. **Dashboard**
   - Overview statistics (total events, students, registrations)
   - Most popular events display
   - Top active students list
   - Quick action buttons

3. **Events Management**
   - View all events in a responsive table
   - Create new events with form validation
   - Edit existing events
   - Cancel/activate events
   - Event details with registration counts

4. **Students Management**
   - View all students in a responsive table
   - Add new students with validation
   - Student participation tracking (placeholder)

5. **Reports & Analytics**
   - Event popularity report
   - Top active students report
   - All events summary report
   - CSV export functionality (web only)
   - Quick statistics overview

6. **UI/UX**
   - Desktop-first design with mobile responsiveness
   - Material Design 3 components (React Native Paper)
   - Consistent navigation
   - Loading states and error handling
   - Toast notifications

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Expo CLI

### Installation & Setup

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run web
   ```

3. Access the admin portal:
   - Open http://localhost:8081 in your browser
   - Enter admin token: `admin123`
   - Navigate between different sections using the bottom navigation

### Demo Login
- **Admin Token**: `admin123`
- The portal currently uses mock data for demonstration
- All CRUD operations work with local state

## Architecture

### Project Structure
```
src/
├── admin/
│   ├── screens/           # Main admin screens
│   │   ├── AdminHomeScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   ├── EventFormModal.tsx
│   │   ├── StudentsScreen.tsx
│   │   └── ReportsScreen.tsx
│   ├── components/        # Reusable admin components
│   │   ├── AdminHeader.tsx
│   │   ├── Table.tsx
│   │   └── ConfirmDialog.tsx
│   └── hooks/             # Admin-specific hooks
│       ├── useAdminAuth.tsx
│       └── useAdminQueries.ts
├── services/
│   ├── adminApi.ts        # API service layer
│   └── mockData.ts        # Mock data for development
├── types/
│   └── admin.ts           # TypeScript interfaces
└── utils/
    └── csv.ts             # CSV export utilities
```

### Key Technologies
- **Framework**: Expo (React Native + TypeScript)
- **UI Library**: React Native Paper (Material Design 3)
- **State Management**: @tanstack/react-query
- **HTTP Client**: Axios
- **Authentication**: Token-based with secure storage

## API Integration

### Current State: Mock Data
The admin portal currently uses mock data defined in `src/services/mockData.ts`. To switch to a real backend:

1. Set `USE_MOCK_DATA = false` in `src/services/adminApi.ts`
2. Update `EXPO_PUBLIC_API_URL` in your environment variables
3. Ensure your backend implements the expected API endpoints

### Expected API Endpoints
The admin portal expects these backend endpoints:

**Authentication**
- Token validation (currently mock)

**Colleges**
- `GET /api/colleges`
- `POST /api/colleges`

**Events**
- `GET /api/colleges/:collegeId/events`
- `POST /api/colleges/:collegeId/events`
- `PUT /api/events/:eventId`
- `GET /api/events/:eventId`

**Registrations & Attendance**
- `GET /api/events/:eventId/registrations`
- `POST /api/registrations/:registrationId/attendance`
- `POST /api/registrations/attendance/bulk`

**Students**
- `POST /api/colleges/:collegeId/students`
- `GET /api/colleges/:collegeId/students`

**Reports**
- `GET /api/reports/dashboard?collegeId=`
- `GET /api/reports/event-popularity?collegeId=`
- `GET /api/reports/top-active-students?collegeId=`
- `GET /api/reports/event/:eventId/summary`

**Feedback**
- `GET /api/events/:eventId/feedback`

## CSV Export

### How it Works
- CSV export is available on the Reports screen
- Uses client-side generation with the `csv.ts` utility
- Downloads files directly to the browser's default download folder
- Supports multiple report types (events, students, popularity)

### Exported Files
- `event_popularity_report.csv` - Events ranked by registration count
- `top_active_students_report.csv` - Most active students with attendance rates
- `events_report.csv` - Complete events list with metadata

### Mobile Limitation
CSV export is currently web-only. For mobile support, consider implementing:
- Share sheet integration
- Email attachment functionality
- Cloud storage upload

## Development Notes

### Mock Data
The portal includes comprehensive mock data for development:
- 5 sample events with different statuses
- 5 sample students
- Sample registrations with attendance and feedback
- Realistic dashboard statistics

### Form Validation
All forms include client-side validation:
- Required field validation
- Email format validation
- Date/time validation for events
- Capacity validation (non-negative numbers)

### Error Handling
- Network errors are caught and displayed
- Loading states for all async operations
- Graceful fallbacks for missing data
- User-friendly error messages

### Responsive Design
- Desktop-optimized tables with horizontal scrolling
- Mobile-friendly card layouts for smaller screens
- Adaptive navigation for different screen sizes
- Touch-friendly buttons and inputs

## Future Enhancements

### Planned Features
1. **Event Details Page**
   - Registration management table
   - Attendance marking (single & bulk)
   - Feedback viewing
   - Event analytics

2. **Student Details Page**
   - Participation history
   - Attendance statistics
   - Performance metrics

3. **Advanced Reports**
   - Attendance trends
   - Event feedback analysis
   - Custom date range filtering

4. **Real-time Updates**
   - WebSocket integration
   - Live attendance updates
   - Push notifications

5. **Enhanced Authentication**
   - Role-based access control
   - Multi-college support
   - Password management

### Backend Integration
To connect with a real backend:
1. Update environment variables
2. Implement proper error handling
3. Add request/response logging
4. Implement retry mechanisms
5. Add proper authentication flow

## Troubleshooting

### Common Issues

**Login Issues**
- Ensure you're using the correct demo token: `admin123`
- Check browser console for authentication errors

**Data Not Loading**
- Verify that mock data is enabled in `adminApi.ts`
- Check network tab in browser dev tools

**CSV Export Not Working**
- Ensure you're using the web version
- Check browser's download settings
- Verify popup blockers aren't interfering

### Development Tips
- Use React DevTools for component debugging
- Enable React Query DevTools for API state inspection
- Check expo console for mobile debugging
- Use browser dev tools for network monitoring

## Contributing

When adding new features:
1. Follow existing TypeScript patterns
2. Add proper error handling
3. Include loading states
4. Update mock data if needed
5. Test on both web and mobile
6. Update this README with new features
