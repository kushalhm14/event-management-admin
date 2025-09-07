import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { 
  Portal, 
  Modal, 
  Card, 
  Text, 
  TextInput, 
  Button, 
  HelperText,
  ActivityIndicator 
} from 'react-native-paper';
import { useAdminAuth } from './admin/hooks/useAdminAuth';
import AdminHomeScreen from './admin/screens/AdminHomeScreen';
import EventsScreen from './admin/screens/EventsScreen';
import StudentsScreen from './admin/screens/StudentsScreen';
import ReportsScreen from './admin/screens/ReportsScreen';

// Simple navigation state management for demo
type Screen = 'home' | 'events' | 'students' | 'reports';

const AdminPortalDemo: React.FC = () => {
  const { user, loading, login } = useAdminAuth();
  const isAdmin = !!user;
  const isLoading = loading;
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [loginToken, setLoginToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!loginToken.trim()) {
      setLoginError('Please enter admin token');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');
    
    const success = await login(loginToken);
    
    if (success) {
      setShowLogin(false);
      setLoginToken('');
    } else {
      setLoginError('Invalid admin token. Try "admin123" for demo.');
    }
    
    setIsLoggingIn(false);
  };

  // Show loading screen
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Checking authentication...</Text>
      </View>
    );
  }

  // Show login if not authenticated
  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Card style={{ width: '100%', maxWidth: 400 }}>
          <Card.Title title="Admin Portal Login" />
          <Card.Content>
            <Text style={{ marginBottom: 16 }}>
              Enter admin token to access the portal.
            </Text>
            <Text style={{ marginBottom: 16, fontSize: 12, color: '#666' }}>
              Demo token: admin123
            </Text>
            
            <TextInput
              label="Admin Token"
              value={loginToken}
              onChangeText={setLoginToken}
              mode="outlined"
              error={!!loginError}
              style={{ marginBottom: 8 }}
              onSubmitEditing={handleLogin}
              secureTextEntry
            />
            <HelperText type="error" visible={!!loginError}>
              {loginError}
            </HelperText>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={handleLogin}
              loading={isLoggingIn}
              disabled={isLoggingIn}
              style={{ flex: 1 }}
            >
              Login
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );
  }

  // Simple navigation for demo
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <AdminHomeScreen />;
      case 'events':
        return <EventsScreen />;
      case 'students':
        return <StudentsScreen />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return <AdminHomeScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentScreen()}
      
      {/* Simple Navigation for Demo */}
      {Platform.OS === 'web' && (
        <View style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          flexDirection: 'row',
          gap: 8,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 8,
          borderRadius: 8,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}>
          <Button 
            mode={currentScreen === 'home' ? 'contained' : 'outlined'}
            onPress={() => setCurrentScreen('home')}
            compact
          >
            Home
          </Button>
          <Button 
            mode={currentScreen === 'events' ? 'contained' : 'outlined'}
            onPress={() => setCurrentScreen('events')}
            compact
          >
            Events
          </Button>
          <Button 
            mode={currentScreen === 'students' ? 'contained' : 'outlined'}
            onPress={() => setCurrentScreen('students')}
            compact
          >
            Students
          </Button>
          <Button 
            mode={currentScreen === 'reports' ? 'contained' : 'outlined'}
            onPress={() => setCurrentScreen('reports')}
            compact
          >
            Reports
          </Button>
        </View>
      )}
    </View>
  );
};

export default AdminPortalDemo;
