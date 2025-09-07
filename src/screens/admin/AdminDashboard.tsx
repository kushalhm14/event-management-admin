import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  ProgressBar,
  Menu,
  Divider,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/mockEnhancedData';
import { EventStatus, EventSummary } from '../../types/database';

export const AdminDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [menuVisible, setMenuVisible] = useState(false);

  const { eventSummaries, analytics, userDashboards } = mockEnhancedData;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Calculate key metrics
  const totalEvents = eventSummaries.length;
  const activeEvents = eventSummaries.filter(e => e.status === 'published').length;
  const totalRegistrations = eventSummaries.reduce((sum, e) => sum + e.totalRegistrations, 0);
  const totalAttendance = eventSummaries.reduce((sum, e) => sum + e.attendanceCount, 0);
  const attendanceRate = totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0;

  // Event status distribution
  const statusCounts = eventSummaries.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {} as Record<EventStatus, number>);

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'published': return theme.colors.success;
      case 'draft': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      case 'completed': return theme.colors.primary;
      default: return theme.colors.outline;
    }
  };

  const getStatusIcon = (status: EventStatus): string => {
    switch (status) {
      case 'published': return 'check-circle';
      case 'draft': return 'file-document-edit';
      case 'cancelled': return 'cancel';
      case 'completed': return 'check-all';
      default: return 'clock';
    }
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
              Admin Dashboard
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Event Management Overview
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
              title="This Week"
              onPress={() => {
                setTimeRange('week');
                setMenuVisible(false);
              }}
            />
            <Menu.Item
              title="This Month"
              onPress={() => {
                setTimeRange('month');
                setMenuVisible(false);
              }}
            />
            <Menu.Item
              title="This Year"
              onPress={() => {
                setTimeRange('year');
                setMenuVisible(false);
              }}
            />
          </Menu>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <Card style={[styles.metricCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content style={styles.metricContent}>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Total Events
              </Text>
              <Text variant="headlineLarge" style={styles.metricValue}>
                {totalEvents}
              </Text>
              <Text variant="bodySmall" style={styles.metricChange}>
                +12% from last month
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.metricCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.metricContent}>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Active Events
              </Text>
              <Text variant="headlineLarge" style={styles.metricValue}>
                {activeEvents}
              </Text>
              <Text variant="bodySmall" style={styles.metricChange}>
                +8% from last month
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.metricCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Card.Content style={styles.metricContent}>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Registrations
              </Text>
              <Text variant="headlineLarge" style={styles.metricValue}>
                {totalRegistrations}
              </Text>
              <Text variant="bodySmall" style={styles.metricChange}>
                +25% from last month
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.metricCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content style={styles.metricContent}>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Attendance Rate
              </Text>
              <Text variant="headlineLarge" style={styles.metricValue}>
                {attendanceRate.toFixed(1)}%
              </Text>
              <ProgressBar 
                progress={attendanceRate / 100} 
                color={theme.colors.success}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Registration Trends */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Registration Trends
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Monthly registration overview
            </Text>
            
            {/* Simple bar representation */}
            <View style={styles.simpleChart}>
              {[
                { month: 'Jan', value: 120, percentage: 60 },
                { month: 'Feb', value: 180, percentage: 90 },
                { month: 'Mar', value: 250, percentage: 100 },
                { month: 'Apr', value: 220, percentage: 88 },
                { month: 'May', value: 190, percentage: 76 },
              ].map((data, index) => (
                <View key={index} style={styles.chartBar}>
                  <Text variant="bodySmall" style={styles.chartValue}>
                    {data.value}
                  </Text>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { height: `${data.percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text variant="labelSmall" style={styles.chartLabel}>
                    {data.month}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Category Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Event Categories
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Distribution of registrations by category
            </Text>
            
            {/* Simple progress bars for categories */}
            <View style={styles.categoryChart}>
              {[
                { name: 'Academic', registrations: 150, color: '#1976D2', percentage: 75 },
                { name: 'Cultural', registrations: 120, color: '#7B1FA2', percentage: 60 },
                { name: 'Technology', registrations: 200, color: '#F57C00', percentage: 100 },
                { name: 'Sports', registrations: 80, color: '#388E3C', percentage: 40 },
                { name: 'Career', registrations: 110, color: '#5D4037', percentage: 55 },
              ].map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text variant="bodyMedium" style={styles.categoryName}>
                      {category.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.categoryValue}>
                      {category.registrations}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={category.percentage / 100}
                    color={category.color}
                    style={styles.categoryProgress}
                  />
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Event Status Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Event Status Overview
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.statusContainer}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <Surface key={status} style={styles.statusItem} elevation={1}>
                  <View style={styles.statusIconContainer}>
                    <IconButton
                      icon={getStatusIcon(status as EventStatus)}
                      iconColor={getStatusColor(status as EventStatus)}
                      size={24}
                    />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text variant="labelLarge" style={styles.statusLabel}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </Text>
                    <Text variant="headlineSmall" style={styles.statusCount}>
                      {count}
                    </Text>
                  </View>
                </Surface>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Events */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Recent Events
              </Text>
              <Button mode="text" onPress={() => {/* Navigate to events */}}>
                View All
              </Button>
            </View>
            <Divider style={styles.divider} />
            
            {eventSummaries.slice(0, 3).map((event, index) => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventInfo}>
                  <Text variant="titleMedium" style={styles.eventTitle}>
                    {event.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.eventSubtitle}>
                    {event.categoryName} • {new Date(event.startDate).toLocaleDateString()}
                  </Text>
                  <View style={styles.eventMetrics}>
                    <Chip 
                      icon="account-group" 
                      compact 
                      style={styles.eventChip}
                    >
                      {event.totalRegistrations} registered
                    </Chip>
                    <Chip 
                      icon={getStatusIcon(event.status)} 
                      compact 
                      style={[styles.eventChip, { backgroundColor: getStatusColor(event.status) + '20' }]}
                    >
                      {event.status}
                    </Chip>
                  </View>
                </View>
                <IconButton
                  icon="chevron-right"
                  onPress={() => {/* Navigate to event details */}}
                />
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Quick Actions
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => {/* Create new event */}}
                style={styles.actionButton}
              >
                Create Event
              </Button>
              
              <Button
                mode="outlined"
                icon="account-multiple"
                onPress={() => {/* Manage users */}}
                style={styles.actionButton}
              >
                Manage Users
              </Button>
              
              <Button
                mode="outlined"
                icon="chart-line"
                onPress={() => {/* View reports */}}
                style={styles.actionButton}
              >
                View Reports
              </Button>
              
              <Button
                mode="outlined"
                icon="cog"
                onPress={() => {/* Settings */}}
                style={styles.actionButton}
              >
                Settings
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  metricContent: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  metricLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  metricChange: {
    color: theme.colors.success,
    fontSize: 12,
  },
  progressBar: {
    marginTop: spacing.xs,
    height: 4,
    borderRadius: 2,
  },
  chartCard: {
    margin: spacing.md,
    ...shadows.md,
  },
  chartTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  chartSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  card: {
    margin: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  divider: {
    marginVertical: spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 12,
    flex: 1,
    minWidth: '47%',
  },
  statusIconContainer: {
    marginRight: spacing.sm,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  statusCount: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline + '20',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  eventSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  eventMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eventChip: {
    height: 28,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
  },
  bottomPadding: {
    height: spacing.xl,
  },
  // Chart styles
  simpleChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  chartValue: {
    marginBottom: spacing.xs,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  barContainer: {
    width: 20,
    height: 80,
    backgroundColor: theme.colors.outline + '20',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  chartLabel: {
    marginTop: spacing.xs,
    color: theme.colors.onSurfaceVariant,
  },
  categoryChart: {
    marginTop: spacing.md,
  },
  categoryItem: {
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  categoryValue: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
  },
});
