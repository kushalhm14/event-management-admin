import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  useTheme,
  Text 
} from 'react-native-paper';

interface PortalSelectorProps {
  onPortalSelect: (portal: 'admin' | 'student') => void;
}

/**
 * Portal selection screen to choose between Admin and Student interfaces
 */
export const PortalSelector: React.FC<PortalSelectorProps> = ({ onPortalSelect }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.appTitle}>
          Event Management System
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Choose your portal to continue
        </Text>
      </View>

      <View style={styles.portalsContainer}>
        <Card style={[styles.portalCard, styles.adminCard]} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color: theme.colors.primary }]}>
                👨‍💼
              </Text>
            </View>
            <Title style={styles.cardTitle}>Admin Portal</Title>
            <Paragraph style={styles.cardDescription}>
              Manage events, students, registrations, and generate reports.
              Complete administrative control over the system.
            </Paragraph>
            <View style={styles.features}>
              <Text style={styles.feature}>• Event CRUD operations</Text>
              <Text style={styles.feature}>• Student management</Text>
              <Text style={styles.feature}>• Attendance tracking</Text>
              <Text style={styles.feature}>• Analytics & reports</Text>
              <Text style={styles.feature}>• CSV export</Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              mode="contained"
              onPress={() => onPortalSelect('admin')}
              style={styles.selectButton}
            >
              Open Admin Portal
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.portalCard, styles.studentCard]} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color: theme.colors.secondary }]}>
                🎓
              </Text>
            </View>
            <Title style={styles.cardTitle}>Student Portal</Title>
            <Paragraph style={styles.cardDescription}>
              Browse events, register for activities, submit feedback, and manage your profile.
            </Paragraph>
            <View style={styles.features}>
              <Text style={styles.feature}>• Browse & search events</Text>
              <Text style={styles.feature}>• Event registration</Text>
              <Text style={styles.feature}>• My registrations</Text>
              <Text style={styles.feature}>• Feedback submission</Text>
              <Text style={styles.feature}>• Profile management</Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              mode="contained"
              onPress={() => onPortalSelect('student')}
              style={styles.selectButton}
              buttonColor={theme.colors.secondary}
            >
              Open Student Portal
            </Button>
          </Card.Actions>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          Demo mode enabled • Mock data available for testing
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  appTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  portalsContainer: {
    flex: 1,
    gap: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  portalCard: {
    flex: 1,
    minHeight: 280,
    elevation: 6,
    borderRadius: 16,
  },
  adminCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  studentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#388e3c',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  cardDescription: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  features: {
    marginTop: 8,
  },
  feature: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  cardActions: {
    padding: 20,
    paddingTop: 0,
  },
  selectButton: {
    width: '100%',
    paddingVertical: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default PortalSelector;
