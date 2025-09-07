import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  List,
  Switch,
  Divider,
  Avatar,
  Surface,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileProps {
  onBack?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
  onLogout?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack, onNavigate, onLogout }) => {
  const { user, logout } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    newEvents: true,
    certificates: true,
    marketing: false,
  });

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully');
    setShowEditDialog(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            onLogout?.();
          }
        },
      ]
    );
  };

  const userStats = {
    eventsAttended: 12,
    certificatesEarned: 4,
    hoursLearned: 48,
    rank: 'Advanced Learner',
  };

  const EditProfileDialog: React.FC = () => (
    <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
      <Dialog.Title>Edit Profile</Dialog.Title>
      <Dialog.Content>
        <ScrollView style={styles.editForm} showsVerticalScrollIndicator={false}>
          <TextInput
            label="Full Name"
            value={editForm.name}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
            style={styles.input}
          />
          
          <TextInput
            label="Email"
            value={editForm.email}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            style={styles.input}
          />
          
          <TextInput
            label="Phone Number"
            value={editForm.phone}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
            style={styles.input}
          />
          
          <TextInput
            label="Bio"
            value={editForm.bio}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
        <Button mode="contained" onPress={handleSaveProfile}>Save</Button>
      </Dialog.Actions>
    </Dialog>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && <IconButton icon="arrow-left" onPress={onBack} />}
        <Text variant="titleLarge" style={styles.headerTitle}>Profile</Text>
        <IconButton 
          icon="pencil" 
          onPress={() => setShowEditDialog(true)} 
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <Avatar.Text 
                size={80} 
                label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} 
                style={styles.avatar}
              />
              
              <View style={styles.profileInfo}>
                <Text variant="headlineSmall" style={styles.userName}>
                  {user?.name || 'User Name'}
                </Text>
                <Text variant="bodyMedium" style={styles.userEmail}>
                  {user?.email || 'user@example.com'}
                </Text>
                <Text variant="bodySmall" style={styles.userRole}>
                  {user?.role?.toUpperCase() || 'STUDENT'} • {userStats.rank}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="titleMedium" style={styles.statValue}>
                  {userStats.eventsAttended}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Events Attended
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text variant="titleMedium" style={styles.statValue}>
                  {userStats.certificatesEarned}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Certificates
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text variant="titleMedium" style={styles.statValue}>
                  {userStats.hoursLearned}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Hours Learned
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            
            <List.Item
              title="My Tickets"
              description="View your event tickets"
              left={() => <List.Icon icon="ticket" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => onNavigate?.('MyTickets')}
              style={styles.listItem}
            />
            
            <List.Item
              title="Certificates"
              description="Download your certificates"
              left={() => <List.Icon icon="certificate" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => onNavigate?.('Certificates')}
              style={styles.listItem}
            />
            
            <List.Item
              title="QR Scanner"
              description="Scan QR codes for check-in"
              left={() => <List.Icon icon="qrcode-scan" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => onNavigate?.('QRScanner')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notification Preferences
            </Text>
            
            <List.Item
              title="Event Reminders"
              description="Get notified before events start"
              left={() => <List.Icon icon="bell" />}
              right={() => (
                <Switch
                  value={notifications.eventReminders}
                  onValueChange={(value) => 
                    setNotifications(prev => ({ ...prev, eventReminders: value }))
                  }
                />
              )}
              style={styles.listItem}
            />
            
            <List.Item
              title="New Events"
              description="Be the first to know about new events"
              left={() => <List.Icon icon="calendar-plus" />}
              right={() => (
                <Switch
                  value={notifications.newEvents}
                  onValueChange={(value) => 
                    setNotifications(prev => ({ ...prev, newEvents: value }))
                  }
                />
              )}
              style={styles.listItem}
            />
            
            <List.Item
              title="Certificates Ready"
              description="Get notified when certificates are available"
              left={() => <List.Icon icon="certificate" />}
              right={() => (
                <Switch
                  value={notifications.certificates}
                  onValueChange={(value) => 
                    setNotifications(prev => ({ ...prev, certificates: value }))
                  }
                />
              )}
              style={styles.listItem}
            />
            
            <List.Item
              title="Marketing Updates"
              description="Receive promotional emails"
              left={() => <List.Icon icon="email-newsletter" />}
              right={() => (
                <Switch
                  value={notifications.marketing}
                  onValueChange={(value) => 
                    setNotifications(prev => ({ ...prev, marketing: value }))
                  }
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account Settings
            </Text>
            
            <List.Item
              title="Edit Profile"
              description="Update your personal information"
              left={() => <List.Icon icon="account-edit" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => setShowEditDialog(true)}
              style={styles.listItem}
            />
            
            <List.Item
              title="Privacy Settings"
              description="Manage your privacy preferences"
              left={() => <List.Icon icon="shield-account" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings feature coming soon')}
              style={styles.listItem}
            />
            
            <List.Item
              title="Help & Support"
              description="Get help or contact support"
              left={() => <List.Icon icon="help-circle" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert('Support', 'Contact us at support@eventhub.com')}
              style={styles.listItem}
            />
            
            <List.Item
              title="About"
              description="App version and information"
              left={() => <List.Icon icon="information" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => Alert.alert('About', 'EventHub v1.0.0\nBuilt with React Native')}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Logout */}
        <Surface style={styles.logoutContainer} elevation={1}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor={theme.colors.error}
            icon="logout"
          >
            Log Out
          </Button>
        </Surface>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Profile Dialog */}
      <Portal>
        <EditProfileDialog />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  headerTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    margin: spacing.md,
    ...shadows.md,
  },
  profileContent: {
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  userEmail: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  userRole: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  actionsCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  settingsCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  listItem: {
    paddingVertical: spacing.xs,
  },
  logoutContainer: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  logoutButton: {
    borderColor: theme.colors.error,
    borderRadius: 8,
  },
  editForm: {
    maxHeight: 400,
  },
  input: {
    marginBottom: spacing.md,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
