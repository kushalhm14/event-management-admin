# Event Management System with Admin Portal

A comprehensive event management system built with Expo React Native, featuring both student and admin interfaces that work seamlessly on web and mobile platforms.

## 🚀 Features

### Admin Portal
- **Dashboard**: Overview statistics, popular events, and top students
- **Event Management**: CRUD operations with responsive table interface
- **Student Management**: Add and view students with participation tracking
- **Reports & Analytics**: Event popularity, student activity, CSV export
- **Authentication**: Secure token-based login
- **Responsive Design**: Desktop-first with mobile optimization

### Technical Highlights
- **Cross-platform**: Single codebase for web, iOS, and Android
- **Modern UI**: Material Design 3 with React Native Paper
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Query for server state
- **Mock Data**: Comprehensive mock API for development

## 🛠️ Tech Stack

- **Framework**: Expo (React Native + TypeScript)
- **UI Library**: React Native Paper
- **State Management**: @tanstack/react-query
- **HTTP Client**: Axios
- **Authentication**: Token-based with secure storage
- **CSV Export**: Client-side generation
- **Development**: Mock data with realistic API simulation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Expo CLI (optional)

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd Assisgnment
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run web
   ```

3. **Access the admin portal**:
   - Open http://localhost:8081 in your browser
   - Enter admin token: `admin123`
   - Explore the dashboard, events, students, and reports

### Mobile Development
```bash
# For iOS (requires macOS)
npm run ios

# For Android
npm run android
```

## 📱 Admin Portal Guide

### Login
- **Demo Token**: `admin123`
- Tokens are stored securely (localStorage on web, SecureStore on mobile)

### Navigation
- **Dashboard**: Overview and quick actions
- **Events**: Manage all events with create/edit/cancel functionality
- **Students**: Add and view student information
- **Reports**: Analytics with CSV export capability

### Key Features

#### Events Management
- View all events in a responsive table
- Create new events with validation
- Edit existing events
- Cancel/activate events
- View registration statistics

#### Students Management
- Add new students with form validation
- View all students in organized table
- Track student participation (planned)

#### Reports & Analytics
- Event popularity rankings
- Top active students
- CSV export for data analysis
- Quick statistics overview

## 📁 Project Structure

```
src/
├── admin/                 # Admin portal implementation
│   ├── screens/          # Main admin screens
│   ├── components/       # Reusable admin components
│   └── hooks/           # Admin-specific hooks
├── services/            # API and mock data services
├── types/              # TypeScript interface definitions
├── utils/             # Utility functions (CSV, etc.)
└── AdminPortalDemo.tsx # Main demo component
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ADMIN_TOKEN=admin123
```

### Mock Data vs Real Backend
Currently using mock data for demonstration. To switch to a real backend:

1. Set `USE_MOCK_DATA = false` in `src/services/adminApi.ts`
2. Update API URL in environment variables
3. Ensure backend implements expected endpoints (see API documentation)

## 📊 Mock Data

The project includes comprehensive mock data for development:
- **5 sample events** with different statuses and types
- **5 sample students** with realistic information
- **Sample registrations** with attendance and feedback
- **Dashboard statistics** for overview display

## 🌐 API Documentation

### Expected Backend Endpoints

**Authentication**
- Token validation for admin access

**Events**
- `GET /api/colleges/:collegeId/events` - List events
- `POST /api/colleges/:collegeId/events` - Create event
- `PUT /api/events/:eventId` - Update event

**Students**
- `GET /api/colleges/:collegeId/students` - List students
- `POST /api/colleges/:collegeId/students` - Create student

**Reports**
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/event-popularity` - Popular events
- `GET /api/reports/top-active-students` - Active students

*Full API documentation available in `/src/admin/README.md`*

## 💾 CSV Export

The admin portal supports CSV export for reports:
- **Event popularity** with registration counts
- **Student activity** with attendance rates
- **Complete event lists** with metadata
- **Web-only feature** using browser download API

## 🎨 Design System

### UI Components
- **Material Design 3** via React Native Paper
- **Responsive tables** for desktop and mobile
- **Consistent navigation** across platforms
- **Loading states** and error handling
- **Toast notifications** for user feedback

### Responsive Design
- **Desktop-first** approach with mobile fallbacks
- **Adaptive tables** that become cards on mobile
- **Touch-friendly** controls and navigation
- **Cross-platform** consistency

## 🧪 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# Web build
npm run build

# iOS build (requires macOS)
npx expo build:ios

# Android build
npx expo build:android
```

### Debugging
- **React DevTools** for component debugging
- **React Query DevTools** for API state inspection
- **Expo DevTools** for mobile debugging
- **Browser DevTools** for web development

## 🔮 Future Enhancements

### Planned Features
1. **Event Details Page** with registration management
2. **Attendance Marking** (single and bulk operations)
3. **Student Details Page** with participation history
4. **Advanced Analytics** with custom date ranges
5. **Real-time Updates** via WebSocket
6. **Multi-college Support** with role-based access

### Technical Improvements
1. **Real Backend Integration** with proper API
2. **Enhanced Authentication** with role management
3. **Offline Support** with data synchronization
4. **Push Notifications** for event updates
5. **Advanced Reporting** with charts and graphs

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain responsive design principles
3. Include proper error handling
4. Test on both web and mobile
5. Update documentation for new features

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues:
1. Check the admin portal README at `/src/admin/README.md`
2. Review the API documentation
3. Test with mock data first
4. Check browser console for errors

---

**Demo Credentials**: Use admin token `admin123` to access the admin portal.

Built with ❤️ using Expo, React Native, and TypeScript.
