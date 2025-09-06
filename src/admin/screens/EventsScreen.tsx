import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { 
  FAB, 
  Chip, 
  Button, 
  Text, 
  ActivityIndicator, 
  useTheme,
  Snackbar 
} from 'react-native-paper';
import { useEvents, useUpdateEvent } from '../hooks/useAdminQueries';
import { Event } from '../../types/admin';
import AdminHeader from '../components/AdminHeader';
import Table from '../components/Table';
import ConfirmDialog from '../components/ConfirmDialog';
import EventFormModal from './EventFormModal';

// Mock college ID - in real app, this would come from user selection or context
const MOCK_COLLEGE_ID = 'col-1';

const EventsScreen: React.FC = () => {
  const theme = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [cancellingEvent, setCancellingEvent] = useState<Event | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch events data
  const { data: events, isLoading, error } = useEvents(MOCK_COLLEGE_ID);
  const updateEventMutation = useUpdateEvent();

  const handleCancelEvent = async () => {
    if (!cancellingEvent) return;

    try {
      await updateEventMutation.mutateAsync({
        eventId: cancellingEvent.id,
        data: { status: 'cancelled' }
      });
      setSnackbarMessage('Event cancelled successfully');
      setCancellingEvent(null);
    } catch (error) {
      setSnackbarMessage('Failed to cancel event');
    }
  };

  const handleActivateEvent = async (event: Event) => {
    try {
      await updateEventMutation.mutateAsync({
        eventId: event.id,
        data: { status: 'scheduled' }
      });
      setSnackbarMessage('Event activated successfully');
    } catch (error) {
      setSnackbarMessage('Failed to activate event');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return theme.colors.primary;
      case 'cancelled': return theme.colors.error;
      case 'completed': return theme.colors.onSurfaceVariant;
      default: return theme.colors.onSurface;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const columns = [
    { key: 'title', label: 'Event Title', width: 200 },
    { key: 'type', label: 'Type', width: 120 },
    { key: 'start_time', label: 'Start Time', width: 150 },
    { key: 'end_time', label: 'End Time', width: 150 },
    { key: 'location', label: 'Location', width: 150 },
    { key: 'capacity', label: 'Capacity', width: 100 },
    { key: 'status', label: 'Status', width: 120 },
    { key: 'registrations_count', label: 'Registrations', width: 120 },
    { key: 'actions', label: 'Actions', width: 200 },
  ];

  const renderCell = (row: Event, colKey: string) => {
    switch (colKey) {
      case 'start_time':
      case 'end_time':
        return <Text>{formatDate(row[colKey])}</Text>;
      
      case 'status':
        return (
          <Chip 
            mode="outlined"
            textStyle={{ color: getStatusColor(row.status) }}
            style={{ borderColor: getStatusColor(row.status) }}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Chip>
        );
      
      case 'registrations_count':
        return <Text>{row.registrations_count || 0}</Text>;
      
      case 'actions':
        return (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              mode="outlined"
              compact
              onPress={() => {
                // Navigate to event details
                console.log('View event:', row.id);
              }}
            >
              View
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setEditingEvent(row)}
            >
              Edit
            </Button>
            {row.status === 'scheduled' ? (
              <Button
                mode="outlined"
                compact
                buttonColor={theme.colors.errorContainer}
                textColor={theme.colors.error}
                onPress={() => setCancellingEvent(row)}
              >
                Cancel
              </Button>
            ) : row.status === 'cancelled' ? (
              <Button
                mode="outlined"
                compact
                buttonColor={theme.colors.primaryContainer}
                textColor={theme.colors.primary}
                onPress={() => handleActivateEvent(row)}
              >
                Activate
              </Button>
            ) : null}
          </View>
        );
      
      default:
        return <Text>{String((row as any)[colKey] || '')}</Text>;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <AdminHeader title="Events" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Loading events...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <AdminHeader title="Events" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ textAlign: 'center', marginBottom: 16 }}>
            Failed to load events. Please try again.
          </Text>
          <Button mode="contained" onPress={() => window.location.reload()}>
            Retry
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <AdminHeader title="Events" subtitle={`${events?.length || 0} events`} />
      
      <View style={{ flex: 1, padding: 16 }}>
        {events && events.length > 0 ? (
          <Table
            columns={columns}
            data={events}
            renderCell={renderCell}
            pagination={true}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
              No events found
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
              Create your first event to get started with event management.
            </Text>
            <Button 
              mode="contained" 
              icon="calendar-plus"
              onPress={() => setShowCreateModal(true)}
            >
              Create First Event
            </Button>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => setShowCreateModal(true)}
      />

      {/* Create/Edit Event Modal */}
      <EventFormModal
        visible={showCreateModal || !!editingEvent}
        event={editingEvent}
        onDismiss={() => {
          setShowCreateModal(false);
          setEditingEvent(null);
        }}
        onSuccess={(message: string) => {
          setShowCreateModal(false);
          setEditingEvent(null);
          setSnackbarMessage(message);
        }}
      />

      {/* Cancel Event Confirmation */}
      <ConfirmDialog
        visible={!!cancellingEvent}
        title="Cancel Event"
        message={`Are you sure you want to cancel "${cancellingEvent?.title}"? This action can be undone by activating the event again.`}
        confirmLabel="Cancel Event"
        onConfirm={handleCancelEvent}
        onCancel={() => setCancellingEvent(null)}
        dangerous={true}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage('')}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default EventsScreen;
