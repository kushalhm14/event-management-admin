import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  useTheme,
} from 'react-native-paper';
import { Event } from '../../types/student';

interface RegistrationButtonProps {
  event: Event;
  isRegistered: boolean;
  isLoading: boolean;
  onPress: () => void;
}

/**
 * Registration button component with different states
 */
export const RegistrationButton: React.FC<RegistrationButtonProps> = ({
  event,
  isRegistered,
  isLoading,
  onPress,
}) => {
  const theme = useTheme();

  const getButtonProps = () => {
    if (isRegistered) {
      return {
        mode: 'outlined' as const,
        disabled: true,
        icon: 'check-circle',
        text: 'Already Registered',
        style: { borderColor: theme.colors.primary },
        textColor: theme.colors.primary,
      };
    }

    if (event.status === 'cancelled') {
      return {
        mode: 'outlined' as const,
        disabled: true,
        icon: 'cancel',
        text: 'Event Cancelled',
        style: { borderColor: theme.colors.error },
        textColor: theme.colors.error,
      };
    }

    if (event.status === 'completed') {
      return {
        mode: 'outlined' as const,
        disabled: true,
        icon: 'clock',
        text: 'Event Completed',
        style: { borderColor: theme.colors.outline },
        textColor: theme.colors.outline,
      };
    }

    const isEventFull = event.registered_count >= event.capacity;
    
    if (isEventFull) {
      return {
        mode: 'outlined' as const,
        disabled: true,
        icon: 'account-group',
        text: 'Event Full',
        style: { borderColor: theme.colors.error },
        textColor: theme.colors.error,
      };
    }

    return {
      mode: 'contained' as const,
      disabled: isLoading,
      icon: isLoading ? undefined : 'plus',
      text: isLoading ? 'Registering...' : 'Register',
      style: {},
      textColor: undefined,
    };
  };

  const buttonProps = getButtonProps();

  return (
    <View style={styles.container}>
      <Button
        mode={buttonProps.mode}
        icon={buttonProps.icon}
        onPress={onPress}
        disabled={buttonProps.disabled}
        loading={isLoading}
        style={[styles.button, buttonProps.style]}
        labelStyle={buttonProps.textColor ? { color: buttonProps.textColor } : undefined}
      >
        {buttonProps.text}
      </Button>
      
      {!isRegistered && event.status === 'active' && (
        <View style={styles.infoContainer}>
          <Text variant="bodySmall" style={styles.infoText}>
            {event.capacity - event.registered_count} of {event.capacity} spots available
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  infoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default RegistrationButton;
