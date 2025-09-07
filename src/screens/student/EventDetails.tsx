import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  Divider,
  Surface,
  Dialog,
  Portal,
  List,
  Avatar,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/studentMockData';
import { Event, Registration } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';

interface EventDetailsProps {
  eventId: string;
  onNavigate?: (screen: string, params?: any) => void;
  onBack?: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onNavigate, onBack }) => {
  const { user } = useAuth();
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { events, categories, registrations } = mockEnhancedData;
  
  const event = events.find(e => e.id === eventId);
  const category = event ? categories.find(c => c.id === event.categoryId) : null;
  const userRegistration = registrations.find(r => r.eventId === eventId && r.userId === user?.id);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconButton icon="alert-circle" size={64} style={styles.errorIcon} />
          <Text variant="headlineSmall" style={styles.errorTitle}>Event Not Found</Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            The event you're looking for doesn't exist or has been removed.
          </Text>
          <Button mode="contained" onPress={onBack}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const getEventStatusColor = (): string => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    if (eventEnd < now) return theme.colors.outline;
    if (eventStart <= now && eventEnd >= now) return theme.colors.success;
    return theme.colors.primary;
  };

  const getSpotColor = (event: Event): string => {
    const current = event.currentRegistrations || 0;
    const max = event.maxParticipants || Infinity;
    
    if (current >= max) return theme.colors.error;
    return theme.colors.primary;
  };

  const getEventStatusText = () => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    if (eventEnd < now) return 'Completed';
    if (eventStart <= now && eventEnd >= now) return 'Live Now';
    if (event.currentRegistrations && event.maxParticipants && event.currentRegistrations >= event.maxParticipants) return 'Full';
    return 'Open for Registration';
  };

  const canRegister = () => {
    if (userRegistration) return false;
    
    const now = new Date();
    const registrationEnd = new Date(event.registrationEnd || event.startDate);
    
    if (registrationEnd < now) return false;
    if (event.status !== 'published') return false;
    if (event.currentRegistrations && event.maxParticipants && event.currentRegistrations >= event.maxParticipants && !event.waitlistEnabled) return false;
    
    return true;
  };

  const handleRegister = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setShowRegisterDialog(false);
    
    Alert.alert(
      'Registration Successful!',
      'You have been successfully registered for this event. Check your email for confirmation details.',
      [{ text: 'OK' }]
    );
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

  const registrationProgress = event.maxParticipants 
    ? ((event.currentRegistrations || 0) / event.maxParticipants) 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={onBack} />
          <View style={styles.headerActions}>
            <IconButton icon="share-variant" onPress={() => {}} />
            <IconButton icon="bookmark-outline" onPress={() => {}} />
          </View>
        </View>

        {/* Hero Image */}
        <Image source={{ uri: event.bannerImageUrl }} style={styles.heroImage} />

        {/* Event Status Badge */}
        <View style={styles.statusBadgeContainer}>
          <Chip 
            icon="circle" 
            style={[styles.statusBadge, { backgroundColor: getEventStatusColor() }]}
            textStyle={{ color: 'white', fontWeight: 'bold' }}
          >
            {getEventStatusText()}
          </Chip>
        </View>

        <View style={styles.content}>
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <Text variant="headlineMedium" style={styles.title}>
              {event.title}
            </Text>
            
            {category && (
              <Chip 
                icon={category.icon} 
                style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
                textStyle={{ color: category.color }}
              >
                {category.name}
              </Chip>
            )}
          </View>

          {/* Registration Status */}
          {userRegistration && (
            <Surface style={styles.registrationStatusCard} elevation={1}>
              <View style={styles.registrationStatus}>
                <IconButton 
                  icon={userRegistration.status === 'confirmed' ? 'check-circle' : 'clock-outline'} 
                  iconColor={userRegistration.status === 'confirmed' ? theme.colors.success : theme.colors.primary}
                />
                <View style={styles.registrationStatusText}>
                  <Text variant="titleMedium" style={styles.registrationStatusTitle}>
                    {userRegistration.status === 'confirmed' ? 'Registered' : 
                     userRegistration.status === 'waitlisted' ? 'On Waitlist' : 'Pending Approval'}
                  </Text>
                  <Text variant="bodyMedium" style={styles.registrationStatusSubtitle}>
                    {userRegistration.status === 'confirmed' ? 'You are registered for this event' :
                     userRegistration.status === 'waitlisted' ? 'You are on the waitlist' : 
                     'Your registration is pending approval'}
                  </Text>
                </View>
              </View>
            </Surface>
          )}

          {/* Quick Info */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <List.Item
                title={formatDate(event.startDate)}
                description={`${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
                left={() => <List.Icon icon="calendar" />}
              />
              
              <List.Item
                title={event.venue || 'Virtual Event'}
                description={event.locationType === 'virtual' ? 'Online' : 'In-person'}
                left={() => <List.Icon icon={event.locationType === 'virtual' ? 'monitor' : 'map-marker'} />}
              />
              
              <List.Item
                title={`${event.currentRegistrations}/${event.maxParticipants || '∞'} Participants`}
                description={
                  <View style={styles.progressContainer}>
                    <ProgressBar 
                      progress={registrationProgress} 
                      style={styles.progressBar}
                      color={theme.colors.primary}
                    />
                  </View>
                }
                left={() => <List.Icon icon="account-group" />}
              />

              {event.requiresPayment && event.paymentAmount && (
                <List.Item
                  title={`$${event.paymentAmount}`}
                  description="Registration Fee"
                  left={() => <List.Icon icon="currency-usd" />}
                />
              )}
            </Card.Content>
          </Card>

          {/* Description */}
          <Card style={styles.descriptionCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>About This Event</Text>
              <Text variant="bodyLarge" style={styles.description}>
                {event.description}
              </Text>
            </Card.Content>
          </Card>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {event.tags?.map((tag, index) => (
                <Chip key={index} style={styles.tag} compact>
                  {tag}
                </Chip>
              ))}
            </View>
          </View>

          {/* Prerequisites */}
          {event.prerequisites && event.prerequisites.length > 0 && (
            <Card style={styles.requirementsCard}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.sectionTitle}>Requirements</Text>
                {event.prerequisites.map((req, index) => (
                  <List.Item
                    key={index}
                    title={req}
                    left={() => <List.Icon icon="check-circle-outline" />}
                  />
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Register Button */}
          {canRegister() && (
            <View style={styles.registerButtonContainer}>
              <Button
                mode="contained"
                onPress={() => setShowRegisterDialog(true)}
                style={styles.registerButton}
                contentStyle={styles.registerButtonContent}
                icon="plus"
              >
                {(event.currentRegistrations || 0) >= (event.maxParticipants || Infinity) 
                  ? 'Join Waitlist' 
                  : 'Register Now'}
              </Button>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Registration Dialog */}
      <Portal>
        <Dialog visible={showRegisterDialog} onDismiss={() => setShowRegisterDialog(false)}>
          <Dialog.Title>Confirm Registration</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to register for "{event.title}"?
            </Text>
            
            {event.requiresPayment && event.paymentAmount && (
              <Text variant="bodyLarge" style={styles.paymentText}>
                Registration Fee: ${event.paymentAmount}
              </Text>
            )}
            
            {event.requiresApproval && (
              <Text variant="bodySmall" style={styles.approvalText}>
                Note: This event requires approval. You'll be notified once your registration is reviewed.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRegisterDialog(false)}>Cancel</Button>
            <Button 
              mode="contained" 
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerActions: {
    flexDirection: 'row',
  },
  heroImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 200,
    right: spacing.md,
    zIndex: 5,
  },
  statusBadge: {
    elevation: 4,
  },
  content: {
    padding: spacing.md,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: '700',
    color: theme.colors.onBackground,
    marginBottom: spacing.sm,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  registrationStatusCard: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  registrationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  registrationStatusText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  registrationStatusTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  registrationStatusSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  infoCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  descriptionCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  description: {
    lineHeight: 24,
    color: theme.colors.onSurfaceVariant,
  },
  tagsContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  requirementsCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  agendaCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  speakersCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  registerButtonContainer: {
    marginTop: spacing.lg,
  },
  registerButton: {
    borderRadius: 12,
  },
  registerButtonContent: {
    paddingVertical: spacing.sm,
  },
  paymentText: {
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: spacing.md,
  },
  approvalText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});