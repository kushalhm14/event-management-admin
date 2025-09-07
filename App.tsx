import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AuthNavigator } from './src/screens/auth/AuthNavigator';
import { LoadingScreen } from './src/components/LoadingScreen';
import AdminPortalDemo from './src/AdminPortalDemo';
import StudentPortalDemo from './src/StudentPortalDemo';
import PortalSelector from './src/PortalSelector';
import { theme } from './src/theme/theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Main content component that uses auth context
const AppContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [selectedPortal, setSelectedPortal] = useState<'admin' | 'student' | null>(null);

  // Show loading state while initializing auth
  if (isLoading) {
    return <LoadingScreen message="Initializing application..." />;
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated || !user) {
    return <AuthNavigator />;
  }

  // Route based on user role
  if (user.role === 'admin' || user.role === 'organizer') {
    return <AdminPortalDemo />;
  }

  if (user.role === 'student') {
    return <StudentPortalDemo />;
  }

  // Fallback to portal selector (shouldn't normally reach here)
  const renderPortal = () => {
    switch (selectedPortal) {
      case 'admin':
        return <AdminPortalDemo />;
      case 'student':
        return <StudentPortalDemo />;
      default:
        return <PortalSelector onPortalSelect={setSelectedPortal} />;
    }
  };

  return renderPortal();
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppContent />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
