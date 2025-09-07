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
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SignupCredentials } from '../../types/auth';
import { theme, spacing, shadows } from '../../theme/theme';

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    course: '',
    year: new Date().getFullYear(),
    department: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Role-specific validation
    if (formData.role === 'student') {
      if (!formData.studentId?.trim()) {
        newErrors.studentId = 'Student ID is required';
      }
      if (!formData.course?.trim()) {
        newErrors.course = 'Course is required';
      }
      if (!formData.year || formData.year < 2020 || formData.year > 2030) {
        newErrors.year = 'Please enter a valid year';
      }
    } else {
      if (!formData.department?.trim()) {
        newErrors.department = 'Department is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    try {
      setGlobalError('');
      
      if (!validateForm()) {
        return;
      }
      
      await signup(formData);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
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

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

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
              Create Account
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Join our event management platform
            </Text>
          </View>

          {/* Signup Form */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text variant="titleSmall" style={styles.roleLabel}>
                  Account Type
                </Text>
                <SegmentedButtons
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, role: value as any }))
                  }
                  buttons={roleOptions}
                  style={styles.roleButtons}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Basic Information */}
              <TextInput
                label="Full Name"
                value={formData.name}
                onChangeText={(name) =>
                  setFormData(prev => ({ ...prev, name }))
                }
                mode="outlined"
                autoCapitalize="words"
                autoComplete="name"
                left={<TextInput.Icon icon="account" />}
                style={styles.input}
                disabled={isLoading}
                error={!!errors.name}
              />
              {errors.name && (
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name}
                </HelperText>
              )}

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
                error={!!errors.email}
              />
              {errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>
              )}

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(password) =>
                  setFormData(prev => ({ ...prev, password }))
                }
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                disabled={isLoading}
                error={!!errors.password}
              />
              {errors.password && (
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password}
                </HelperText>
              )}

              <TextInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) =>
                  setFormData(prev => ({ ...prev, confirmPassword }))
                }
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
                disabled={isLoading}
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>
              )}

              <Divider style={styles.divider} />

              {/* Role-specific fields */}
              {formData.role === 'student' ? (
                <>
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Student Information
                  </Text>
                  
                  <TextInput
                    label="Student ID"
                    value={formData.studentId}
                    onChangeText={(studentId) =>
                      setFormData(prev => ({ ...prev, studentId }))
                    }
                    mode="outlined"
                    autoCapitalize="characters"
                    left={<TextInput.Icon icon="card-account-details" />}
                    style={styles.input}
                    disabled={isLoading}
                    error={!!errors.studentId}
                  />
                  {errors.studentId && (
                    <HelperText type="error" visible={!!errors.studentId}>
                      {errors.studentId}
                    </HelperText>
                  )}

                  <TextInput
                    label="Course/Program"
                    value={formData.course}
                    onChangeText={(course) =>
                      setFormData(prev => ({ ...prev, course }))
                    }
                    mode="outlined"
                    autoCapitalize="words"
                    left={<TextInput.Icon icon="school" />}
                    style={styles.input}
                    disabled={isLoading}
                    error={!!errors.course}
                  />
                  {errors.course && (
                    <HelperText type="error" visible={!!errors.course}>
                      {errors.course}
                    </HelperText>
                  )}

                  <TextInput
                    label="Year"
                    value={formData.year?.toString()}
                    onChangeText={(year) =>
                      setFormData(prev => ({ ...prev, year: parseInt(year) || currentYear }))
                    }
                    mode="outlined"
                    keyboardType="numeric"
                    left={<TextInput.Icon icon="calendar" />}
                    style={styles.input}
                    disabled={isLoading}
                    error={!!errors.year}
                  />
                  {errors.year && (
                    <HelperText type="error" visible={!!errors.year}>
                      {errors.year}
                    </HelperText>
                  )}
                </>
              ) : (
                <>
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    {formData.role === 'admin' ? 'Administrator' : 'Organizer'} Information
                  </Text>
                  
                  <TextInput
                    label="Department"
                    value={formData.department}
                    onChangeText={(department) =>
                      setFormData(prev => ({ ...prev, department }))
                    }
                    mode="outlined"
                    autoCapitalize="words"
                    left={<TextInput.Icon icon="domain" />}
                    style={styles.input}
                    disabled={isLoading}
                    error={!!errors.department}
                  />
                  {errors.department && (
                    <HelperText type="error" visible={!!errors.department}>
                      {errors.department}
                    </HelperText>
                  )}
                </>
              )}

              {/* Signup Button */}
              <Button
                mode="contained"
                onPress={handleSignup}
                disabled={isLoading}
                style={styles.signupButton}
                contentStyle={styles.signupButtonContent}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Card.Content>
          </Card>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text variant="bodyMedium">Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => onNavigate('Login')}
              disabled={isLoading}
              compact
            >
              Sign In
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
        {globalError}
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
    marginBottom: spacing.xl,
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
  sectionTitle: {
    marginBottom: spacing.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  input: {
    marginBottom: spacing.xs,
  },
  signupButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  signupButtonContent: {
    paddingVertical: spacing.xs,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
