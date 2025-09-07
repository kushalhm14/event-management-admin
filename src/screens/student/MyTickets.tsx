import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Share,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  Surface,
  List,
  Avatar,
  Dialog,
  Portal,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/studentMockData';
import { Event, Registration } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';

// Simple QR Code placeholder component
const QRCodePlaceholder: React.FC<{ value: string; size: number }> = ({ value, size }) => (
  <View style={[
    styles.qrPlaceholder, 
    { width: size, height: size }
  ]}>
    <Text style={styles.qrPlaceholderText}>QR</Text>
  </View>
);

interface MyTicketsProps {
  onBack?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
}

export const MyTickets: React.FC<MyTicketsProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const { events, registrations, categories } = mockEnhancedData;
  
  // Get user's registrations
  const userRegistrations = registrations.filter(r => r.userId === user?.id);
  
  // Categorize registrations
  const now = new Date();
  const upcomingRegistrations = userRegistrations.filter(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return event && new Date(event.startDate) > now;
  });
  
  const pastRegistrations = userRegistrations.filter(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return event && new Date(event.endDate) < now;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'waitlisted': return theme.colors.primary;
      case 'pending': return theme.colors.tertiary;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'waitlisted': return 'Waitlisted';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleShareTicket = async (registration: Registration) => {
    const event = events.find(e => e.id === registration.eventId);
    if (!event) return;

    try {
      await Share.share({
        message: `Check out my ticket for ${event.title}!\n\nEvent: ${event.title}\nDate: ${formatDate(event.startDate)}\nVenue: ${event.venue || 'Virtual Event'}`,
        title: `Ticket for ${event.title}`,
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  const TicketCard: React.FC<{ 
    registration: Registration; 
    event: Event; 
    showPastStatus?: boolean 
  }> = ({ registration, event, showPastStatus = false }) => {
    const category = categories.find(c => c.id === event.categoryId);
    const isUpcoming = new Date(event.startDate) > now;
    const hasStarted = new Date(event.startDate) <= now && new Date(event.endDate) > now;
    const hasEnded = new Date(event.endDate) <= now;

    return (
      <Card style={styles.ticketCard} onPress={() => onNavigate?.('EventDetails', { eventId: event.id })}>
        <Card.Content style={styles.ticketContent}>
          {/* Header */}
          <View style={styles.ticketHeader}>
            <View style={styles.ticketInfo}>
              <Text variant="titleLarge" style={styles.eventTitle} numberOfLines={2}>
                {event.title}
              </Text>
              
              <View style={styles.ticketMeta}>
                <Text variant="bodyMedium" style={styles.eventDate}>
                  {formatDate(event.startDate)} • {formatTime(event.startDate)}
                </Text>
                
                <View style={styles.statusContainer}>
                  <Chip 
                    icon="circle" 
                    compact
                    style={[styles.statusChip, { backgroundColor: getStatusColor(registration.status) + '20' }]}
                    textStyle={{ color: getStatusColor(registration.status) }}
                  >
                    {getStatusText(registration.status)}
                  </Chip>
                  
                  {hasStarted && (
                    <Chip 
                      icon="broadcast" 
                      compact
                      style={[styles.statusChip, { backgroundColor: theme.colors.success + '20' }]}
                      textStyle={{ color: theme.colors.success }}
                    >
                      Live Now
                    </Chip>
                  )}
                  
                  {hasEnded && registration.checkedIn && (
                    <Chip 
                      icon="check-circle" 
                      compact
                      style={[styles.statusChip, { backgroundColor: theme.colors.primary + '20' }]}
                      textStyle={{ color: theme.colors.primary }}
                    >
                      Attended
                    </Chip>
                  )}
                </View>
              </View>
            </View>

            <IconButton
              icon="dots-vertical"
              onPress={() => handleShareTicket(registration)}
            />
          </View>

          {/* Event Details */}
          <View style={styles.eventDetails}>
            <List.Item
              title={event.venue || 'Virtual Event'}
              description={event.locationType === 'virtual' ? 'Online' : 'In-person'}
              left={() => <List.Icon icon={event.locationType === 'virtual' ? 'monitor' : 'map-marker'} />}
              style={styles.eventDetailItem}
            />

            {category && (
              <List.Item
                title={category.name}
                description="Category"
                left={() => <List.Icon icon={category.icon || 'folder'} />}
                style={styles.eventDetailItem}
              />
            )}

            {registration.paymentAmount && (
              <List.Item
                title={`$${registration.paymentAmount}`}
                description="Registration Fee"
                left={() => <List.Icon icon="currency-usd" />}
                style={styles.eventDetailItem}
              />
            )}
          </View>

          {/* QR Code Section */}
          {registration.status === 'confirmed' && isUpcoming && (
            <Surface style={styles.qrSection} elevation={1}>
              <View style={styles.qrHeader}>
                <Text variant="titleMedium" style={styles.qrTitle}>
                  Your Ticket
                </Text>
                <Button
                  mode="text"
                  compact
                  onPress={() => setSelectedTicket(registration.id)}
                >
                  View QR
                </Button>
              </View>
              
              <View style={styles.qrPreview}>
                <QRCodePlaceholder
                  value={`EVENT:${event.id}:USER:${user?.id}:REG:${registration.id}`}
                  size={60}
                />
                <Text variant="bodySmall" style={styles.qrInstructions}>
                  Show this QR code at the event entrance
                </Text>
              </View>
            </Surface>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => onNavigate?.('EventDetails', { eventId: event.id })}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              View Event
            </Button>

            {registration.status === 'confirmed' && isUpcoming && (
              <Button
                mode="contained"
                onPress={() => setSelectedTicket(registration.id)}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                icon="qrcode"
              >
                Show QR
              </Button>
            )}

            {registration.status === 'waitlisted' && (
              <Button
                mode="text"
                onPress={() => {}}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                icon="clock-outline"
              >
                Waitlisted
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const QRDialog: React.FC = () => {
    const registration = userRegistrations.find(r => r.id === selectedTicket);
    const event = registration ? events.find(e => e.id === registration.eventId) : null;

    if (!registration || !event) return null;

    return (
      <Dialog 
        visible={!!selectedTicket} 
        onDismiss={() => setSelectedTicket(null)}
        style={styles.qrDialog}
      >
        <Dialog.Title>Event Ticket</Dialog.Title>
        <Dialog.Content style={styles.qrDialogContent}>
          <Text variant="titleMedium" style={styles.qrDialogTitle}>
            {event.title}
          </Text>
          <Text variant="bodyMedium" style={styles.qrDialogDate}>
            {formatDate(event.startDate)} • {formatTime(event.startDate)}
          </Text>

          <View style={styles.qrCodeContainer}>
            <QRCodePlaceholder
              value={`EVENT:${event.id}:USER:${user?.id}:REG:${registration.id}`}
              size={200}
            />
          </View>

          <Text variant="bodySmall" style={styles.qrDialogInstructions}>
            Present this QR code at the event entrance for check-in
          </Text>

          <View style={styles.ticketInfoContainer}>
            <Text variant="bodySmall" style={styles.ticketNumber}>
              Ticket #{registration.id.toUpperCase()}
            </Text>
            <Text variant="bodySmall" style={styles.ticketHolder}>
              {user?.name}
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => handleShareTicket(registration)}>Share</Button>
          <Button mode="contained" onPress={() => setSelectedTicket(null)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>My Tickets</Text>
        <IconButton icon="refresh" onPress={() => {}} />
      </View>

      {/* Tab Selector */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          {
            value: 'upcoming',
            label: `Upcoming (${upcomingRegistrations.length})`,
          },
          {
            value: 'past',
            label: `Past (${pastRegistrations.length})`,
          },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' && (
          <View style={styles.tabContent}>
            {upcomingRegistrations.length === 0 ? (
              <Surface style={styles.emptyState} elevation={1}>
                <IconButton icon="ticket-outline" size={64} style={styles.emptyIcon} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No Upcoming Events
                </Text>
                <Text variant="bodyMedium" style={styles.emptyMessage}>
                  You don't have any upcoming events. Browse and register for events to see them here.
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => onNavigate?.('StudentDashboard')}
                  style={styles.emptyButton}
                >
                  Browse Events
                </Button>
              </Surface>
            ) : (
              upcomingRegistrations.map(registration => {
                const event = events.find(e => e.id === registration.eventId);
                return event ? (
                  <TicketCard 
                    key={registration.id} 
                    registration={registration} 
                    event={event} 
                  />
                ) : null;
              })
            )}
          </View>
        )}

        {activeTab === 'past' && (
          <View style={styles.tabContent}>
            {pastRegistrations.length === 0 ? (
              <Surface style={styles.emptyState} elevation={1}>
                <IconButton icon="history" size={64} style={styles.emptyIcon} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No Past Events
                </Text>
                <Text variant="bodyMedium" style={styles.emptyMessage}>
                  Your attended events will appear here after they're completed.
                </Text>
              </Surface>
            ) : (
              pastRegistrations.map(registration => {
                const event = events.find(e => e.id === registration.eventId);
                return event ? (
                  <TicketCard 
                    key={registration.id} 
                    registration={registration} 
                    event={event} 
                    showPastStatus
                  />
                ) : null;
              })
            )}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* QR Dialog */}
      <Portal>
        <QRDialog />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  headerTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  tabs: {
    backgroundColor: theme.colors.surface,
  },
  segmentedButtons: {
    margin: spacing.md,
  },
  qrPlaceholder: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderStyle: 'dashed',
  },
  qrPlaceholderText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.md,
  },
  ticketCard: {
    marginBottom: spacing.md,
    ...shadows.md,
  },
  ticketContent: {
    padding: spacing.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  ticketInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  eventTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  ticketMeta: {
    gap: spacing.sm,
  },
  eventDate: {
    color: theme.colors.onSurfaceVariant,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statusChip: {
    height: 24,
  },
  eventDetails: {
    marginBottom: spacing.md,
  },
  eventDetailItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
  },
  qrSection: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  qrTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  qrPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qrInstructions: {
    flex: 1,
    color: theme.colors.onSurfaceVariant,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: spacing.xs,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    borderRadius: 12,
  },
  qrDialog: {
    marginHorizontal: spacing.lg,
  },
  qrDialogContent: {
    alignItems: 'center',
  },
  qrDialogTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  qrDialogDate: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  qrCodeContainer: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: spacing.md,
    elevation: 2,
  },
  qrDialogInstructions: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ticketInfoContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  ticketNumber: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  ticketHolder: {
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
