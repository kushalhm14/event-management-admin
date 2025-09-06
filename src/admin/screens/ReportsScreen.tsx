import React, { useState } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { 
  Card, 
  Text, 
  Button, 
  ActivityIndicator, 
  useTheme,
  Snackbar,
  SegmentedButtons,
} from 'react-native-paper';
import { useEventPopularity, useTopActiveStudents, useEvents } from '../hooks/useAdminQueries';
import AdminHeader from '../components/AdminHeader';
import Table from '../components/Table';
import { downloadCsv, jsonToCsv, prepareEventDataForCsv } from '../../utils/csv';

// Mock college ID - in real app, this would come from user selection or context
const MOCK_COLLEGE_ID = 'col-1';

const ReportsScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedReport, setSelectedReport] = useState('popularity');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch data
  const { data: popularEvents, isLoading: popularLoading } = useEventPopularity(MOCK_COLLEGE_ID);
  const { data: topStudents, isLoading: studentsLoading } = useTopActiveStudents(MOCK_COLLEGE_ID, 10);
  const { data: allEvents, isLoading: eventsLoading } = useEvents(MOCK_COLLEGE_ID);

  const handleExportCSV = () => {
    if (Platform.OS !== 'web') {
      setSnackbarMessage('CSV export is only available on web');
      return;
    }

    try {
      let data: any[] = [];
      let filename = '';

      switch (selectedReport) {
        case 'popularity':
          data = popularEvents || [];
          filename = 'event_popularity_report.csv';
          break;
        case 'students':
          data = topStudents || [];
          filename = 'top_active_students_report.csv';
          break;
        case 'events':
          data = prepareEventDataForCsv(allEvents || []);
          filename = 'events_report.csv';
          break;
        default:
          data = popularEvents || [];
          filename = 'report.csv';
      }

      if (data.length === 0) {
        setSnackbarMessage('No data available to export');
        return;
      }

      const csvString = jsonToCsv(data);
      downloadCsv(csvString, filename);
      setSnackbarMessage(`${filename} downloaded successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      setSnackbarMessage('Failed to export CSV');
    }
  };

  const renderEventPopularityReport = () => {
    if (popularLoading) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }

    const columns = [
      { key: 'title', label: 'Event Title', width: 300 },
      { key: 'registrations', label: 'Registrations', width: 150 },
    ];

    return (
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Event Popularity Report" />
        <Card.Content>
          <Text style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
            Events ranked by number of registrations
          </Text>
          
          {popularEvents && popularEvents.length > 0 ? (
            <Table
              columns={columns}
              data={popularEvents}
              pagination={true}
            />
          ) : (
            <Text>No events found</Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderTopStudentsReport = () => {
    if (studentsLoading) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }

    const columns = [
      { key: 'name', label: 'Student Name', width: 200 },
      { key: 'event_count', label: 'Events Attended', width: 150 },
      { key: 'attendance_rate', label: 'Attendance Rate', width: 150 },
    ];

    const renderCell = (row: any, colKey: string) => {
      if (colKey === 'attendance_rate') {
        return <Text>{Math.round(row.attendance_rate * 100)}%</Text>;
      }
      return <Text>{row[colKey]}</Text>;
    };

    return (
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Top Active Students" />
        <Card.Content>
          <Text style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
            Most active students by event participation and attendance
          </Text>
          
          {topStudents && topStudents.length > 0 ? (
            <Table
              columns={columns}
              data={topStudents}
              renderCell={renderCell}
              pagination={true}
            />
          ) : (
            <Text>No students found</Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderEventsReport = () => {
    if (eventsLoading) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }

    const columns = [
      { key: 'title', label: 'Event Title', width: 200 },
      { key: 'type', label: 'Type', width: 120 },
      { key: 'status', label: 'Status', width: 120 },
      { key: 'registrations_count', label: 'Registrations', width: 120 },
      { key: 'capacity', label: 'Capacity', width: 100 },
    ];

    return (
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="All Events Report" />
        <Card.Content>
          <Text style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
            Complete list of all events with basic statistics
          </Text>
          
          {allEvents && allEvents.length > 0 ? (
            <Table
              columns={columns}
              data={allEvents}
              pagination={true}
            />
          ) : (
            <Text>No events found</Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderCurrentReport = () => {
    switch (selectedReport) {
      case 'popularity':
        return renderEventPopularityReport();
      case 'students':
        return renderTopStudentsReport();
      case 'events':
        return renderEventsReport();
      default:
        return renderEventPopularityReport();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <AdminHeader title="Reports" subtitle="Analytics and Data Export" />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Report Type Selector */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <SegmentedButtons
              value={selectedReport}
              onValueChange={setSelectedReport}
              buttons={[
                {
                  value: 'popularity',
                  label: 'Event Popularity',
                },
                {
                  value: 'students',
                  label: 'Top Students',
                },
                {
                  value: 'events',
                  label: 'All Events',
                },
              ]}
            />
          </Card.Content>
        </Card>

        {/* Export Section */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  Export Data
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Download the current report as a CSV file
                </Text>
              </View>
              <Button 
                mode="contained" 
                icon="download"
                onPress={handleExportCSV}
              >
                Export CSV
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Current Report */}
        {renderCurrentReport()}

        {/* Summary Statistics */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Quick Statistics" />
          <Card.Content>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 16 
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {allEvents?.length || 0}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Total Events
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {popularEvents?.reduce((sum, event) => sum + event.registrations, 0) || 0}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Total Registrations
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {topStudents?.length || 0}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Active Students
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

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

export default ReportsScreen;
