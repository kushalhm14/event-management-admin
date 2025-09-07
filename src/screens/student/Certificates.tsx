import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Linking,
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
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';
import { mockEnhancedData } from '../../services/studentMockData';
import { Certificate } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';

interface CertificatesProps {
  onBack?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const { certificates, events } = mockEnhancedData;
  
  // Get user's certificates
  const userCertificates = certificates.filter(c => c.userId === user?.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShareCertificate = async (certificate: Certificate) => {
    try {
      const message = `🎓 I've earned a certificate!\n\n${certificate.title}\n\nIssued: ${formatDate(certificate.createdAt)}\nVerification: ${certificate.verificationCode}`;
      
      await Share.share({
        message,
        title: certificate.title,
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  const handleVerifyCertificate = (certificate: Certificate) => {
    if (certificate.verificationUrl) {
      Linking.openURL(certificate.verificationUrl);
    } else {
      Alert.alert(
        'Certificate Verification',
        `Verification Code: ${certificate.verificationCode}\n\nUse this code to verify the authenticity of this certificate.`,
        [
          { text: 'Copy Code', onPress: () => {
            // In a real app, you'd copy to clipboard
            Alert.alert('Copied', 'Verification code copied to clipboard');
          }},
          { text: 'OK' }
        ]
      );
    }
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // Simulate certificate download
    Alert.alert(
      'Download Certificate',
      'Certificate download will start shortly. Check your Downloads folder.',
      [{ text: 'OK' }]
    );
  };

  const CertificateCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => {
    const event = events.find(e => e.id === certificate.eventId);
    
    // Parse metadata
    let metadata: any = {};
    try {
      if (typeof certificate.metadata === 'object') {
        metadata = certificate.metadata;
      }
    } catch (error) {
      // If parsing fails, use empty object
    }

    return (
      <Card 
        style={styles.certificateCard} 
        onPress={() => setSelectedCertificate(certificate)}
      >
        <Card.Content style={styles.certificateContent}>
          {/* Header */}
          <View style={styles.certificateHeader}>
            <View style={styles.certificateIcon}>
              <IconButton 
                icon="certificate" 
                size={32} 
                iconColor={theme.colors.primary}
                style={styles.iconButton}
              />
            </View>
            
            <View style={styles.certificateInfo}>
              <Text variant="titleMedium" style={styles.certificateTitle}>
                {certificate.title}
              </Text>
              
              <Text variant="bodyMedium" style={styles.eventTitle}>
                {event?.title || 'Unknown Event'}
              </Text>
              
              <Text variant="bodySmall" style={styles.issueDate}>
                Issued on {formatDate(certificate.createdAt)}
              </Text>
            </View>

            <IconButton
              icon="dots-vertical"
              onPress={() => {
                Alert.alert(
                  'Certificate Options',
                  'What would you like to do with this certificate?',
                  [
                    { text: 'Share', onPress: () => handleShareCertificate(certificate) },
                    { text: 'Verify', onPress: () => handleVerifyCertificate(certificate) },
                    { text: 'Download', onPress: () => handleDownloadCertificate(certificate) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <Chip 
              icon="check-circle" 
              style={styles.statusChip}
              textStyle={styles.statusText}
            >
              Verified
            </Chip>
            
            <Chip 
              icon="download" 
              style={styles.actionChip}
              textStyle={styles.actionText}
              onPress={() => handleDownloadCertificate(certificate)}
            >
              Download
            </Chip>
          </View>

          {/* Certificate Details */}
          <View style={styles.detailsContainer}>
            <List.Item
              title={certificate.certificateNumber}
              description="Certificate Number"
              left={() => <List.Icon icon="identifier" />}
              style={styles.detailItem}
            />

            <List.Item
              title={certificate.verificationCode}
              description="Verification Code"
              left={() => <List.Icon icon="shield-check" />}
              right={() => (
                <Button 
                  mode="text" 
                  compact 
                  onPress={() => handleVerifyCertificate(certificate)}
                >
                  Verify
                </Button>
              )}
              style={styles.detailItem}
            />

            {metadata.duration && (
              <List.Item
                title={metadata.duration}
                description="Course Duration"
                left={() => <List.Icon icon="clock-outline" />}
                style={styles.detailItem}
              />
            )}

            {metadata.modules && Array.isArray(metadata.modules) && (
              <List.Item
                title={`${metadata.modules.length} Modules`}
                description="Course Modules"
                left={() => <List.Icon icon="book-open-variant" />}
                style={styles.detailItem}
              />
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => setSelectedCertificate(certificate)}
              style={styles.actionButton}
              icon="eye"
            >
              View Details
            </Button>

            <Button
              mode="contained"
              onPress={() => handleShareCertificate(certificate)}
              style={styles.actionButton}
              icon="share-variant"
            >
              Share
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const CertificateDetailsDialog: React.FC = () => {
    if (!selectedCertificate) return null;

    const event = events.find(e => e.id === selectedCertificate.eventId);
    
    // Parse metadata
    let metadata: any = {};
    try {
      if (typeof selectedCertificate.metadata === 'object') {
        metadata = selectedCertificate.metadata;
      }
    } catch (error) {
      // If parsing fails, use empty object
    }

    return (
      <Dialog 
        visible={!!selectedCertificate} 
        onDismiss={() => setSelectedCertificate(null)}
        style={styles.detailsDialog}
      >
        <Dialog.Title>Certificate Details</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.dialogContent} showsVerticalScrollIndicator={false}>
            {/* Certificate Preview */}
            <Surface style={styles.certificatePreview} elevation={3}>
              <View style={styles.previewHeader}>
                <IconButton 
                  icon="certificate" 
                  size={48} 
                  iconColor={theme.colors.primary}
                />
                <Text variant="headlineSmall" style={styles.previewTitle}>
                  Certificate of Completion
                </Text>
              </View>

              <Divider style={styles.previewDivider} />

              <View style={styles.previewContent}>
                <Text variant="bodyLarge" style={styles.previewText}>
                  This certifies that
                </Text>
                
                <Text variant="headlineMedium" style={styles.recipientName}>
                  {user?.name}
                </Text>
                
                <Text variant="bodyLarge" style={styles.previewText}>
                  has successfully completed
                </Text>
                
                <Text variant="titleLarge" style={styles.courseName}>
                  {event?.title || 'Course'}
                </Text>
                
                <Text variant="bodyMedium" style={styles.completionDate}>
                  Completed on {formatDate(selectedCertificate.createdAt)}
                </Text>
              </View>

              <View style={styles.previewFooter}>
                <Text variant="bodySmall" style={styles.verificationInfo}>
                  Certificate #{selectedCertificate.certificateNumber}
                </Text>
                <Text variant="bodySmall" style={styles.verificationInfo}>
                  Verify at: {selectedCertificate.verificationCode}
                </Text>
              </View>
            </Surface>

            {/* Certificate Information */}
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.infoTitle}>
                  Certificate Information
                </Text>

                <List.Item
                  title={selectedCertificate.title}
                  description="Title"
                  left={() => <List.Icon icon="certificate" />}
                />

                <List.Item
                  title={event?.title || 'Unknown Event'}
                  description="Event"
                  left={() => <List.Icon icon="calendar" />}
                />

                <List.Item
                  title={formatDate(selectedCertificate.createdAt)}
                  description="Issue Date"
                  left={() => <List.Icon icon="calendar-check" />}
                />

                <List.Item
                  title={selectedCertificate.certificateNumber}
                  description="Certificate Number"
                  left={() => <List.Icon icon="identifier" />}
                />

                <List.Item
                  title={selectedCertificate.verificationCode}
                  description="Verification Code"
                  left={() => <List.Icon icon="shield-check" />}
                />
              </Card.Content>
            </Card>

            {/* Course Details */}
            {metadata && Object.keys(metadata).length > 0 && (
              <Card style={styles.courseDetailsCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.infoTitle}>
                    Course Details
                  </Text>

                  {metadata.duration && (
                    <List.Item
                      title={metadata.duration}
                      description="Duration"
                      left={() => <List.Icon icon="clock-outline" />}
                    />
                  )}

                  {metadata.modules && Array.isArray(metadata.modules) && (
                    <View>
                      <List.Item
                        title={`${metadata.modules.length} Modules Completed`}
                        description="Course Structure"
                        left={() => <List.Icon icon="book-open-variant" />}
                      />
                      
                      <View style={styles.modulesList}>
                        {metadata.modules.map((module: string, index: number) => (
                          <Chip key={index} style={styles.moduleChip} compact>
                            {module}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  )}

                  {metadata.finalProject && (
                    <List.Item
                      title={metadata.finalProject}
                      description="Final Project"
                      left={() => <List.Icon icon="briefcase" />}
                    />
                  )}
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button onPress={() => handleVerifyCertificate(selectedCertificate)}>
            Verify
          </Button>
          <Button onPress={() => handleDownloadCertificate(selectedCertificate)}>
            Download
          </Button>
          <Button mode="contained" onPress={() => setSelectedCertificate(null)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>Certificates</Text>
        <IconButton icon="download-multiple" onPress={() => {
          Alert.alert('Download All', 'Download all certificates as a ZIP file?');
        }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {userCertificates.length === 0 ? (
          <Surface style={styles.emptyState} elevation={1}>
            <IconButton icon="certificate-outline" size={64} style={styles.emptyIcon} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Certificates Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyMessage}>
              Complete events to earn certificates. Certificates will be automatically generated for eligible events.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => onNavigate?.('StudentDashboard')}
              style={styles.emptyButton}
            >
              Browse Events
            </Button>
          </Surface>
        ) : (
          <View style={styles.certificatesList}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Your Certificates ({userCertificates.length})
            </Text>
            
            {userCertificates.map(certificate => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Certificate Details Dialog */}
      <Portal>
        <CertificateDetailsDialog />
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
  certificatesList: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  certificateCard: {
    marginBottom: spacing.md,
    ...shadows.md,
  },
  certificateContent: {
    padding: spacing.md,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  certificateIcon: {
    marginRight: spacing.md,
  },
  iconButton: {
    margin: 0,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  eventTitle: {
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  issueDate: {
    color: theme.colors.onSurfaceVariant,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusChip: {
    backgroundColor: theme.colors.success + '20',
  },
  statusText: {
    color: theme.colors.success,
  },
  actionChip: {
    backgroundColor: theme.colors.primary + '20',
  },
  actionText: {
    color: theme.colors.primary,
  },
  detailsContainer: {
    marginBottom: spacing.md,
  },
  detailItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  emptyState: {
    margin: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
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
    marginBottom: spacing.lg,
  },
  emptyButton: {
    borderRadius: 12,
  },
  detailsDialog: {
    marginHorizontal: spacing.md,
    maxHeight: '80%',
  },
  dialogContent: {
    maxHeight: 400,
  },
  certificatePreview: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewTitle: {
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  previewDivider: {
    marginVertical: spacing.md,
  },
  previewContent: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  previewText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  recipientName: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  courseName: {
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  completionDate: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  previewFooter: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  verificationInfo: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  infoCard: {
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  infoTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  courseDetailsCard: {
    ...shadows.sm,
  },
  modulesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  moduleChip: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
