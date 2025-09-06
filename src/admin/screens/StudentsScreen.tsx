import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { 
  FAB, 
  Button, 
  Text, 
  ActivityIndicator, 
  useTheme,
  Snackbar,
  Portal,
  Modal,
  Card,
  TextInput,
  HelperText,
} from 'react-native-paper';
import { useStudents, useCreateStudent } from '../hooks/useAdminQueries';
import { Student, StudentFormData } from '../../types/admin';
import AdminHeader from '../components/AdminHeader';
import Table from '../components/Table';

// Mock college ID - in real app, this would come from user selection or context
const MOCK_COLLEGE_ID = 'col-1';

interface FormErrors {
  name?: string;
  roll_no?: string;
  email?: string;
}

const StudentsScreen: React.FC = () => {
  const theme = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    roll_no: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch students data
  const { data: students, isLoading, error } = useStudents(MOCK_COLLEGE_ID);
  const createStudentMutation = useCreateStudent(MOCK_COLLEGE_ID);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.roll_no.trim()) {
      newErrors.roll_no = 'Roll number is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateStudent = async () => {
    if (!validateForm()) return;

    try {
      await createStudentMutation.mutateAsync(formData);
      setSnackbarMessage('Student created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', roll_no: '', email: '' });
      setErrors({});
    } catch (error) {
      setSnackbarMessage('Failed to create student');
    }
  };

  const handleViewParticipation = (student: Student) => {
    // In a full implementation, this would navigate to student details
    setSnackbarMessage(`Viewing participation for ${student.name}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'roll_no', label: 'Roll Number', width: 150 },
    { key: 'email', label: 'Email', width: 250 },
    { key: 'created_at', label: 'Registered', width: 120 },
    { key: 'actions', label: 'Actions', width: 150 },
  ];

  const renderCell = (row: Student, colKey: string) => {
    switch (colKey) {
      case 'created_at':
        return <Text>{formatDate(row.created_at)}</Text>;
      
      case 'actions':
        return (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              mode="outlined"
              compact
              onPress={() => handleViewParticipation(row)}
            >
              View
            </Button>
          </View>
        );
      
      default:
        return <Text>{String((row as any)[colKey] || '')}</Text>;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <AdminHeader title="Students" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Loading students...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <AdminHeader title="Students" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ textAlign: 'center', marginBottom: 16 }}>
            Failed to load students. Please try again.
          </Text>
          <Button mode="contained" onPress={() => window.location.reload()}>
            Retry
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <AdminHeader title="Students" subtitle={`${students?.length || 0} students`} />
      
      <View style={{ flex: 1, padding: 16 }}>
        {students && students.length > 0 ? (
          <Table
            columns={columns}
            data={students}
            renderCell={renderCell}
            pagination={true}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
              No students found
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
              Add your first student to get started.
            </Text>
            <Button 
              mode="contained" 
              icon="account-plus"
              onPress={() => setShowCreateModal(true)}
            >
              Add First Student
            </Button>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => setShowCreateModal(true)}
      />

      {/* Create Student Modal */}
      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 8,
            maxHeight: '90%',
          }}
        >
          <Card>
            <Card.Title title="Add New Student" />
            <Card.Content>
              <ScrollView style={{ maxHeight: 400 }}>
                <TextInput
                  label="Student Name *"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  mode="outlined"
                  error={!!errors.name}
                  style={{ marginBottom: 8 }}
                />
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name}
                </HelperText>

                <TextInput
                  label="Roll Number *"
                  value={formData.roll_no}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, roll_no: text }))}
                  mode="outlined"
                  error={!!errors.roll_no}
                  style={{ marginBottom: 8 }}
                />
                <HelperText type="error" visible={!!errors.roll_no}>
                  {errors.roll_no}
                </HelperText>

                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  mode="outlined"
                  error={!!errors.email}
                  keyboardType="email-address"
                  style={{ marginBottom: 8 }}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>
              </ScrollView>
            </Card.Content>
            
            <Card.Actions style={{ justifyContent: 'space-between', padding: 16 }}>
              <Button 
                mode="outlined" 
                onPress={() => setShowCreateModal(false)}
                disabled={createStudentMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleCreateStudent}
                loading={createStudentMutation.isPending}
                disabled={createStudentMutation.isPending}
              >
                Add Student
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage('')}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default StudentsScreen;
