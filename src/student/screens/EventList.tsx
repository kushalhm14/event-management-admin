import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Searchbar,
  ActivityIndicator,
  Card,
  Button,
  Snackbar,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { EventCard } from '../components/EventCard';
import { studentApi } from '../../services/studentApi';
import { Event } from '../../types/student';

interface EventListProps {
  onEventPress: (eventId: string) => void;
}

/**
 * Event list screen with search functionality
 */
export const EventList: React.FC<EventListProps> = ({ onEventPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch events using React Query
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Event[], Error>({
    queryKey: ['events'],
    queryFn: studentApi.fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Filter events based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events || []);
      return;
    }

    const filtered = (events || []).filter((event: Event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredEvents(filtered);
  }, [events, searchQuery]);

  const handleEventPress = (event: Event) => {
    onEventPress(event.id);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      showSnackbar('Events refreshed');
    } catch (error) {
      showSnackbar('Failed to refresh events');
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item)}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          {searchQuery ? 'No events found' : 'No events available'}
        </Text>
        <Text variant="bodyMedium" style={styles.emptyMessage}>
          {searchQuery
            ? 'Try adjusting your search terms'
            : 'Check back later for new events'}
        </Text>
        {!searchQuery && (
          <Button
            mode="outlined"
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            Refresh
          </Button>
        )}
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Card style={styles.errorCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.errorTitle}>
            Failed to load events
          </Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            {error instanceof Error ? error.message : 'Something went wrong'}
          </Text>
          <Button
            mode="contained"
            onPress={handleRefresh}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  if (error && !(events || []).length) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Events
        </Text>
        <Searchbar
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      {isLoading && !(events || []).length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
        />
      )}

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
    marginBottom: 16,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
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

export default EventList;
