import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Portal,
  Modal,
  Card,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import { useCreateEvent, useUpdateEvent } from '../hooks/useAdminQueries';
import { Event, EventFormData } from '../../types/admin';

// Mock college ID - in real app, this would come from user selection or context
const MOCK_COLLEGE_ID = 'col-1';

interface EventFormModalProps {
  visible: boolean;
  event?: Event | null;
  onDismiss: () => void;
  onSuccess: (message: string) => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  type?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  capacity?: string;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  visible,
  event,
  onDismiss,
  onSuccess,
}) => {
  const isEditing = !!event;
  const createEventMutation = useCreateEvent(MOCK_COLLEGE_ID);
  const updateEventMutation = useUpdateEvent();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    type: '',
    start_time: '',
    end_time: '',
    location: '',
    capacity: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        type: event.type,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        capacity: event.capacity,
      });
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        type: '',
        start_time: '',
        end_time: '',
        location: '',
        capacity: 0,
      });
    }
    setErrors({});
  }, [event, visible]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Event type is required';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (formData.start_time && formData.end_time) {
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      
      if (startDate >= endDate) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.capacity < 0) {
      newErrors.capacity = 'Capacity must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && event) {
        await updateEventMutation.mutateAsync({
          eventId: event.id,
          data: formData,
        });
        onSuccess('Event updated successfully');
      } else {
        await createEventMutation.mutateAsync(formData);
        onSuccess('Event created successfully');
      }
      onDismiss();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createEventMutation.isPending || updateEventMutation.isPending;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: 'white',
          margin: 20,
          borderRadius: 8,
          maxHeight: '90%',
        }}
      >
        <Card>
          <Card.Title title={isEditing ? 'Edit Event' : 'Create New Event'} />
          <Card.Content>
            <ScrollView style={{ maxHeight: 500 }}>
              <TextInput
                label="Event Title *"
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                mode="outlined"
                error={!!errors.title}
                style={{ marginBottom: 8 }}
              />
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>

              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={{ marginBottom: 16 }}
              />

              <TextInput
                label="Event Type *"
                value={formData.type}
                onChangeText={(text) => setFormData(prev => ({ ...prev, type: text }))}
                mode="outlined"
                error={!!errors.type}
                placeholder="e.g., Workshop, Seminar, Conference"
                style={{ marginBottom: 8 }}
              />
              <HelperText type="error" visible={!!errors.type}>
                {errors.type}
              </HelperText>

              <TextInput
                label="Start Time *"
                value={formData.start_time}
                onChangeText={(text) => setFormData(prev => ({ ...prev, start_time: text }))}
                mode="outlined"
                error={!!errors.start_time}
                placeholder="YYYY-MM-DDTHH:MM:SS"
                style={{ marginBottom: 8 }}
              />
              <HelperText type="error" visible={!!errors.start_time}>
                {errors.start_time}
              </HelperText>

              <TextInput
                label="End Time *"
                value={formData.end_time}
                onChangeText={(text) => setFormData(prev => ({ ...prev, end_time: text }))}
                mode="outlined"
                error={!!errors.end_time}
                placeholder="YYYY-MM-DDTHH:MM:SS"
                style={{ marginBottom: 8 }}
              />
              <HelperText type="error" visible={!!errors.end_time}>
                {errors.end_time}
              </HelperText>

              <TextInput
                label="Location *"
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                mode="outlined"
                error={!!errors.location}
                style={{ marginBottom: 8 }}
              />
              <HelperText type="error" visible={!!errors.location}>
                {errors.location}
              </HelperText>

              <TextInput
                label="Capacity"
                value={formData.capacity.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setFormData(prev => ({ ...prev, capacity: num }));
                }}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.capacity}
                style={{ marginBottom: 8 }}
              />
              <HelperText type="error" visible={!!errors.capacity}>
                {errors.capacity}
              </HelperText>
            </ScrollView>
          </Card.Content>
          
          <Card.Actions style={{ justifyContent: 'space-between', padding: 16 }}>
            <Button mode="outlined" onPress={onDismiss} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export default EventFormModal;
