import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  IconButton,
  Surface,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, spacing, shadows } from '../../theme/theme';

interface QRScannerProps {
  onBack?: () => void;
  onScanSuccess?: (data: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onBack, onScanSuccess }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    // Mock permission request for demo
    // In a real app, you would use expo-camera or react-native-camera
    setHasPermission(true);
  };

  const handleScan = (data: string) => {
    setScanned(true);
    setScanning(false);
    
    // Simulate QR code processing
    Alert.alert(
      'QR Code Scanned',
      `Scanned data: ${data}`,
      [
        { text: 'Scan Again', onPress: () => setScanned(false) },
        { text: 'OK', onPress: () => onScanSuccess?.(data) },
      ]
    );
  };

  const startScanning = () => {
    setScanning(true);
    setScanned(false);
    
    // Simulate scanning process
    setTimeout(() => {
      if (scanning) {
        handleScan('EVENT-CHECKIN-123456789');
      }
    }, 2000);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Requesting camera permission...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={onBack} />
          <Text variant="titleLarge" style={styles.headerTitle}>QR Scanner</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.centerContent}>
          <IconButton icon="camera-off" size={64} style={styles.errorIcon} />
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Camera Permission Denied
          </Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            Please enable camera permission in your device settings to scan QR codes.
          </Text>
          <Button mode="contained" onPress={requestCameraPermission} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={onBack} />
        <Text variant="titleLarge" style={styles.headerTitle}>QR Scanner</Text>
        <IconButton icon="flash" onPress={() => {}} />
      </View>

      <View style={styles.content}>
        {/* Scanner Area */}
        <View style={styles.scannerContainer}>
          <Surface style={styles.scannerFrame} elevation={4}>
            {scanning ? (
              <View style={styles.scanningOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="bodyLarge" style={styles.scanningText}>
                  Scanning...
                </Text>
                <View style={styles.scanLine} />
              </View>
            ) : (
              <View style={styles.scannerPlaceholder}>
                <IconButton 
                  icon="qrcode-scan" 
                  size={80} 
                  iconColor={theme.colors.primary}
                  style={styles.scannerIcon}
                />
                <Text variant="bodyLarge" style={styles.placeholderText}>
                  {scanned ? 'QR Code Scanned!' : 'Position QR code within the frame'}
                </Text>
              </View>
            )}
          </Surface>

          {/* Corner Indicators */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.instructionsTitle}>
              How to scan:
            </Text>
            <Text variant="bodyMedium" style={styles.instructionsText}>
              • Hold your device steady{'\n'}
              • Point the camera at the QR code{'\n'}
              • Make sure the code is within the frame{'\n'}
              • Wait for automatic detection
            </Text>
          </Card.Content>
        </Card>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          {!scanning && !scanned && (
            <Button
              mode="contained"
              onPress={startScanning}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              icon="camera"
            >
              Start Scanning
            </Button>
          )}

          {scanning && (
            <Button
              mode="outlined"
              onPress={() => setScanning(false)}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              icon="stop"
            >
              Stop Scanning
            </Button>
          )}

          {scanned && (
            <Button
              mode="contained"
              onPress={() => setScanned(false)}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              icon="refresh"
            >
              Scan Again
            </Button>
          )}
        </View>

        {/* Manual Entry Option */}
        <Card style={styles.manualEntryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.manualEntryTitle}>
              Can't scan?
            </Text>
            <Text variant="bodyMedium" style={styles.manualEntryText}>
              If you're having trouble scanning, you can enter the event code manually.
            </Text>
            <Button
              mode="text"
              onPress={() => {
                Alert.prompt(
                  'Enter Event Code',
                  'Please enter the event code manually:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Submit', 
                      onPress: (code) => {
                        if (code) {
                          handleScan(code);
                        }
                      }
                    },
                  ],
                  'plain-text'
                );
              }}
              style={styles.manualEntryButton}
            >
              Enter Code Manually
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');
const scannerSize = Math.min(width * 0.8, 300);

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
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: theme.colors.onSurfaceVariant,
  },
  errorIcon: {
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderRadius: 12,
  },
  scannerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    marginTop: spacing.md,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
  },
  scannerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  scannerIcon: {
    marginBottom: spacing.md,
  },
  placeholderText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: -10,
    left: -10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -10,
    right: -10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -10,
    left: -10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -10,
    right: -10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  instructionsCard: {
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  instructionsTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  instructionsText: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  actionContainer: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: spacing.sm,
  },
  manualEntryCard: {
    ...shadows.sm,
  },
  manualEntryTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  manualEntryText: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  manualEntryButton: {
    alignSelf: 'flex-start',
  },
});
