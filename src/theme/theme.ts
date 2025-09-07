import { MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';
import { typography } from './typography';

// Professional theme for the event platform
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryContainer,
    onPrimary: colors.onPrimary,
    onPrimaryContainer: colors.onPrimaryContainer,
    
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondary: colors.onSecondary,
    onSecondaryContainer: colors.onSecondaryContainer,
    
    tertiary: colors.success,
    tertiaryContainer: colors.successContainer,
    onTertiary: colors.onSuccess,
    onTertiaryContainer: colors.onSuccessContainer,
    
    error: colors.error,
    errorContainer: colors.errorContainer,
    onError: colors.onError,
    onErrorContainer: colors.onErrorContainer,
    
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
    
    background: colors.background,
    onBackground: colors.onBackground,
    
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
    
    // Custom colors
    success: colors.success,
    successContainer: colors.successContainer,
    onSuccess: colors.onSuccess,
    onSuccessContainer: colors.onSuccessContainer,
    
    warning: colors.warning,
    warningContainer: colors.warningContainer,
    onWarning: colors.onWarning,
    onWarningContainer: colors.onWarningContainer,
    
    info: colors.info,
    infoContainer: colors.infoContainer,
    onInfo: colors.onInfo,
    onInfoContainer: colors.onInfoContainer,
  },
  roundness: 12,
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
};

// Shadow system
export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  xl: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export default theme;
