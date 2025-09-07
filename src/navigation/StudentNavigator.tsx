import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation, IconButton, Badge } from 'react-native-paper';
import { theme } from '../theme/theme';

// Student Screens
import { StudentDashboard } from '../screens/student/StudentDashboard';
import { EventDetails } from '../screens/student/EventDetails';
import { MyTickets } from '../screens/student/MyTickets';
import { QRScanner } from '../screens/student/QRScanner';
import { Certificates } from '../screens/student/Certificates';

// Shared Screens
import { Profile } from '../screens/shared/Profile';

interface NavigationRoute {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  badge?: number;
}

interface StudentNavigatorProps {
  onLogout?: () => void;
}

export const StudentNavigator: React.FC<StudentNavigatorProps> = ({ onLogout }) => {
  const [index, setIndex] = useState(0);
  const [screenStack, setScreenStack] = useState<Array<{ screen: string; params?: any }>>([]);

  // Mock badge counts - in a real app, these would come from context/state
  const upcomingEventsCount = 3;
  const newCertificatesCount = 1;

  const routes: NavigationRoute[] = [
    { 
      key: 'discover', 
      title: 'Discover', 
      focusedIcon: 'compass', 
      unfocusedIcon: 'compass-outline' 
    },
    { 
      key: 'tickets', 
      title: 'My Tickets', 
      focusedIcon: 'ticket', 
      unfocusedIcon: 'ticket-outline',
      badge: upcomingEventsCount 
    },
    { 
      key: 'scan', 
      title: 'Scan', 
      focusedIcon: 'qrcode-scan' 
    },
    { 
      key: 'certificates', 
      title: 'Certificates', 
      focusedIcon: 'certificate', 
      unfocusedIcon: 'certificate-outline',
      badge: newCertificatesCount 
    },
    { 
      key: 'profile', 
      title: 'Profile', 
      focusedIcon: 'account', 
      unfocusedIcon: 'account-outline' 
    },
  ];

  const handleNavigate = (screen: string, params?: any) => {
    setScreenStack(prev => [...prev, { screen, params }]);
  };

  const handleBack = () => {
    if (screenStack.length > 0) {
      setScreenStack(prev => prev.slice(0, -1));
    }
  };

  const getCurrentScreen = () => {
    if (screenStack.length > 0) {
      const current = screenStack[screenStack.length - 1];
      switch (current.screen) {
        case 'EventDetails':
          return (
            <EventDetails 
              eventId={current.params?.eventId}
              onBack={handleBack}
            />
          );
        case 'QRScanner':
          return (
            <QRScanner 
              onBack={handleBack}
            />
          );
        default:
          return getMainScreen();
      }
    }
    return getMainScreen();
  };

  const getMainScreen = () => {
    switch (routes[index].key) {
      case 'discover':
        return (
          <StudentDashboard 
            onNavigate={handleNavigate}
          />
        );
      case 'tickets':
        return (
          <MyTickets 
            onNavigate={handleNavigate}
          />
        );
      case 'scan':
        return (
          <QRScanner />
        );
      case 'certificates':
        return (
          <Certificates 
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <Profile 
            onNavigate={handleNavigate}
            onLogout={onLogout}
          />
        );
      default:
        return (
          <StudentDashboard 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  const renderScene = BottomNavigation.SceneMap({
    discover: () => getMainScreen(),
    tickets: () => getMainScreen(),
    scan: () => getMainScreen(),
    certificates: () => getMainScreen(),
    profile: () => getMainScreen(),
  });

  const renderIcon = ({ route, focused, color }: any) => {
    const routeData = routes.find(r => r.key === route.key);
    const iconName = focused 
      ? routeData?.focusedIcon 
      : (routeData?.unfocusedIcon || routeData?.focusedIcon);
    
    const iconStyle = route.key === 'scan' ? {
      backgroundColor: focused ? theme.colors.primary : theme.colors.surfaceVariant,
      borderRadius: 20,
      padding: 5,
    } : {};

    const iconColor = route.key === 'scan' && focused ? 'white' : color;

    return (
      <View style={{ position: 'relative' }}>
        <View style={iconStyle}>
          <IconButton 
            icon={iconName || 'help'} 
            size={24} 
            iconColor={iconColor}
            style={{ margin: 0 }}
          />
        </View>
        {routeData?.badge && routeData.badge > 0 && (
          <Badge
            size={16}
            style={styles.badge}
          >
            {routeData.badge > 9 ? '9+' : routeData.badge}
          </Badge>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {getCurrentScreen()}
      </View>
      
      {screenStack.length === 0 && (
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          renderIcon={renderIcon}
          style={styles.bottomNavigation}
          barStyle={styles.bottomNavigationBar}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.onSurfaceVariant}
          labeled={true}
          compact={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  bottomNavigation: {
    backgroundColor: theme.colors.surface,
  },
  bottomNavigationBar: {
    backgroundColor: theme.colors.surface,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopColor: theme.colors.outline,
    borderTopWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
  },
});
