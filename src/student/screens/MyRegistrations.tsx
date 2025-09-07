import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Linking, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../../services/studentApi';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { Registration } from '../../types/student';

interface MyRegistrationsProps {
  onFeedbackPress: (registrationId: string) => void;
}

/**
 * My Registrations screen showing student's event registrations
 */
export const MyRegistrations: React.FC<MyRegistrationsProps> = ({
  onFeedbackPress,
}) => {
  const theme = useTheme();
  const { studentId } = useStudentAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch student registrations
  const {
    data: registrations = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Registration[], Error>({
    queryKey: ['my-registrations', studentId],
    queryFn: () => studentApi.fetchStudentRegistrations(studentId!),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  });

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleDownloadCertificate = async (registrationId: string, certUrl?: string) => {
    if (certUrl) {
      try {
        const canOpen = await Linking.canOpenURL(certUrl);
        if (canOpen) {
          await Linking.openURL(certUrl);
        } else {
          showSnackbar('Cannot open certificate link');
        }
      } catch (error) {
        console.error('Failed to open certificate:', error);
        showSnackbar('Failed to open certificate');
      }
    } else {
      try {
        const result = await studentApi.fetchCertificate(registrationId);
        if (result.cert_url) {
          const canOpen = await Linking.canOpenURL(result.cert_url);
          if (canOpen) {
            await Linking.openURL(result.cert_url);
          } else {
            showSnackbar('Cannot open certificate link');
          }
        }
      } catch (error: any) {
        if (error.code === 404) {
          showSnackbar('Certificate not available yet');
        } else {
          showSnackbar('Failed to load certificate');
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAttendanceChipProps = (status: string) => {
    switch (status) {
      case 'present':
        return {
          style: { backgroundColor: theme.colors.primaryContainer },
          textStyle: { color: theme.colors.onPrimaryContainer },
          text: 'Present',
        };
      case 'absent':
        return {
          style: { backgroundColor: theme.colors.errorContainer },
          textStyle: { color: theme.colors.onErrorContainer },
          text: 'Absent',
        };
      default:
        return {
          style: { backgroundColor: theme.colors.surfaceVariant },
          textStyle: { color: theme.colors.onSurfaceVariant },
          text: 'Pending',
        };
    }
  };

  const renderRegistration = ({ item: registration }: { item: Registration }) => {
    const attendanceProps = getAttendanceChipProps(registration.attendance_status);
    const hasFeedback = !!registration.feedback;
    const hasCertificate = !!registration.cert_url;

    return (
      <Card style={styles.registrationCard} mode="elevated">
        <Card.Content>
          <View style={styles.registrationHeader}>
            <Text variant="titleMedium" style={styles.eventTitle} numberOfLines={2}>
              {registration.event_title}
            </Text>
            <Chip
              mode="flat"
              compact
              style={[styles.attendanceChip, attendanceProps.style]}
              textStyle={attendanceProps.textStyle}
            >
              {attendanceProps.text}
            </Chip>
          </View>

          <Text variant="bodySmall" style={styles.registrationDate}>
            Registered on {formatDate(registration.registered_at)}
          </Text>

          {hasFeedback && (
            <View style={styles.feedbackContainer}>
              <Text variant="bodySmall" style={styles.feedbackText}>
                ⭐ Your rating: {registration.feedback!.rating}/5
              </Text>
              {registration.feedback!.comment && (
                <Text variant="bodySmall" style={styles.feedbackComment}>
                  "{registration.feedback!.comment}"
                </Text>
              )}
            </View>
          )}

          <View style={styles.actionButtons}>
            {!hasFeedback && registration.attendance_status === 'present' && (
              <Button
                mode="outlined"
                compact
                onPress={() => onFeedbackPress(registration.id)}
                style={styles.actionButton}
              >
                Give Feedback
              </Button>
            )}

            {hasCertificate && (
              <Button
                mode="contained"
                compact
                icon="download"
                onPress={() => handleDownloadCertificate(registration.id, registration.cert_url)}
                style={styles.actionButton}
              >
                Certificate
              </Button>
            )}

            {!hasCertificate && registration.attendance_status === 'present' && (
              <Button
                mode="outlined"
                compact
                disabled
                style={[styles.actionButton, styles.disabledButton]}
              >
                Certificate Pending
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Registrations Yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptyMessage}>
        You haven't registered for any events yet. Browse events to get started!
      </Text>
      <Button
        mode="contained"
        onPress={() => refetch()}
        style={styles.refreshButton}
      >
        Refresh
      </Button>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Card style={styles.errorCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.errorTitle}>
            Failed to load registrations
          </Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            {error?.message || 'Something went wrong'}
          </Text>
          <Button
            mode="contained"
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your registrations...</Text>
      </View>
    );
  }

  if (error) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          My Registrations
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {registrations.length} event{registrations.length !== 1 ? 's' : ''} registered
        </Text>
      </View>

      <FlatList
        data={registrations}
        renderItem={renderRegistration}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 8,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  registrationCard: {
    marginBottom: 16,
    elevation: 2,
  },
  registrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontWeight: '600',
    marginRight: 12,
  },
  attendanceChip: {
    height: 28,
  },
  registrationDate: {
    opacity: 0.7,
    marginBottom: 12,
  },
  feedbackContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedbackText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  feedbackComment: {
    fontStyle: 'italic',
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.6,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 8,
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
  retryButton: {
    alignSelf: 'center',
  },
  snackbar: {
    marginBottom: 16,
  },
});

export default MyRegistrations;
