import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

// Authentication Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Navigation Components
import { StudentNavigator } from './StudentNavigator';
import { AdminNavigator } from './AdminNavigator';

type AuthScreen = 'login' | 'signup' | 'forgot-password';

export const AppRouter: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [currentAuthScreen, setCurrentAuthScreen] = React.useState<AuthScreen>('login');

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Show authentication screens if user is not logged in
  if (!user) {
    const handleNavigate = (screen: string) => {
      setCurrentAuthScreen(screen as AuthScreen);
    };

    switch (currentAuthScreen) {
      case 'signup':
        return (
          <SignupScreen 
            onNavigate={handleNavigate}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen 
            onNavigate={handleNavigate}
          />
        );
      case 'login':
      default:
        return (
          <LoginScreen 
            onNavigate={handleNavigate}
          />
        );
    }
  }

  // Show appropriate navigator based on user role
  switch (user.role) {
    case 'admin':
    case 'organizer':
      return <AdminNavigator onLogout={logout} />;
    case 'student':
    default:
      return <StudentNavigator onLogout={logout} />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
