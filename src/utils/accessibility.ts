import { AccessibilityInfo, Platform } from 'react-native';

// Accessibility utilities
export const accessibility = {
  // Common accessibility props
  button: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  link: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'link' as const,
    accessibilityLabel: label,
    accessibilityHint: hint,
  }),

  text: (label: string) => ({
    accessible: true,
    accessibilityRole: 'text' as const,
    accessibilityLabel: label,
  }),

  heading: (label: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 1) => ({
    accessible: true,
    accessibilityRole: 'header' as const,
    accessibilityLabel: label,
    ...(Platform.OS === 'ios' && { accessibilityTraits: ['header'] }),
  }),

  image: (label: string, decorative: boolean = false) => ({
    accessible: !decorative,
    accessibilityRole: 'image' as const,
    accessibilityLabel: decorative ? undefined : label,
  }),

  textInput: (label: string, value?: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'none' as const, // Let TextInput handle its own role
    accessibilityLabel: label,
    accessibilityValue: value ? { text: value } : undefined,
    accessibilityHint: hint,
  }),

  list: (label: string, size?: number) => ({
    accessible: true,
    accessibilityRole: 'list' as const,
    accessibilityLabel: label,
    ...(size && { accessibilityHint: `Contains ${size} items` }),
  }),

  card: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityRole: 'button' as const,
    accessibilityLabel: label,
    accessibilityHint: hint || 'Double tap to open',
  }),

  // Screen reader announcements
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    } else {
      // Android implementation
      AccessibilityInfo.announceForAccessibility(message);
    }
  },

  // Focus management
  setFocus: (ref: any) => {
    if (ref?.current) {
      AccessibilityInfo.setAccessibilityFocus(ref.current);
    }
  },

  // Check if screen reader is enabled
  isScreenReaderEnabled: (): Promise<boolean> => {
    return AccessibilityInfo.isScreenReaderEnabled();
  },

  // Reduce motion check
  isReduceMotionEnabled: (): Promise<boolean> => {
    return AccessibilityInfo.isReduceMotionEnabled();
  },
};

// Semantic colors for accessibility
export const semanticColors = {
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

// Text scaling utilities
export const textScaling = {
  // Font size multipliers for accessibility
  getScaledSize: (baseSize: number, maxScale: number = 1.3): number => {
    // In a real app, you'd get the actual text scale from AccessibilityInfo
    return Math.min(baseSize * 1.0, baseSize * maxScale);
  },

  // Ensure minimum touch target size (44x44 on iOS, 48x48 on Android)
  minTouchTarget: Platform.OS === 'ios' ? 44 : 48,
};

// ARIA live regions for dynamic content
export const liveRegion = {
  polite: {
    accessibilityLiveRegion: 'polite' as const,
  },
  assertive: {
    accessibilityLiveRegion: 'assertive' as const,
  },
  off: {
    accessibilityLiveRegion: 'none' as const,
  },
};

// Common accessibility states
export const accessibilityStates = {
  selected: (isSelected: boolean) => ({
    accessibilityState: { selected: isSelected },
  }),

  disabled: (isDisabled: boolean) => ({
    accessibilityState: { disabled: isDisabled },
  }),

  expanded: (isExpanded: boolean) => ({
    accessibilityState: { expanded: isExpanded },
  }),

  checked: (isChecked: boolean | 'mixed') => ({
    accessibilityState: { checked: isChecked },
  }),

  busy: (isBusy: boolean) => ({
    accessibilityState: { busy: isBusy },
  }),
};

// Navigation helpers
export const navigationA11y = {
  backButton: (screenName?: string) => accessibility.button(
    'Go back',
    screenName ? `Returns to ${screenName}` : 'Returns to previous screen'
  ),

  tabButton: (tabName: string, isSelected: boolean) => ({
    ...accessibility.button(tabName, `Navigate to ${tabName} tab`),
    ...accessibilityStates.selected(isSelected),
  }),

  menuButton: () => accessibility.button(
    'Open menu',
    'Opens navigation menu'
  ),
};

// Form helpers
export const formA11y = {
  requiredField: (label: string) => ({
    ...accessibility.textInput(label, undefined, 'Required field'),
    accessibilityRequired: true,
  }),

  errorField: (label: string, error: string) => ({
    ...accessibility.textInput(label, undefined, `Error: ${error}`),
    accessibilityInvalid: true,
  }),

  submitButton: (isLoading: boolean = false) => ({
    ...accessibility.button(
      isLoading ? 'Submitting...' : 'Submit',
      isLoading ? 'Please wait' : 'Submit the form'
    ),
    ...accessibilityStates.busy(isLoading),
  }),
};
