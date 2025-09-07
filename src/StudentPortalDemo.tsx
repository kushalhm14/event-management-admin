import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, Appbar, useTheme } from 'react-native-paper';
import { StudentLogin } from './student/screens/StudentLogin';
import { EventList } from './student/screens/EventList';
import { EventDetails } from './student/screens/EventDetails';
import { MyRegistrations } from './student/screens/MyRegistrations';
import { FeedbackScreen } from './student/screens/FeedbackScreen';
import { ProfileScreen } from './student/screens/ProfileScreen';
import { useStudentAuth } from './student/hooks/useStudentAuth';

// Navigation state type
type Screen = 'login' | 'events' | 'event-details' | 'registrations' | 'feedback' | 'profile';

interface NavigationState {
  screen: Screen;
  params?: {
    eventId?: string;
    registrationId?: string;
  };
}

// Create QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Main Student Portal Demo Component
 */
export const StudentPortalDemo: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <StudentApp />
      </PaperProvider>
    </QueryClientProvider>
  );
};

const StudentApp: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useStudentAuth();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    screen: 'login',
  });

  // Set initial screen based on authentication status
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setNavigationState({ screen: 'events' });
      } else {
        setNavigationState({ screen: 'login' });
      }
    }
  }, [isAuthenticated, isLoading]);

  // Handle Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (navigationState.screen === 'login' || navigationState.screen === 'events') {
        return false; // Let the system handle it
      }

      // Custom back navigation logic
      switch (navigationState.screen) {
        case 'event-details':
        case 'registrations':
        case 'profile':
          setNavigationState({ screen: 'events' });
          return true;
        case 'feedback':
          setNavigationState({ screen: 'registrations' });
          return true;
        default:
          return false;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [navigationState.screen]);

  const navigate = (screen: Screen, params?: NavigationState['params']) => {
    setNavigationState({ screen, params });
  };

  const getAppbarTitle = () => {
    switch (navigationState.screen) {
      case 'login':
        return 'Student Portal';
      case 'events':
        return 'Events';
      case 'event-details':
        return 'Event Details';
      case 'registrations':
        return 'My Registrations';
      case 'feedback':
        return 'Feedback';
      case 'profile':
        return 'Profile';
      default:
        return 'Student Portal';
    }
  };

  const canGoBack = () => {
    return navigationState.screen !== 'login' && navigationState.screen !== 'events';
  };

  const handleBack = () => {
    switch (navigationState.screen) {
      case 'event-details':
      case 'registrations':
      case 'profile':
        navigate('events');
        break;
      case 'feedback':
        navigate('registrations');
        break;
    }
  };

  const handleLogout = () => {
    navigate('login');
  };

  const renderScreen = () => {
    if (isLoading) {
      return <View style={styles.container} />; // Loading state
    }

    switch (navigationState.screen) {
      case 'login':
        return (
          <StudentLogin
            onLoginSuccess={() => navigate('events')}
          />
        );

      case 'events':
        return (
          <EventList
            onEventPress={(eventId: string) => navigate('event-details', { eventId })}
          />
        );

      case 'event-details':
        return (
          <EventDetails
            eventId={navigationState.params?.eventId || ''}
            onBack={() => navigate('events')}
            onViewRegistrations={() => navigate('registrations')}
          />
        );

      case 'registrations':
        return (
          <MyRegistrations
            onFeedbackPress={(registrationId: string) => navigate('feedback', { registrationId })}
          />
        );

      case 'feedback':
        return (
          <FeedbackScreen
            registrationId={navigationState.params?.registrationId || ''}
            onBack={() => navigate('registrations')}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            onLogout={handleLogout}
          />
        );

      default:
        return <StudentLogin onLoginSuccess={() => navigate('events')} />;
    }
  };

  return (
    <View style={styles.container}>
      {isAuthenticated && navigationState.screen !== 'login' && (
        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          {canGoBack() && (
            <Appbar.BackAction onPress={handleBack} iconColor="white" />
          )}
          <Appbar.Content title={getAppbarTitle()} titleStyle={{ color: 'white' }} />
          {navigationState.screen === 'events' && (
            <>
              <Appbar.Action
                icon="account-box"
                onPress={() => navigate('registrations')}
                iconColor="white"
              />
              <Appbar.Action
                icon="account"
                onPress={() => navigate('profile')}
                iconColor="white"
              />
            </>
          )}
        </Appbar.Header>
      )}
      
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default StudentPortalDemo;
