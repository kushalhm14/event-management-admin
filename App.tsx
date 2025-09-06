import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { AdminAuthProvider } from './src/admin/hooks/useAdminAuth';
import AdminPortalDemo from './src/AdminPortalDemo';

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
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <AdminAuthProvider>
          <AdminPortalDemo />
          <StatusBar style="auto" />
        </AdminAuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
