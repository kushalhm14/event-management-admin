import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  Button,
  Snackbar,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RegistrationButton } from '../components/RegistrationButton';
import { studentApi } from '../../services/studentApi';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { Event } from '../../types/student';

interface EventDetailsProps {
  eventId: string;
  onBack: () => void;
  onViewRegistrations: () => void;
}

/**
 * Event details screen with registration functionality
 */
export const EventDetails: React.FC<EventDetailsProps> = ({
  eventId,
  onBack,
  onViewRegistrations,
}) => {
  const theme = useTheme();
  const { studentId } = useStudentAuth();
  const queryClient = useQueryClient();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch event details
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useQuery<Event, Error>({
    queryKey: ['event', eventId],
    queryFn: () => studentApi.fetchEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });

  // Check if student is already registered
  const {
    data: registrations = [],
    isLoading: isLoadingRegistrations,
  } = useQuery({
    queryKey: ['my-registrations', studentId],
    queryFn: () => studentApi.fetchStudentRegistrations(studentId!),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: () => studentApi.registerForEvent(eventId, studentId!),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['my-registrations', studentId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      
      showSnackbar('Successfully registered for the event!');
      setTimeout(() => {
        onViewRegistrations();
      }, 2000);
    },
    onError: (error: any) => {
      let message = 'Failed to register for event';
      
      if (error.code === 409) {
        if (error.message.includes('already registered')) {
          message = 'You are already registered for this event';
        } else if (error.message.includes('full')) {
          message = 'Sorry, this event is full';
        } else {
          message = error.message;
        }
      } else if (error.code === 400) {
        message = 'Cannot register for this event';
      }
      
      Alert.alert('Registration Failed', message);
    },
  });

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const isRegistered = registrations.some((reg: any) => reg.event_id === eventId);

  const handleRegister = () => {
    if (!studentId) {
      Alert.alert('Error', 'You must be logged in to register');
      return;
    }

    if (isRegistered) {
      Alert.alert('Already Registered', 'You are already registered for this event');
      return;
    }

    registerMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = () => {
    if (!event) return theme.colors.primary;
    
    switch (event.type) {
      case 'workshop':
        return '#2196F3';
      case 'seminar':
        return '#4CAF50';
      case 'hackathon':
        return '#FF9800';
      case 'cultural':
        return '#9C27B0';
      case 'sports':
        return '#F44336';
      default:
        return theme.colors.primary;
    }
  };

  if (isLoadingEvent || isLoadingRegistrations) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (eventError || !event) {
    return (
      <View style={styles.errorContainer}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorTitle}>
              Event not found
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              The event you're looking for doesn't exist or has been removed.
            </Text>
            <Button mode="contained" onPress={onBack} style={styles.backButton}>
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.mainCard}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="headlineSmall" style={styles.title}>
                {event.title}
              </Text>
              <View style={styles.badges}>
                <Chip
                  mode="outlined"
                  style={[styles.typeChip, { borderColor: getTypeColor() }]}
                  textStyle={{ color: getTypeColor() }}
                >
                  {event.type.toUpperCase()}
                </Chip>
                {event.status === 'cancelled' && (
                  <Chip
                    mode="flat"
                    style={[styles.statusChip, { backgroundColor: theme.colors.errorContainer }]}
                    textStyle={{ color: theme.colors.onErrorContainer }}
                  >
                    CANCELLED
                  </Chip>
                )}
              </View>
            </View>

            <Text variant="bodyLarge" style={styles.description}>
              {event.description}
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  📅 Date & Time
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {formatDate(event.start_time)}
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  📍 Location
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {event.location}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge" style={styles.detailLabel}>
                  👥 Capacity
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {event.registered_count} / {event.capacity} registered
                </Text>
              </View>

              {event.mentors && event.mentors.length > 0 && (
                <View style={styles.detailRow}>
                  <Text variant="labelLarge" style={styles.detailLabel}>
                    👨‍🏫 Mentors
                  </Text>
                  {event.mentors.map((mentor, index) => (
                    <Text key={index} variant="bodyMedium" style={styles.detailValue}>
                      {mentor}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionSection}>
          <RegistrationButton
            event={event}
            isRegistered={isRegistered}
            isLoading={registerMutation.isPending}
            onPress={handleRegister}
          />
          
          {isRegistered && (
            <Button
              mode="outlined"
              onPress={onViewRegistrations}
              style={styles.viewRegistrationsButton}
            >
              View My Registrations
            </Button>
          )}
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorMessage: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'center',
  },
  mainCard: {
    margin: 16,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  description: {
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  detailsSection: {
    gap: 16,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    opacity: 0.8,
    paddingLeft: 8,
  },
  actionSection: {
    padding: 16,
    gap: 12,
  },
  viewRegistrationsButton: {
    marginTop: 8,
  },
  snackbar: {
    marginBottom: 16,
  },
});

export default EventDetails;
