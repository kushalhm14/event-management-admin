import { Platform } from 'react-native';

// Typography system for the event platform
export const typography = {
  // Font families
  fontFamily: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      web: 'Inter, system-ui, -apple-system, sans-serif',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Medium',
      web: 'Inter, system-ui, -apple-system, sans-serif',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Bold',
      web: 'Inter, system-ui, -apple-system, sans-serif',
      default: 'System',
    }),
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'monospace',
      web: 'Fira Code, Consolas, monospace',
      default: 'monospace',
    }),
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },

  // Text styles for common use cases
  styles: {
    // Display styles
    displayLarge: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    displayMedium: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      letterSpacing: -0.25,
    },
    displaySmall: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '600',
      letterSpacing: 0,
    },

    // Headline styles
    headlineLarge: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '600',
      letterSpacing: 0,
    },
    headlineMedium: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600',
      letterSpacing: 0,
    },
    headlineSmall: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
      letterSpacing: 0,
    },

    // Title styles
    titleLarge: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '500',
      letterSpacing: 0,
    },
    titleMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      letterSpacing: 0.25,
    },
    titleSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      letterSpacing: 0.25,
    },

    // Body styles
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      letterSpacing: 0,
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0.25,
    },

    // Label styles
    labelLarge: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      letterSpacing: 0.25,
    },
    labelMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '500',
      letterSpacing: 0.5,
    },

    // Button styles
    button: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      letterSpacing: 0.25,
      textTransform: 'uppercase' as const,
    },

    // Caption styles
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0.25,
    },

    // Overline styles
    overline: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },
};

export default typography;
