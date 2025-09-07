import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RatingStars } from '../components/RatingStars';
import { studentApi } from '../../services/studentApi';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { Registration } from '../../types/student';

interface FeedbackScreenProps {
  registrationId: string;
  onBack: () => void;
}

/**
 * Feedback submission screen with rating and comment
 */
export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  registrationId,
  onBack,
}) => {
  const { studentId } = useStudentAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Fetch registration details
  const {
    data: registrations = [],
    isLoading: isLoadingRegistration,
  } = useQuery<Registration[]>({
    queryKey: ['my-registrations', studentId],
    queryFn: () => studentApi.fetchStudentRegistrations(studentId!),
    enabled: !!studentId,
  });

  const registration = registrations.find(reg => reg.id === registrationId);

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: () => studentApi.submitFeedback(registrationId, { rating, comment: comment.trim() || undefined }),
    onSuccess: () => {
      // Invalidate registrations query to refresh data
      queryClient.invalidateQueries({ queryKey: ['my-registrations', studentId] });
      
      setSnackbarVisible(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    },
    onError: (error: any) => {
      let message = 'Failed to submit feedback';
      
      if (error.code === 409) {
        message = 'Feedback has already been submitted for this event';
      } else if (error.message) {
        message = error.message;
      }
      
      Alert.alert('Submission Failed', message);
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting');
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert('Invalid Rating', 'Rating must be between 1 and 5 stars');
      return;
    }

    Alert.alert(
      'Submit Feedback',
      `Submit your ${rating}-star rating${comment.trim() ? ' and comment' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => submitFeedbackMutation.mutate() },
      ]
    );
  };

  if (isLoadingRegistration) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading registration details...</Text>
      </View>
    );
  }

  if (!registration) {
    return (
      <View style={styles.errorContainer}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorTitle}>
              Registration not found
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              The registration you're trying to provide feedback for doesn't exist.
            </Text>
            <Button mode="contained" onPress={onBack} style={styles.backButton}>
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (registration.feedback) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Feedback Already Submitted
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
              You have already submitted feedback for "{registration.event_title}".
            </Text>
            
            <View style={styles.existingFeedback}>
              <Text variant="titleMedium" style={styles.feedbackTitle}>
                Your Feedback:
              </Text>
              <Text variant="bodyLarge" style={styles.existingRating}>
                ⭐ {registration.feedback.rating} / 5 stars
              </Text>
              {registration.feedback.comment && (
                <Text variant="bodyMedium" style={styles.existingComment}>
                  "{registration.feedback.comment}"
                </Text>
              )}
              <Text variant="bodySmall" style={styles.submittedDate}>
                Submitted on {new Date(registration.feedback.submitted_at).toLocaleDateString()}
              </Text>
            </View>

            <Button mode="contained" onPress={onBack} style={styles.backButton}>
              Back to Registrations
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Event Feedback
            </Text>
            <Text variant="bodyMedium" style={styles.eventTitle}>
              {registration.event_title}
            </Text>

            <View style={styles.ratingSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                How would you rate this event? *
              </Text>
              <RatingStars
                rating={rating}
                onRatingChange={setRating}
                size={40}
              />
            </View>

            <View style={styles.commentSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Additional Comments (Optional)
              </Text>
              <TextInput
                mode="outlined"
                label="Your feedback"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                placeholder="Tell us what you liked or how we can improve..."
                style={styles.commentInput}
                disabled={submitFeedbackMutation.isPending}
              />
            </View>

            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={onBack}
                style={styles.cancelButton}
                disabled={submitFeedbackMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                loading={submitFeedbackMutation.isPending}
                disabled={submitFeedbackMutation.isPending || rating === 0}
              >
                {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
      >
        Feedback submitted successfully! Thank you for your input.
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
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  ratingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    minHeight: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
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
    marginTop: 16,
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  existingFeedback: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  feedbackTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  existingRating: {
    marginBottom: 8,
    fontWeight: '500',
  },
  existingComment: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  submittedDate: {
    opacity: 0.6,
  },
  snackbar: {
    marginBottom: 16,
  },
});

export default FeedbackScreen;
