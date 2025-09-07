import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  Surface,
  List,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/studentMockData';
import { Event, Registration } from '../../types/database';

interface EventManagementProps {
  onBack?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
}

interface EventDraft {
  id?: string;
  title: string;
  description: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'cancelled';
  capacity: number;
  waitlistCapacity: number;
  approvalRequired: boolean;
  tags: string[];
}

export const EventManagement: React.FC<EventManagementProps> = ({ onBack, onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCapacityDialog, setShowCapacityDialog] = useState(false);
  const [newCapacity, setNewCapacity] = useState('');
  const [eventDraft, setEventDraft] = useState<EventDraft>({
    title: '',
    description: '',
    status: 'draft',
    capacity: 100,
    waitlistCapacity: 50,
    approvalRequired: false,
    tags: [],
  });

  const { events, registrations } = mockEnhancedData;

  // Calculate event statistics
  const getEventStats = (event: Event) => {
    const eventRegistrations = registrations.filter(r => r.eventId === event.id);
    const confirmedCount = eventRegistrations.filter(r => r.status === 'confirmed').length;
    const pendingCount = eventRegistrations.filter(r => r.status === 'pending').length;
    const waitlistCount = eventRegistrations.filter(r => r.status === 'waitlisted').length;
    const checkedInCount = eventRegistrations.filter(r => r.status === 'confirmed').length; // Simplified for now
    
    const eventCapacity = (event as any).capacity || 100; // Type assertion for capacity
    
    return {
      totalRegistrations: eventRegistrations.length,
      confirmed: confirmedCount,
      pending: pendingCount,
      waitlisted: waitlistCount,
      checkedIn: checkedInCount,
      capacity: eventCapacity,
      occupancyRate: ((confirmedCount / eventCapacity) * 100).toFixed(1),
    };
  };

  // Filter events based on selected filter
  const filteredEvents = events.filter(event => {
    switch (selectedFilter) {
      case 'draft':
        return event.status === 'draft';
      case 'pending':
        return event.status === 'pending_approval';
      case 'published':
        return event.status === 'published';
      case 'past':
        return new Date(event.endDate) < new Date();
      default:
        return true;
    }
  });

  const handleEventStatusChange = (event: Event, newStatus: string) => {
    Alert.alert(
      'Update Event Status',
      `Change "${event.title}" status to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `Event status updated to "${newStatus}"`);
          }
        },
      ]
    );
  };

  const handleCapacityUpdate = (event: Event) => {
    setSelectedEvent(event);
    setNewCapacity(String((event as any).capacity || 100));
    setShowCapacityDialog(true);
  };

  const handleWaitlistApproval = (event: Event) => {
    const stats = getEventStats(event);
    if (stats.waitlisted > 0) {
      Alert.alert(
        'Process Waitlist',
        `${stats.waitlisted} people are on the waitlist. How many would you like to approve?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Approve All', 
            onPress: () => Alert.alert('Success', `${stats.waitlisted} registrations approved from waitlist`)
          },
          { 
            text: 'Select Amount', 
            onPress: () => Alert.alert('Feature', 'Selective approval feature coming soon')
          },
        ]
      );
    } else {
      Alert.alert('No Waitlist', 'No pending waitlist registrations for this event');
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const stats = getEventStats(event);
    const isUpcoming = new Date(event.startDate) > new Date();
    const isPast = new Date(event.endDate) < new Date();
    
    return (
      <Card style={styles.eventCard} onPress={() => setSelectedEvent(event)}>
        <Card.Content style={styles.eventContent}>
          {/* Header */}
          <View style={styles.eventHeader}>
            <View style={styles.eventInfo}>
              <Text variant="titleMedium" style={styles.eventTitle}>
                {event.title}
              </Text>
              
              <Text variant="bodySmall" style={styles.eventDate}>
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </Text>
            </View>

            <IconButton
              icon="dots-vertical"
              onPress={() => {
                Alert.alert(
                  'Event Actions',
                  'What would you like to do?',
                  [
                    { text: 'Edit Details', onPress: () => setShowEventDialog(true) },
                    { text: 'Manage Capacity', onPress: () => handleCapacityUpdate(event) },
                    { text: 'Process Waitlist', onPress: () => handleWaitlistApproval(event) },
                    { text: 'View Analytics', onPress: () => Alert.alert('Coming Soon', 'Analytics feature') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
          </View>

          {/* Status and Category */}
          <View style={styles.statusContainer}>
            <Chip 
              icon={event.status === 'published' ? 'check-circle' : 'clock-outline'}
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(event.status) + '20' }
              ]}
              textStyle={{ color: getStatusColor(event.status) }}
            >
              {event.status?.replace('_', ' ').toUpperCase() || 'DRAFT'}
            </Chip>
            
            <Chip 
              icon="tag" 
              style={styles.categoryChip}
              textStyle={styles.categoryText}
            >
              {event.categoryId}
            </Chip>
          </View>

          {/* Capacity Progress */}
          <View style={styles.capacityContainer}>
            <View style={styles.capacityHeader}>
              <Text variant="bodySmall" style={styles.capacityLabel}>
                Capacity: {stats.confirmed}/{stats.capacity}
              </Text>
              <Text variant="bodySmall" style={styles.occupancyRate}>
                {stats.occupancyRate}% full
              </Text>
            </View>
            
            <ProgressBar 
              progress={stats.confirmed / stats.capacity} 
              style={styles.progressBar}
              color={
                Number(stats.occupancyRate) > 90 ? theme.colors.error :
                Number(stats.occupancyRate) > 70 ? theme.colors.warning :
                theme.colors.success
              }
            />
          </View>

          {/* Registration Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Confirmed</Text>
              <Text variant="titleSmall" style={styles.statValue}>{stats.confirmed}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Pending</Text>
              <Text variant="titleSmall" style={styles.statValue}>{stats.pending}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Waitlisted</Text>
              <Text variant="titleSmall" style={styles.statValue}>{stats.waitlisted}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Checked In</Text>
              <Text variant="titleSmall" style={styles.statValue}>{stats.checkedIn}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {event.status === 'draft' && (
              <Button 
                mode="outlined" 
                onPress={() => handleEventStatusChange(event, 'pending_approval')}
                style={styles.actionButton}
                icon="send"
              >
                Submit for Approval
              </Button>
            )}
            
            {event.status === 'pending_approval' && (
              <>
                <Button 
                  mode="contained" 
                  onPress={() => handleEventStatusChange(event, 'approved')}
                  style={styles.actionButton}
                  icon="check"
                >
                  Approve
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => handleEventStatusChange(event, 'draft')}
                  style={styles.actionButton}
                  icon="pencil"
                >
                  Request Changes
                </Button>
              </>
            )}
            
            {(event.status as string) === 'approved' && (
              <Button 
                mode="contained" 
                onPress={() => handleEventStatusChange(event, 'published')}
                style={styles.actionButton}
                icon="publish"
              >
                Publish
              </Button>
            )}
            
            {event.status === 'published' && isUpcoming && (
              <Button 
                mode="outlined" 
                onPress={() => handleEventStatusChange(event, 'cancelled')}
                style={styles.actionButton}
                icon="cancel"
              >
                Cancel Event
              </Button>
            )}
            
            {stats.waitlisted > 0 && (
              <Button 
                mode="text" 
                onPress={() => handleWaitlistApproval(event)}
                style={styles.actionButton}
                icon="account-plus"
              >
                Process Waitlist ({stats.waitlisted})
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published': return theme.colors.success;
      case 'approved': return theme.colors.primary;
      case 'pending_approval': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  // Capacity Management Dialog
  const CapacityDialog: React.FC = () => (
    <Dialog visible={showCapacityDialog} onDismiss={() => setShowCapacityDialog(false)}>
      <Dialog.Title>Manage Event Capacity</Dialog.Title>
      <Dialog.Content>
        {selectedEvent && (
          <View>
            <Text variant="bodyMedium" style={styles.dialogText}>
              Current capacity: {(selectedEvent as any).capacity || 100}
            </Text>
            
            <TextInput
              label="New Capacity"
              value={newCapacity}
              onChangeText={setNewCapacity}
              keyboardType="numeric"
              style={styles.capacityInput}
            />
            
            <Text variant="bodySmall" style={styles.warningText}>
              Note: Reducing capacity below current registrations will move excess registrations to waitlist.
            </Text>
          </View>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setShowCapacityDialog(false)}>Cancel</Button>
        <Button 
          mode="contained" 
          onPress={() => {
            Alert.alert('Success', `Event capacity updated to ${newCapacity}`);
            setShowCapacityDialog(false);
          }}
        >
          Update
        </Button>
      </Dialog.Actions>
    </Dialog>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>Event Management</Text>
        <IconButton 
          icon="plus" 
          onPress={() => {
            setEventDraft({
              title: '',
              description: '',
              status: 'draft',
              capacity: 100,
              waitlistCapacity: 50,
              approvalRequired: false,
              tags: [],
            });
            setShowEventDialog(true);
          }} 
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'draft', label: 'Draft' },
            { value: 'pending', label: 'Pending' },
            { value: 'published', label: 'Live' },
            { value: 'past', label: 'Past' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <Surface style={styles.emptyState} elevation={1}>
            <IconButton icon="calendar-outline" size={64} style={styles.emptyIcon} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Events Found
            </Text>
            <Text variant="bodyMedium" style={styles.emptyMessage}>
              {selectedFilter === 'all' 
                ? 'Create your first event to get started.'
                : `No events found with status "${selectedFilter}".`
              }
            </Text>
            <Button 
              mode="contained" 
              onPress={() => setShowEventDialog(true)}
              style={styles.emptyButton}
            >
              Create Event
            </Button>
          </Surface>
        ) : (
          <View style={styles.eventsList}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {selectedFilter === 'all' ? 'All Events' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Events`} ({filteredEvents.length})
            </Text>
            
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Dialogs */}
      <Portal>
        <CapacityDialog />
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
  filterContainer: {
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  content: {
    flex: 1,
  },
  eventsList: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  eventCard: {
    marginBottom: spacing.md,
    ...shadows.md,
  },
  eventContent: {
    padding: spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  eventDate: {
    color: theme.colors.onSurfaceVariant,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusChip: {
    borderRadius: 16,
  },
  categoryChip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  categoryText: {
    color: theme.colors.onSurfaceVariant,
  },
  capacityContainer: {
    marginBottom: spacing.md,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  capacityLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  occupancyRate: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    borderRadius: 8,
  },
  emptyState: {
    margin: spacing.md,
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
  dialogText: {
    marginBottom: spacing.md,
    color: theme.colors.onSurface,
  },
  capacityInput: {
    marginBottom: spacing.md,
  },
  warningText: {
    color: theme.colors.warning,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
