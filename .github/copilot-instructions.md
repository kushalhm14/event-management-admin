<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project: Event Management System with Admin Portal

This is an Expo React Native project with TypeScript that provides a comprehensive event management system with both student and admin interfaces.

## Key Technologies & Patterns

- **Framework**: Expo React Native with TypeScript
- **UI Library**: React Native Paper (Material Design 3)
- **State Management**: @tanstack/react-query for server state
- **HTTP Client**: Axios with interceptors for auth
- **Navigation**: Simple state-based navigation (demo)
- **Authentication**: Token-based with secure storage
- **Platform Support**: Web + Mobile (iOS/Android)

## Code Style Guidelines

1. **TypeScript**: Use strict typing, define interfaces in `src/types/`
2. **Components**: Functional components with React hooks
3. **Styling**: Use React Native Paper components, inline styles when needed
4. **Error Handling**: Always include loading states and error boundaries
5. **API Calls**: Use React Query hooks, not direct API calls in components
6. **File Organization**: Group by feature, not by file type

## Admin Portal Specific

The admin portal (`src/admin/`) follows these patterns:
- **Screens**: Main UI screens with data fetching
- **Components**: Reusable UI components (Table, Modals, Headers)
- **Hooks**: Custom hooks for auth and API calls
- **Services**: API layer with mock data support

## Current Implementation Status

✅ **Completed Features**:
- Admin authentication with token storage
- Dashboard with statistics and quick actions
- Events CRUD with responsive table
- Students management with create/view
- Reports with CSV export (web only)
- Responsive design for web and mobile

🚧 **Areas for Enhancement**:
- Event details with registrations management
- Attendance marking (single & bulk)
- Student participation details
- Real backend integration
- Advanced reporting features

## Development Notes

- **Mock Data**: Currently using mock data (`src/services/mockData.ts`)
- **API Toggle**: Switch `USE_MOCK_DATA` in `adminApi.ts` for real backend
- **Demo Login**: Use token `admin123` for admin access
- **CSV Export**: Web-only feature using browser download API
- **Responsive**: Desktop-first design with mobile fallbacks

## When Contributing

1. Maintain TypeScript strict mode
2. Include proper error handling and loading states
3. Test on both web and mobile platforms
4. Update mock data when adding new features
5. Follow Material Design 3 principles
6. Keep components small and focused
7. Use React Query for all API state management
