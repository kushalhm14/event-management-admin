import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {
  Card,
  TextInput,
  Button,
  Text,
  Divider,
  SegmentedButtons,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/auth';
import { theme, spacing, shadows } from '../../theme/theme';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: 'student',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setShowError(true);
        return;
      }
      
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address');
        setShowError(true);
        return;
      }
      
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setShowError(true);
    }
  };

  const roleOptions = [
    {
      value: 'student',
      label: 'Student',
      icon: 'account-school',
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: 'shield-account',
    },
    {
      value: 'organizer',
      label: 'Organizer',
      icon: 'account-tie',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
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
              Welcome Back
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to your account
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text variant="titleSmall" style={styles.roleLabel}>
                  Account Type
                </Text>
                <SegmentedButtons
                  value={formData.role || 'student'}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, role: value as any }))
                  }
                  buttons={roleOptions}
                  style={styles.roleButtons}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Email Input */}
              <TextInput
                label="Email Address"
                value={formData.email}
                onChangeText={(email) =>
                  setFormData(prev => ({ ...prev, email }))
                }
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
                disabled={isLoading}
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(password) =>
                  setFormData(prev => ({ ...prev, password }))
                }
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                disabled={isLoading}
              />

              {/* Demo Credentials */}
              <Card style={styles.demoCard}>
                <Card.Content style={styles.demoContent}>
                  <Text variant="labelMedium" style={styles.demoTitle}>
                    Demo Credentials
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    <Text style={styles.demoRole}>Student:</Text> student@university.edu
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    <Text style={styles.demoRole}>Admin:</Text> admin@university.edu
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    <Text style={styles.demoRole}>Password:</Text> password123
                  </Text>
                </Card.Content>
              </Card>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Forgot Password */}
              <Button
                mode="text"
                onPress={() => onNavigate('ForgotPassword')}
                disabled={isLoading}
                style={styles.forgotButton}
              >
                Forgot Password?
              </Button>
            </Card.Content>
          </Card>

          {/* Sign Up Link */}
          <View style={styles.signupSection}>
            <Text variant="bodyMedium">Don't have an account? </Text>
            <Button
              mode="text"
              onPress={() => onNavigate('Signup')}
              disabled={isLoading}
              compact
            >
              Sign Up
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardAvoid: {
    flex: 1,
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
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.lg,
  },
  roleSection: {
    marginBottom: spacing.md,
  },
  roleLabel: {
    marginBottom: spacing.sm,
    color: theme.colors.onSurfaceVariant,
  },
  roleButtons: {
    marginBottom: spacing.xs,
  },
  divider: {
    marginVertical: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  demoCard: {
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: spacing.lg,
  },
  demoContent: {
    padding: spacing.sm,
  },
  demoTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: theme.colors.primary,
  },
  demoText: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  demoRole: {
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: spacing.sm,
  },
  loginButtonContent: {
    paddingVertical: spacing.xs,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
