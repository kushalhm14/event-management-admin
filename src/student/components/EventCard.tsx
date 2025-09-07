import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Card,
  Text,
  Chip,
  Badge,
  useTheme,
} from 'react-native-paper';
import { Event } from '../../types/student';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

/**
 * Event card component for displaying event summary in lists
 */
export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  const getStatusColor = () => {
    switch (event.status) {
      case 'active':
        return theme.colors.primary;
      case 'cancelled':
        return theme.colors.error;
      case 'completed':
        return theme.colors.outline;
      default:
        return theme.colors.outline;
    }
  };

  const getTypeColor = () => {
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

  const getSpotsLeft = () => {
    return event.capacity - event.registered_count;
  };

  const isEventFull = () => {
    return event.registered_count >= event.capacity;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
                {event.title}
              </Text>
              <View style={styles.badges}>
                <Chip
                  mode="outlined"
                  compact
                  style={[styles.typeChip, { borderColor: getTypeColor() }]}
                  textStyle={{ color: getTypeColor(), fontSize: 12 }}
                >
                  {event.type.toUpperCase()}
                </Chip>
                <Badge
                  style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
                  size={8}
                />
              </View>
            </View>
          </View>

          <View style={styles.details}>
            <Text variant="bodySmall" style={styles.date}>
              📅 {formatDate(event.start_time)} at {formatTime(event.start_time)}
            </Text>
            <Text variant="bodySmall" style={styles.location}>
              📍 {event.location}
            </Text>
          </View>

          <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.capacity}>
              {isEventFull() ? (
                <Chip
                  mode="flat"
                  compact
                  style={[styles.capacityChip, { backgroundColor: theme.colors.errorContainer }]}
                  textStyle={{ color: theme.colors.onErrorContainer, fontSize: 12 }}
                >
                  FULL
                </Chip>
              ) : (
                <Chip
                  mode="flat"
                  compact
                  style={[styles.capacityChip, { backgroundColor: theme.colors.primaryContainer }]}
                  textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 12 }}
                >
                  {getSpotsLeft()} spots left
                </Chip>
              )}
            </View>

            <Text variant="labelMedium" style={styles.viewDetails}>
              View Details →
            </Text>
          </View>

          {event.status === 'cancelled' && (
            <View style={styles.cancelledOverlay}>
              <Text style={styles.cancelledText}>CANCELLED</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  content: {
    padding: 16,
    position: 'relative',
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontWeight: '600',
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeChip: {
    height: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  details: {
    marginBottom: 8,
  },
  date: {
    marginBottom: 4,
    opacity: 0.8,
  },
  location: {
    opacity: 0.8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 18,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacity: {
    flex: 1,
  },
  capacityChip: {
    height: 28,
    alignSelf: 'flex-start',
  },
  viewDetails: {
    opacity: 0.7,
    fontWeight: '500',
  },
  cancelledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelledText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default EventCard;
