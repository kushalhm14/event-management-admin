import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  Card,
  TextInput,
  Button,
  Text,
  Snackbar,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as authApi from '../../services/authApi';
import { theme, spacing, shadows } from '../../theme/theme';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendReset = async () => {
    try {
      setError('');
      
      if (!email.trim()) {
        setError('Please enter your email address');
        setShowError(true);
        return;
      }
      
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setShowError(true);
        return;
      }
      
      setIsLoading(true);
      await authApi.forgotPassword({ email });
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&h=120&fit=crop&crop=center',
            }}
            style={styles.logo}
          />
          <Text variant="headlineMedium" style={styles.title}>
            {emailSent ? 'Check Your Email' : 'Forgot Password?'}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {emailSent 
              ? 'We\'ve sent password reset instructions to your email'
              : 'Enter your email to receive reset instructions'
            }
          </Text>
        </View>

        {/* Content Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {emailSent ? (
              // Success State
              <View style={styles.successContent}>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>📧</Text>
                </View>
                
                <Text variant="bodyLarge" style={styles.successText}>
                  Password reset instructions have been sent to:
                </Text>
                
                <Text variant="titleMedium" style={styles.emailText}>
                  {email}
                </Text>
                
                <Text variant="bodyMedium" style={styles.instructionText}>
                  Please check your email (including spam folder) and follow the instructions to reset your password.
                </Text>
                
                <Button
                  mode="outlined"
                  onPress={handleTryAgain}
                  style={styles.tryAgainButton}
                >
                  Send to Different Email
                </Button>
              </View>
            ) : (
              // Form State
              <View style={styles.formContent}>
                <TextInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                  disabled={isLoading}
                  error={!!error && !showError}
                />
                
                <HelperText type="info" visible={true}>
                  Enter the email address associated with your account
                </HelperText>

                <Button
                  mode="contained"
                  onPress={handleSendReset}
                  disabled={isLoading || !email.trim()}
                  style={styles.sendButton}
                  contentStyle={styles.sendButtonContent}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                  ) : (
                    'Send Reset Instructions'
                  )}
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Back to Login */}
        <View style={styles.backSection}>
          <Button
            mode="text"
            onPress={() => onNavigate('Login')}
            disabled={isLoading}
            icon="arrow-left"
          >
            Back to Login
          </Button>
        </View>
      </ScrollView>

      {/* Error Snackbar */}
      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: () => setShowError(false),
        }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.lg,
  },
  formContent: {
    alignItems: 'stretch',
  },
  input: {
    marginBottom: spacing.xs,
  },
  sendButton: {
    marginTop: spacing.lg,
  },
  sendButtonContent: {
    paddingVertical: spacing.xs,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successIconText: {
    fontSize: 32,
  },
  successText: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: theme.colors.onSurfaceVariant,
  },
  emailText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  tryAgainButton: {
    marginTop: spacing.md,
  },
  backSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
