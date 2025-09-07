import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Card,
  TextInput,
  Button,
  Text,
  Divider,
  List,
  Switch,
  Snackbar,
  ActivityIndicator,
  Avatar,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/auth';
import { theme, spacing, shadows } from '../../theme/theme';

export const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setError('');
      await updateProfile(formData);
      setEditMode(false);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setShowError(true);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Avatar.Text 
                size={100} 
                label={user.name.substring(0, 2).toUpperCase()}
                style={styles.avatarFallback}
              />
            )}
            {editMode && (
              <IconButton
                icon="camera"
                mode="contained"
                size={20}
                style={styles.cameraButton}
                onPress={() => {
                  // TODO: Implement image picker
                  Alert.alert('Coming Soon', 'Photo upload will be available soon!');
                }}
              />
            )}
          </View>
          
          <Text variant="headlineSmall" style={styles.name}>
            {user.name}
          </Text>
          
          <View style={styles.roleContainer}>
            <Text variant="labelLarge" style={styles.role}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          </View>
          
          <Text variant="bodyMedium" style={styles.email}>
            {user.email}
          </Text>
        </View>

        {/* Profile Information */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Profile Information
              </Text>
              <Button
                mode={editMode ? 'outlined' : 'text'}
                onPress={() => setEditMode(!editMode)}
                compact
              >
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </View>

            <Divider style={styles.divider} />

            {editMode ? (
              <View style={styles.editForm}>
                <TextInput
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(name) =>
                    setFormData(prev => ({ ...prev, name }))
                  }
                  mode="outlined"
                  style={styles.input}
                />

                {user.role === 'student' && (
                  <>
                    <TextInput
                      label="Course/Program"
                      value={formData.course}
                      onChangeText={(course) =>
                        setFormData(prev => ({ ...prev, course }))
                      }
                      mode="outlined"
                      style={styles.input}
                    />
                    
                    <TextInput
                      label="Year"
                      value={formData.year?.toString()}
                      onChangeText={(year) =>
                        setFormData(prev => ({ ...prev, year: parseInt(year) || 2024 }))
                      }
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </>
                )}

                {(user.role === 'admin' || user.role === 'organizer') && (
                  <TextInput
                    label="Department"
                    value={formData.department}
                    onChangeText={(department) =>
                      setFormData(prev => ({ ...prev, department }))
                    }
                    mode="outlined"
                    style={styles.input}
                  />
                )}

                <View style={styles.editActions}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    disabled={isLoading}
                    style={styles.saveButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.infoDisplay}>
                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.infoLabel}>
                    Email
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {user.email}
                  </Text>
                </View>

                {user.role === 'student' && (
                  <>
                    <View style={styles.infoRow}>
                      <Text variant="bodyMedium" style={styles.infoLabel}>
                        Student ID
                      </Text>
                      <Text variant="bodyMedium" style={styles.infoValue}>
                        {user.studentId || 'Not provided'}
                      </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Text variant="bodyMedium" style={styles.infoLabel}>
                        Course
                      </Text>
                      <Text variant="bodyMedium" style={styles.infoValue}>
                        {user.course || 'Not specified'}
                      </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Text variant="bodyMedium" style={styles.infoLabel}>
                        Year
                      </Text>
                      <Text variant="bodyMedium" style={styles.infoValue}>
                        {user.year || 'Not specified'}
                      </Text>
                    </View>
                  </>
                )}

                {(user.role === 'admin' || user.role === 'organizer') && (
                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={styles.infoLabel}>
                      Department
                    </Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                      {user.department || 'Not specified'}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.infoLabel}>
                    Member since
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Settings
            </Text>
            
            <Divider style={styles.divider} />

            <List.Item
              title="Push Notifications"
              description="Receive notifications about events"
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              )}
            />

            <List.Item
              title="Email Updates"
              description="Receive email updates about events"
              right={() => (
                <Switch
                  value={emailUpdates}
                  onValueChange={setEmailUpdates}
                />
              )}
            />

            <List.Item
              title="Change Password"
              description="Update your password"
              left={props => <List.Icon {...props} icon="lock" />}
              onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon!')}
            />
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Account
            </Text>
            
            <Divider style={styles.divider} />

            <List.Item
              title="Privacy Policy"
              left={props => <List.Icon {...props} icon="shield-account" />}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content would go here.')}
            />

            <List.Item
              title="Terms of Service"
              left={props => <List.Icon {...props} icon="file-document" />}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service content would go here.')}
            />

            <List.Item
              title="Help & Support"
              left={props => <List.Icon {...props} icon="help-circle" />}
              onPress={() => Alert.alert('Help', 'Support options would be available here.')}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
          icon="logout"
        >
          Sign Out
        </Button>
      </ScrollView>

      {/* Success Snackbar */}
      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
      >
        Profile updated successfully!
      </Snackbar>

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
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarFallback: {
    backgroundColor: theme.colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginBottom: spacing.xs,
  },
  roleContainer: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  role: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: '600',
  },
  email: {
    color: theme.colors.onSurfaceVariant,
  },
  card: {
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.lg,
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
  editForm: {
    gap: spacing.md,
  },
  input: {
    marginBottom: spacing.sm,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  infoDisplay: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
  infoValue: {
    color: theme.colors.onSurface,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  logoutButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    borderColor: theme.colors.error,
  },
});
