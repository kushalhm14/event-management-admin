import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, IconButton } from 'react-native-paper';
import { theme, spacing } from '../theme/theme';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // In production, you would log this to your error reporting service
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <View style={styles.container}>
    <Surface style={styles.errorCard} elevation={3}>
      <IconButton 
        icon="alert-circle-outline" 
        size={64} 
        iconColor={theme.colors.error}
        style={styles.errorIcon}
      />
      
      <Text variant="headlineSmall" style={styles.title}>
        Oops! Something went wrong
      </Text>
      
      <Text variant="bodyMedium" style={styles.message}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </Text>
      
      <Button
        mode="contained"
        onPress={resetError}
        style={styles.retryButton}
        icon="refresh"
      >
        Try Again
      </Button>
      
      <Button
        mode="text"
        onPress={() => {
          // In production, this could navigate to home or contact support
          console.log('Full error:', error);
        }}
        style={styles.detailsButton}
      >
        Report Issue
      </Button>
    </Surface>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorCard: {
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  errorIcon: {
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  retryButton: {
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  detailsButton: {
    borderRadius: 8,
  },
});
