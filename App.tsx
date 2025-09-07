import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { AdminAuthProvider } from './src/admin/hooks/useAdminAuth';
import AdminPortalDemo from './src/AdminPortalDemo';
import StudentPortalDemo from './src/StudentPortalDemo';
import PortalSelector from './src/PortalSelector';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  const [selectedPortal, setSelectedPortal] = useState<'admin' | 'student' | null>(null);

  const renderPortal = () => {
    switch (selectedPortal) {
      case 'admin':
        return (
          <AdminAuthProvider>
            <AdminPortalDemo />
          </AdminAuthProvider>
        );
      case 'student':
        return <StudentPortalDemo />;
      default:
        return <PortalSelector onPortalSelect={setSelectedPortal} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        {renderPortal()}
        <StatusBar style="auto" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
