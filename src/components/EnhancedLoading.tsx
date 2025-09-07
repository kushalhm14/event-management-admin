import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ActivityIndicator, Text, Surface } from 'react-native-paper';
import { theme, spacing } from '../theme/theme';

interface EnhancedLoadingProps {
  message?: string;
  size?: 'small' | 'large';
  showMessage?: boolean;
  overlay?: boolean;
  style?: any;
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  message = 'Loading...',
  size = 'large',
  showMessage = true,
  overlay = false,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const containerStyle = overlay ? styles.overlayContainer : styles.container;

  return (
    <Animated.View 
      style={[
        containerStyle,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      <Surface style={styles.loadingCard} elevation={overlay ? 5 : 2}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {showMessage && (
          <Text variant="bodyMedium" style={styles.message}>
            {message}
          </Text>
        )}
      </Surface>
    </Animated.View>
  );
};

interface SkeletonLoadingProps {
  lines?: number;
  showAvatar?: boolean;
  style?: any;
}

export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  lines = 3,
  showAvatar = false,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.skeletonContainer, style]}>
      <View style={styles.skeletonRow}>
        {showAvatar && (
          <Animated.View style={[styles.skeletonAvatar, { opacity }]} />
        )}
        <View style={styles.skeletonContent}>
          {Array.from({ length: lines }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.skeletonLine,
                {
                  opacity,
                  width: index === lines - 1 ? '70%' : '100%',
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

interface PullToRefreshLoadingProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const PullToRefreshLoading: React.FC<PullToRefreshLoadingProps> = ({
  isRefreshing,
  onRefresh,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isRefreshing]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.refreshContainer}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  loadingCard: {
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  message: {
    marginTop: spacing.md,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  skeletonContainer: {
    padding: spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    marginRight: spacing.md,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  refreshContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
});
