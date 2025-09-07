import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  Searchbar,
  Menu,
  Divider,
  Surface,
  FAB,
  Badge,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/studentMockData';
import { Event, EventCategory } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';

interface StudentDashboardProps {
  onNavigate?: (screen: string, params?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const { events, categories, registrations, userDashboards } = mockEnhancedData;

  // Get user's dashboard data
  const userDashboard = userDashboards.find(u => u.id === user?.id);
  const userRegistrations = registrations.filter(r => r.userId === user?.id);

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || event.categoryId === selectedCategory;
    
    // Only show published events for students
    const isPublished = event.status === 'published';
    
    return matchesSearch && matchesCategory && isPublished;
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate > now && eventDate <= sevenDaysFromNow;
  });

  // Get trending events (most registered)
  const trendingEvents = [...filteredEvents]
    .sort((a, b) => (b.currentRegistrations || 0) - (a.currentRegistrations || 0))
    .slice(0, 3);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleEventPress = (event: Event) => {
    onNavigate?.('EventDetails', { eventId: event.id });
  };

  const isUserRegistered = (eventId: string) => {
    return userRegistrations.some(reg => reg.eventId === eventId && reg.status === 'confirmed');
  };

  const getEventStatusColor = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    if (eventEnd < now) return theme.colors.outline;
    if (eventStart <= now && eventEnd >= now) return theme.colors.success;
    if ((event.currentRegistrations || 0) >= (event.maxParticipants || Infinity)) return theme.colors.error;
    return theme.colors.primary;
  };

  const getEventStatusText = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    if (eventEnd < now) return 'Completed';
    if (eventStart <= now && eventEnd >= now) return 'Live Now';
    if ((event.currentRegistrations || 0) >= (event.maxParticipants || Infinity)) return 'Full';
    return 'Open';
  };

  const EventCard: React.FC<{ event: Event; compact?: boolean }> = ({ event, compact = false }) => {
    const category = categories.find(c => c.id === event.categoryId);
    const isRegistered = isUserRegistered(event.id);
    const statusColor = getEventStatusColor(event);
    const statusText = getEventStatusText(event);

    return (
      <Card style={[styles.eventCard, compact && styles.compactCard]} onPress={() => handleEventPress(event)}>
        <Card.Cover 
          source={{ uri: event.bannerImageUrl }} 
          style={[styles.eventImage, compact && styles.compactImage]}
        />
        <Card.Content style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <View style={styles.eventTitleContainer}>
              <Text variant={compact ? "titleMedium" : "titleLarge"} style={styles.eventTitle}>
                {event.title}
              </Text>
              {isRegistered && (
                <Badge style={styles.registeredBadge}>Registered</Badge>
              )}
            </View>
            <Chip 
              icon="circle" 
              compact
              style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}
              textStyle={{ color: statusColor }}
            >
              {statusText}
            </Chip>
          </View>

          <Text variant="bodyMedium" style={styles.eventDescription} numberOfLines={compact ? 2 : 3}>
            {event.shortDescription || event.description}
          </Text>

          <View style={styles.eventDetails}>
            <View style={styles.eventDetailItem}>
              <IconButton icon="calendar" size={16} style={styles.detailIcon} />
              <Text variant="bodySmall" style={styles.detailText}>
                {new Date(event.startDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.eventDetailItem}>
              <IconButton icon="map-marker" size={16} style={styles.detailIcon} />
              <Text variant="bodySmall" style={styles.detailText}>
                {event.venue || 'Virtual'}
              </Text>
            </View>

            <View style={styles.eventDetailItem}>
              <IconButton icon="account-group" size={16} style={styles.detailIcon} />
              <Text variant="bodySmall" style={styles.detailText}>
                {event.currentRegistrations}/{event.maxParticipants || '∞'}
              </Text>
            </View>
          </View>

          <View style={styles.eventFooter}>
            <View style={styles.eventTags}>
              {category && (
                <Chip 
                  icon="folder" 
                  compact 
                  style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
                  textStyle={{ color: category.color }}
                >
                  {category.name}
                </Chip>
              )}
              
              {event.tags?.slice(0, 2).map((tag, index) => (
                <Chip key={index} compact style={styles.tagChip}>
                  {tag}
                </Chip>
              ))}
            </View>

            <Button
              mode={isRegistered ? "outlined" : "contained"}
              compact
              onPress={() => handleEventPress(event)}
              icon={isRegistered ? "check" : "plus"}
            >
              {isRegistered ? "Registered" : "Register"}
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Discover amazing events around you
            </Text>
          </View>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              title="My Profile"
              leadingIcon="account"
              onPress={() => {
                onNavigate?.('Profile');
                setMenuVisible(false);
              }}
            />
            <Menu.Item
              title="My Tickets"
              leadingIcon="ticket"
              onPress={() => {
                onNavigate?.('MyTickets');
                setMenuVisible(false);
              }}
            />
            <Menu.Item
              title="Certificates"
              leadingIcon="certificate"
              onPress={() => {
                onNavigate?.('Certificates');
                setMenuVisible(false);
              }}
            />
            <Divider />
            <Menu.Item
              title="Settings"
              leadingIcon="cog"
              onPress={() => {
                onNavigate?.('Settings');
                setMenuVisible(false);
              }}
            />
          </Menu>
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={1}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {userDashboard?.totalRegistrations || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Events Registered
            </Text>
          </Surface>

          <Surface style={styles.statCard} elevation={1}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {userDashboard?.eventsAttended || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Events Attended
            </Text>
          </Surface>

          <Surface style={styles.statCard} elevation={1}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {userDashboard?.certificatesEarned || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Certificates
            </Text>
          </Surface>

          <Surface style={styles.statCard} elevation={1}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {userDashboard?.achievementsEarned || 0}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Achievements
            </Text>
          </Surface>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search events..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            icon="magnify"
            clearIcon="close"
          />

          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter-variant"
                mode="contained-tonal"
                onPress={() => setFilterMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              title="All Categories"
              onPress={() => {
                setSelectedCategory(null);
                setFilterMenuVisible(false);
              }}
            />
            <Divider />
            {categories.map(category => (
              <Menu.Item
                key={category.id}
                title={category.name}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setFilterMenuVisible(false);
                }}
              />
            ))}
          </Menu>
        </View>

        {/* Selected Category */}
        {selectedCategory && (
          <View style={styles.filterChipContainer}>
            <Chip
              icon="filter"
              onClose={() => setSelectedCategory(null)}
              style={styles.filterChip}
            >
              {categories.find(c => c.id === selectedCategory)?.name}
            </Chip>
          </View>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Upcoming This Week
              </Text>
              <Button mode="text" onPress={() => onNavigate?.('EventsList', { filter: 'upcoming' })}>
                View All
              </Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {upcomingEvents.map(event => (
                <View key={event.id} style={styles.horizontalCard}>
                  <EventCard event={event} compact />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Trending Events */}
        {trendingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Trending Events
              </Text>
              <Button mode="text" onPress={() => onNavigate?.('EventsList', { filter: 'trending' })}>
                View All
              </Button>
            </View>
            
            {trendingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {/* All Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              All Events
            </Text>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              {filteredEvents.length} events found
            </Text>
          </View>

          {filteredEvents.length === 0 ? (
            <Surface style={styles.emptyState} elevation={1}>
              <IconButton icon="calendar-search" size={64} style={styles.emptyIcon} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No events found
              </Text>
              <Text variant="bodyMedium" style={styles.emptyMessage}>
                Try adjusting your search or filter criteria
              </Text>
              <Button mode="outlined" onPress={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}>
                Clear Filters
              </Button>
            </Surface>
          ) : (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="qrcode-scan"
        style={styles.fab}
        onPress={() => onNavigate?.('QRScanner')}
        label="Scan QR"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.onBackground,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  statValue: {
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
  },
  filterChipContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterChip: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  sectionSubtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  horizontalScroll: {
    paddingLeft: spacing.md,
  },
  horizontalCard: {
    width: 280,
    marginRight: spacing.md,
  },
  eventCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  compactCard: {
    margin: 0,
  },
  eventImage: {
    height: 120,
  },
  compactImage: {
    height: 80,
  },
  eventContent: {
    padding: spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventTitleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  eventTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  registeredBadge: {
    backgroundColor: theme.colors.success,
    alignSelf: 'flex-start',
  },
  statusChip: {
    height: 28,
  },
  eventDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  eventDetails: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  detailText: {
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTags: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  categoryChip: {
    height: 24,
  },
  tagChip: {
    height: 24,
    backgroundColor: theme.colors.surfaceVariant,
  },
  emptyState: {
    margin: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  bottomPadding: {
    height: 100,
  },
});
