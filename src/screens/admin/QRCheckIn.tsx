import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  Surface,
  List,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  Divider,
  Searchbar,
  Avatar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/studentMockData';
import { Event, Registration } from '../../types/database';

interface QRCheckInProps {
  eventId?: string;
  onBack?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
}

interface CheckInData {
  registrationId: string;
  userId: string;
  timestamp: string;
  method: 'qr_scan' | 'manual' | 'bulk';
  location?: string;
  notes?: string;
}

export const QRCheckIn: React.FC<QRCheckInProps> = ({ eventId, onBack, onNavigate }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScannerDialog, setShowScannerDialog] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualEntry, setManualEntry] = useState('');
  const [checkInHistory, setCheckInHistory] = useState<CheckInData[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const { events, registrations } = mockEnhancedData;

  // Get current event
  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      setSelectedEvent(event || null);
    } else {
      // Default to first published event
      const publishedEvents = events.filter(e => e.status === 'published');
      setSelectedEvent(publishedEvents[0] || events[0]);
    }
  }, [eventId, events]);

  // Get registrations for selected event
  const eventRegistrations = selectedEvent 
    ? registrations.filter(r => r.eventId === selectedEvent.id)
    : [];

  // Filter registrations based on search and filter
  const filteredRegistrations = eventRegistrations.filter(registration => {
    const matchesSearch = searchQuery === '' || 
      registration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // In a real app, you'd search by user name/email
      registration.userId.toLowerCase().includes(searchQuery.toLowerCase());

    switch (selectedFilter) {
      case 'checked_in':
        return matchesSearch && registration.status === 'confirmed' && 
               checkInHistory.some(c => c.registrationId === registration.id);
      case 'not_checked_in':
        return matchesSearch && registration.status === 'confirmed' && 
               !checkInHistory.some(c => c.registrationId === registration.id);
      case 'confirmed':
        return matchesSearch && registration.status === 'confirmed';
      case 'pending':
        return matchesSearch && registration.status === 'pending';
      default:
        return matchesSearch;
    }
  });

  // Check-in statistics
  const checkInStats = {
    total: eventRegistrations.length,
    confirmed: eventRegistrations.filter(r => r.status === 'confirmed').length,
    checkedIn: checkInHistory.length,
    pending: eventRegistrations.filter(r => r.status === 'pending').length,
    noShow: eventRegistrations.filter(r => 
      r.status === 'confirmed' && 
      !checkInHistory.some(c => c.registrationId === r.id)
    ).length,
  };

  const handleQRScan = () => {
    setIsScanning(true);
    setShowScannerDialog(true);
    
    // Simulate QR scanning
    setTimeout(() => {
      const randomRegistration = eventRegistrations[Math.floor(Math.random() * eventRegistrations.length)];
      if (randomRegistration) {
        handleCheckIn(randomRegistration, 'qr_scan');
      }
      setIsScanning(false);
      setShowScannerDialog(false);
    }, 3000);
  };

  const handleManualCheckIn = () => {
    if (!manualEntry.trim()) {
      Alert.alert('Error', 'Please enter a registration ID or QR code');
      return;
    }

    const registration = eventRegistrations.find(r => 
      r.id.toLowerCase().includes(manualEntry.toLowerCase()) ||
      r.userId.toLowerCase().includes(manualEntry.toLowerCase())
    );

    if (registration) {
      handleCheckIn(registration, 'manual');
      setManualEntry('');
      setShowManualDialog(false);
    } else {
      Alert.alert('Not Found', 'No registration found with that ID');
    }
  };

  const handleCheckIn = (registration: Registration, method: CheckInData['method']) => {
    // Check if already checked in
    const existingCheckIn = checkInHistory.find(c => c.registrationId === registration.id);
    if (existingCheckIn) {
      Alert.alert(
        'Already Checked In',
        `This attendee was already checked in at ${new Date(existingCheckIn.timestamp).toLocaleTimeString()}`,
        [
          { text: 'OK' },
          { 
            text: 'View Details', 
            onPress: () => showCheckInDetails(registration, existingCheckIn)
          }
        ]
      );
      return;
    }

    // Check if registration is confirmed
    if (registration.status !== 'confirmed') {
      Alert.alert(
        'Registration Not Confirmed',
        `This registration is "${registration.status}". Check in anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Check In', 
            onPress: () => performCheckIn(registration, method)
          }
        ]
      );
      return;
    }

    performCheckIn(registration, method);
  };

  const performCheckIn = (registration: Registration, method: CheckInData['method']) => {
    const checkInData: CheckInData = {
      registrationId: registration.id,
      userId: registration.userId,
      timestamp: new Date().toISOString(),
      method,
      location: 'Main Entrance', // In a real app, this could be dynamic
    };

    setCheckInHistory(prev => [...prev, checkInData]);
    
    Alert.alert(
      'Check-In Successful',
      `Attendee has been checked in successfully at ${new Date(checkInData.timestamp).toLocaleTimeString()}`,
      [{ text: 'OK' }]
    );
  };

  const showCheckInDetails = (registration: Registration, checkInData: CheckInData) => {
    Alert.alert(
      'Check-In Details',
      `Registration ID: ${registration.id}\n` +
      `Check-in Time: ${new Date(checkInData.timestamp).toLocaleString()}\n` +
      `Method: ${checkInData.method.replace('_', ' ').toUpperCase()}\n` +
      `Location: ${checkInData.location || 'Not specified'}`,
      [{ text: 'OK' }]
    );
  };

  const handleBulkCheckIn = () => {
    const confirmedRegistrations = eventRegistrations.filter(r => 
      r.status === 'confirmed' && 
      !checkInHistory.some(c => c.registrationId === r.id)
    );

    if (confirmedRegistrations.length === 0) {
      Alert.alert('No Registrations', 'No confirmed registrations available for bulk check-in');
      return;
    }

    Alert.alert(
      'Bulk Check-In',
      `Check in ${confirmedRegistrations.length} confirmed attendees?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Check In All', 
          onPress: () => {
            const bulkCheckIns = confirmedRegistrations.map(reg => ({
              registrationId: reg.id,
              userId: reg.userId,
              timestamp: new Date().toISOString(),
              method: 'bulk' as const,
              location: 'Bulk Entry',
            }));
            
            setCheckInHistory(prev => [...prev, ...bulkCheckIns]);
            Alert.alert('Success', `${bulkCheckIns.length} attendees checked in successfully`);
          }
        }
      ]
    );
  };

  const RegistrationCard: React.FC<{ registration: Registration }> = ({ registration }) => {
    const isCheckedIn = checkInHistory.some(c => c.registrationId === registration.id);
    const checkInData = checkInHistory.find(c => c.registrationId === registration.id);
    
    return (
      <Card style={styles.registrationCard}>
        <Card.Content style={styles.registrationContent}>
          <View style={styles.registrationHeader}>
            <Avatar.Text 
              size={40} 
              label={registration.userId.slice(-2).toUpperCase()} 
              style={styles.avatar}
            />
            
            <View style={styles.registrationInfo}>
              <Text variant="titleSmall" style={styles.registrationTitle}>
                Registration #{registration.id.slice(-6)}
              </Text>
              <Text variant="bodySmall" style={styles.userId}>
                User: {registration.userId}
              </Text>
              <Text variant="bodySmall" style={styles.registrationDate}>
                Registered: {new Date((registration as any).createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <Chip 
                icon={registration.status === 'confirmed' ? 'check-circle' : 'clock-outline'}
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(registration.status) + '20' }
                ]}
                textStyle={{ color: getStatusColor(registration.status) }}
                compact
              >
                {registration.status.toUpperCase()}
              </Chip>
              
              {isCheckedIn && (
                <Chip 
                  icon="account-check" 
                  style={styles.checkedInChip}
                  textStyle={styles.checkedInText}
                  compact
                >
                  CHECKED IN
                </Chip>
              )}
            </View>
          </View>

          {isCheckedIn && checkInData && (
            <View style={styles.checkInDetails}>
              <Divider style={styles.divider} />
              <View style={styles.checkInInfo}>
                <Text variant="bodySmall" style={styles.checkInLabel}>
                  Checked in at: {new Date(checkInData.timestamp).toLocaleString()}
                </Text>
                <Text variant="bodySmall" style={styles.checkInMethod}>
                  Method: {checkInData.method.replace('_', ' ').toUpperCase()}
                </Text>
                {checkInData.location && (
                  <Text variant="bodySmall" style={styles.checkInLocation}>
                    Location: {checkInData.location}
                  </Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            {!isCheckedIn ? (
              <Button
                mode="contained"
                onPress={() => handleCheckIn(registration, 'manual')}
                style={styles.checkInButton}
                icon="account-plus"
                disabled={registration.status !== 'confirmed'}
              >
                Check In
              </Button>
            ) : (
              <Button
                mode="outlined"
                onPress={() => showCheckInDetails(registration, checkInData!)}
                style={styles.detailsButton}
                icon="information"
              >
                View Details
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  // QR Scanner Dialog
  const QRScannerDialog: React.FC = () => (
    <Dialog visible={showScannerDialog} onDismiss={() => setShowScannerDialog(false)}>
      <Dialog.Title>QR Code Scanner</Dialog.Title>
      <Dialog.Content>
        <View style={styles.scannerContainer}>
          <Surface style={styles.scannerPreview} elevation={3}>
            {isScanning ? (
              <View style={styles.scanningIndicator}>
                <IconButton icon="qrcode-scan" size={64} />
                <Text variant="bodyMedium" style={styles.scanningText}>
                  Scanning for QR codes...
                </Text>
                <Text variant="bodySmall" style={styles.scanningSubtext}>
                  Point camera at QR code
                </Text>
              </View>
            ) : (
              <View style={styles.scannerPlaceholder}>
                <IconButton icon="camera" size={64} />
                <Text variant="bodyMedium">Camera will open here</Text>
              </View>
            )}
          </Surface>
          
          <Button 
            mode="text" 
            onPress={() => setShowManualDialog(true)}
            style={styles.manualEntryButton}
          >
            Enter Code Manually
          </Button>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setShowScannerDialog(false)}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );

  // Manual Entry Dialog
  const ManualEntryDialog: React.FC = () => (
    <Dialog visible={showManualDialog} onDismiss={() => setShowManualDialog(false)}>
      <Dialog.Title>Manual Check-In</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Registration ID or QR Code"
          value={manualEntry}
          onChangeText={setManualEntry}
          placeholder="Enter registration ID..."
          style={styles.manualInput}
        />
        <Text variant="bodySmall" style={styles.manualHint}>
          Enter the registration ID or scan the QR code content manually
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setShowManualDialog(false)}>Cancel</Button>
        <Button mode="contained" onPress={handleManualCheckIn}>
          Check In
        </Button>
      </Dialog.Actions>
    </Dialog>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <View style={styles.headerInfo}>
          <Text variant="titleMedium" style={styles.headerTitle}>QR Check-In</Text>
          {selectedEvent && (
            <Text variant="bodySmall" style={styles.eventTitle}>
              {selectedEvent.title}
            </Text>
          )}
        </View>
        <IconButton 
          icon="qrcode-scan" 
          onPress={handleQRScan}
        />
      </View>

      {/* Stats Dashboard */}
      <Surface style={styles.statsContainer} elevation={2}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {checkInStats.checkedIn}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Checked In</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {checkInStats.confirmed}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Confirmed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {checkInStats.pending}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>Pending</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {checkInStats.noShow}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>No Show</Text>
          </View>
        </View>
        
        {checkInStats.confirmed > 0 && (
          <Text variant="bodySmall" style={styles.checkInRate}>
            Check-in Rate: {((checkInStats.checkedIn / checkInStats.confirmed) * 100).toFixed(1)}%
          </Text>
        )}
      </Surface>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          onPress={handleQRScan}
          style={styles.quickActionButton}
          icon="qrcode-scan"
        >
          Scan QR
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => setShowManualDialog(true)}
          style={styles.quickActionButton}
          icon="keyboard"
        >
          Manual Entry
        </Button>
        
        <Button
          mode="text"
          onPress={handleBulkCheckIn}
          style={styles.quickActionButton}
          icon="account-multiple-plus"
        >
          Bulk Check-In
        </Button>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search registrations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <SegmentedButtons
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'checked_in', label: 'Checked In' },
            { value: 'not_checked_in', label: 'Not Checked In' },
          ]}
          style={styles.filterButtons}
        />
      </View>

      {/* Registrations List */}
      <FlatList
        data={filteredRegistrations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RegistrationCard registration={item} />}
        style={styles.registrationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Surface style={styles.emptyState} elevation={1}>
            <IconButton icon="account-search" size={64} style={styles.emptyIcon} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Registrations Found
            </Text>
            <Text variant="bodyMedium" style={styles.emptyMessage}>
              {searchQuery 
                ? `No registrations match "${searchQuery}"`
                : 'No registrations available for this filter.'
              }
            </Text>
          </Surface>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Dialogs */}
      <Portal>
        <QRScannerDialog />
        <ManualEntryDialog />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  eventTitle: {
    color: theme.colors.onSurfaceVariant,
  },
  statsContainer: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  checkInRate: {
    textAlign: 'center',
    color: theme.colors.success,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchBar: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  filterButtons: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  registrationsList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  registrationCard: {
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  registrationContent: {
    padding: spacing.md,
  },
  registrationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: spacing.md,
  },
  registrationInfo: {
    flex: 1,
  },
  registrationTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  userId: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  registrationDate: {
    color: theme.colors.onSurfaceVariant,
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  statusChip: {
    borderRadius: 12,
  },
  checkedInChip: {
    backgroundColor: theme.colors.success + '20',
  },
  checkedInText: {
    color: theme.colors.success,
  },
  checkInDetails: {
    marginTop: spacing.sm,
  },
  divider: {
    marginBottom: spacing.sm,
  },
  checkInInfo: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: spacing.sm,
    borderRadius: 8,
  },
  checkInLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  checkInMethod: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  checkInLocation: {
    color: theme.colors.onSurfaceVariant,
  },
  actionButtons: {
    marginTop: spacing.md,
  },
  checkInButton: {
    borderRadius: 8,
  },
  detailsButton: {
    borderRadius: 8,
  },
  scannerContainer: {
    alignItems: 'center',
  },
  scannerPreview: {
    width: 250,
    height: 250,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: spacing.md,
  },
  scanningIndicator: {
    alignItems: 'center',
  },
  scanningText: {
    marginTop: spacing.md,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  scanningSubtext: {
    marginTop: spacing.sm,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  scannerPlaceholder: {
    alignItems: 'center',
    opacity: 0.5,
  },
  manualEntryButton: {
    marginTop: spacing.sm,
  },
  manualInput: {
    marginBottom: spacing.md,
  },
  manualHint: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    marginVertical: spacing.lg,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
