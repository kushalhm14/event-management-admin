import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { theme } from '../../theme/theme';

type AuthScreen = 'Login' | 'Signup' | 'ForgotPassword';

export const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('Login');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as AuthScreen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen onNavigate={handleNavigate} />;
      case 'Signup':
        return <SignupScreen onNavigate={handleNavigate} />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen onNavigate={handleNavigate} />;
      default:
        return <LoginScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
