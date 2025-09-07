// Professional color palette for the event platform
export const colors = {
  // Primary colors
  primary: '#0B6FF2', // Vivid Blue
  primaryContainer: '#E3F2FD',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0B6FF2',

  // Secondary/Accent colors  
  secondary: '#FFB020', // Warm Gold
  secondaryContainer: '#FFF8E1',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#FFB020',

  // Status colors
  success: '#16A34A', // Green
  successContainer: '#F0FDF4',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#16A34A',

  error: '#EF4444', // Red
  errorContainer: '#FEF2F2',
  onError: '#FFFFFF',
  onErrorContainer: '#EF4444',

  warning: '#F59E0B', // Amber
  warningContainer: '#FFFBEB',
  onWarning: '#FFFFFF',
  onWarningContainer: '#F59E0B',

  info: '#3B82F6', // Blue
  infoContainer: '#EFF6FF',
  onInfo: '#FFFFFF',
  onInfoContainer: '#3B82F6',

  // Surface colors
  surface: '#FFFFFF',
  surfaceVariant: '#F7FAFC', // Light Grey
  onSurface: '#0F172A', // Dark Slate
  onSurfaceVariant: '#64748B',

  // Background colors
  background: '#F7FAFC',
  onBackground: '#0F172A',

  // Outline colors
  outline: '#CBD5E1',
  outlineVariant: '#E2E8F0',

  // Additional semantic colors
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Event type colors
  eventTypes: {
    workshop: '#8B5CF6', // Purple
    seminar: '#06B6D4', // Cyan
    hackathon: '#F59E0B', // Amber
    meetup: '#10B981', // Emerald
    fest: '#EC4899', // Pink
    sports: '#EF4444', // Red
    cultural: '#8B5CF6', // Purple
  },

  // Status colors for events
  eventStatus: {
    draft: '#94A3B8', // Gray
    pending: '#F59E0B', // Amber
    published: '#16A34A', // Green
    cancelled: '#EF4444', // Red
    completed: '#64748B', // Slate
  },

  // Gradient colors
  gradients: {
    primary: ['#0B6FF2', '#3B82F6'],
    secondary: ['#FFB020', '#F59E0B'],
    success: ['#16A34A', '#10B981'],
    hero: ['#0B6FF2', '#8B5CF6'],
  },
};

// Dark theme colors (for future use)
export const darkColors = {
  ...colors,
  surface: '#1E293B',
  surfaceVariant: '#334155',
  background: '#0F172A',
  onSurface: '#F8FAFC',
  onBackground: '#F8FAFC',
  outline: '#475569',
  outlineVariant: '#334155',
};

export default colors;
