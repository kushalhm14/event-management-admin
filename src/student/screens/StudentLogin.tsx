import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useStudentAuth } from '../hooks/useStudentAuth';

interface StudentLoginProps {
  onLoginSuccess: () => void;
}

/**
 * Student login screen with demo ID support
 */
export const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useStudentAuth();

  const demoIds = ['stu-1', 'stu-2', 'stu-3'];
  const demoStudents = [
    { id: 'stu-1', name: 'Asha Patel' },
    { id: 'stu-2', name: 'Rahul Kumar' },
    { id: 'stu-3', name: 'Priya Sharma' },
  ];

  const handleLogin = async () => {
    if (!studentId.trim()) {
      Alert.alert('Error', 'Please enter your Student ID');
      return;
    }

    try {
      setIsLoggingIn(true);
      await login(studentId.trim());
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'Failed to login. Please try again.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = async (demoId: string) => {
    setStudentId(demoId);
    try {
      setIsLoggingIn(true);
      await login(demoId);
      onLoginSuccess();
    } catch (error) {
      console.error('Demo login failed:', error);
      Alert.alert('Login Failed', 'Failed to login with demo ID');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Student Portal</Title>
          <Paragraph style={styles.subtitle}>
            Enter your Student ID to access events and registrations
          </Paragraph>

          <TextInput
            mode="outlined"
            label="Student ID"
            value={studentId}
            onChangeText={setStudentId}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="e.g., stu-1"
            disabled={isLoggingIn}
            onSubmitEditing={handleLogin}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={isLoggingIn}
            loading={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>

          <Divider style={styles.divider} />

          <Text style={styles.demoTitle}>Demo Student IDs:</Text>
          <Text style={styles.demoSubtitle}>
            Click any ID below for quick demo access
          </Text>

          <View style={styles.demoChips}>
            {demoStudents.map((student) => (
              <Chip
                key={student.id}
                mode="outlined"
                onPress={() => handleDemoLogin(student.id)}
                style={styles.demoChip}
                disabled={isLoggingIn}
              >
                {student.id} ({student.name})
              </Chip>
            ))}
          </View>

          {isLoggingIn && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <Text style={styles.loadingText}>Authenticating...</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Event Management System - Student Portal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginBottom: 24,
    paddingVertical: 4,
  },
  divider: {
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  demoSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 12,
  },
  demoChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  demoChip: {
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});

export default StudentLogin;
