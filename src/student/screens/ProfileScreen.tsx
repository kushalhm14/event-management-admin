import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  ActivityIndicator,
  Snackbar,
  Avatar,
  Divider,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../../services/studentApi';
import { useStudentAuth } from '../hooks/useStudentAuth';
import { Student, StudentUpdateData } from '../../types/student';

interface ProfileScreenProps {
  onLogout: () => void;
}

/**
 * Student profile screen with edit functionality
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { studentId, logout } = useStudentAuth();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_url: '',
    bio: '',
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch student profile
  const {
    data: student,
    isLoading,
    error,
  } = useQuery<Student, Error>({
    queryKey: ['student-profile', studentId],
    queryFn: () => studentApi.getStudent(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updates: StudentUpdateData) => 
      studentApi.updateProfile('col-1', studentId!, updates),
    onSuccess: (updatedStudent) => {
      queryClient.setQueryData(['student-profile', studentId], updatedStudent);
      setIsEditing(false);
      showSnackbar('Profile updated successfully!');
    },
    onError: (error: any) => {
      Alert.alert(
        'Update Failed',
        error?.message || 'Failed to update profile. Please try again.'
      );
    },
  });

  // Initialize form data when student data loads
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        avatar_url: student.avatar_url || '',
        bio: student.bio || '',
      });
    }
  }, [student]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        avatar_url: student.avatar_url || '',
        bio: student.bio || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    const updates: StudentUpdateData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      avatar_url: formData.avatar_url.trim() || undefined,
      bio: formData.bio.trim() || undefined,
    };

    updateProfileMutation.mutate(updates);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onLogout();
            } catch (error) {
              console.error('Logout failed:', error);
              showSnackbar('Failed to logout');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !student) {
    return (
      <View style={styles.errorContainer}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorTitle}>
              Failed to load profile
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              {error?.message || 'Could not load your profile information'}
            </Text>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Avatar.Text
                size={80}
                label={student.name.charAt(0).toUpperCase()}
                style={styles.avatar}
              />
              <View style={styles.headerInfo}>
                <Text variant="headlineSmall" style={styles.name}>
                  {student.name}
                </Text>
                <Text variant="bodyMedium" style={styles.rollNo}>
                  {student.roll_no}
                </Text>
                <Text variant="bodySmall" style={styles.studentId}>
                  Student ID: {student.id}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {isEditing ? (
              <View style={styles.editForm}>
                <Text variant="titleMedium" style={styles.formTitle}>
                  Edit Profile
                </Text>

                <TextInput
                  mode="outlined"
                  label="Full Name *"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  style={styles.input}
                  disabled={updateProfileMutation.isPending}
                />

                <TextInput
                  mode="outlined"
                  label="Email *"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  disabled={updateProfileMutation.isPending}
                />

                <TextInput
                  mode="outlined"
                  label="Avatar URL (Optional)"
                  value={formData.avatar_url}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, avatar_url: text }))}
                  placeholder="https://example.com/avatar.jpg"
                  autoCapitalize="none"
                  style={styles.input}
                  disabled={updateProfileMutation.isPending}
                />

                <TextInput
                  mode="outlined"
                  label="Bio (Optional)"
                  value={formData.bio}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                  multiline
                  numberOfLines={3}
                  placeholder="Tell us about yourself..."
                  style={styles.input}
                  disabled={updateProfileMutation.isPending}
                />

                <View style={styles.actionButtons}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                    loading={updateProfileMutation.isPending}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.viewMode}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Contact Information
                </Text>
                <Text variant="bodyMedium" style={styles.infoText}>
                  📧 {student.email}
                </Text>
                
                {student.bio && (
                  <>
                    <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>
                      About
                    </Text>
                    <Text variant="bodyMedium" style={styles.bioText}>
                      {student.bio}
                    </Text>
                  </>
                )}

                <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>
                  Account Details
                </Text>
                <Text variant="bodySmall" style={styles.metadataText}>
                  Joined: {new Date(student.created_at).toLocaleDateString()}
                </Text>
                <Text variant="bodySmall" style={styles.metadataText}>
                  Last updated: {new Date(student.updated_at).toLocaleDateString()}
                </Text>

                <View style={styles.viewActions}>
                  <Button
                    mode="contained"
                    onPress={handleEdit}
                    style={styles.editButton}
                    icon="pencil"
                  >
                    Edit Profile
                  </Button>
                </View>
              </View>
            )}

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              icon="logout"
              textColor="#d32f2f"
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rollNo: {
    opacity: 0.8,
    marginBottom: 2,
  },
  studentId: {
    opacity: 0.6,
  },
  divider: {
    marginVertical: 16,
  },
  editForm: {
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  viewMode: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  infoText: {
    marginBottom: 4,
  },
  bioText: {
    lineHeight: 20,
    opacity: 0.8,
  },
  metadataText: {
    opacity: 0.6,
    marginBottom: 2,
  },
  viewActions: {
    marginTop: 16,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  logoutButton: {
    borderColor: '#d32f2f',
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
  snackbar: {
    marginBottom: 16,
  },
});

export default ProfileScreen;
