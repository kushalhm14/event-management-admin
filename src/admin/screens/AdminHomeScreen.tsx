import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { useDashboardStats, useEventPopularity, useTopActiveStudents } from '../hooks/useAdminQueries';
import AdminHeader from '../components/AdminHeader';

// Mock college ID - in real app, this would come from user selection or context
const MOCK_COLLEGE_ID = 'col-1';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  onPress,
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      style={{ 
        margin: 8, 
        minWidth: 200, 
        flex: 1,
      }}
      onPress={onPress}
    >
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {title}
            </Text>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginVertical: 4 }}>
              {value}
            </Text>
            {subtitle && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const AdminHomeScreen: React.FC = () => {
  const theme = useTheme();
  
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useDashboardStats(MOCK_COLLEGE_ID);
  const { data: popularEvents, isLoading: popularEventsLoading } = useEventPopularity(MOCK_COLLEGE_ID, undefined, 3);
  const { data: topStudents, isLoading: topStudentsLoading } = useTopActiveStudents(MOCK_COLLEGE_ID, 3);

  if (statsLoading) {
    return (
      <View style={{ flex: 1 }}>
        <AdminHeader title="Admin Dashboard" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <AdminHeader title="Admin Dashboard" subtitle="Event Management System" />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Main Stats Cards */}
        <Text variant="headlineSmall" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Overview
        </Text>
        
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between',
          marginBottom: 24 
        }}>
          <DashboardCard
            title="Total Events"
            value={stats?.total_events || 0}
            subtitle="All events"
          />
          <DashboardCard
            title="Total Students"
            value={stats?.total_students || 0}
            subtitle="Registered students"
          />
          <DashboardCard
            title="Total Registrations"
            value={stats?.total_registrations || 0}
            subtitle="All time"
          />
          <DashboardCard
            title="Upcoming Events"
            value={stats?.upcoming_events || 0}
            subtitle="This month"
          />
        </View>

        {/* Popular Events Section */}
        <Text variant="headlineSmall" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Most Popular Events
        </Text>
        
        {popularEventsLoading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ marginBottom: 24 }}>
            {popularEvents?.slice(0, 3).map((event, index) => (
              <Card key={event.event_id} style={{ marginBottom: 8 }}>
                <Card.Content>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        {index + 1}. {event.title}
                      </Text>
                      <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                        {event.registrations} registrations
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Top Students Section */}
        <Text variant="headlineSmall" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Most Active Students
        </Text>
        
        {topStudentsLoading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ marginBottom: 24 }}>
            {topStudents?.slice(0, 3).map((student, index) => (
              <Card key={student.student_id} style={{ marginBottom: 8 }}>
                <Card.Content>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        {index + 1}. {student.name}
                      </Text>
                      <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                        {student.event_count} events • {Math.round(student.attendance_rate * 100)}% attendance
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <Text variant="headlineSmall" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Quick Actions
        </Text>
        
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: 12,
          marginBottom: 24 
        }}>
          <Button 
            mode="contained" 
            icon="calendar-plus"
            style={{ flex: 1, minWidth: 150 }}
            onPress={() => {
              // Navigate to create event
            }}
          >
            Create Event
          </Button>
          
          <Button 
            mode="outlined" 
            icon="account-plus"
            style={{ flex: 1, minWidth: 150 }}
            onPress={() => {
              // Navigate to create student
            }}
          >
            Add Student
          </Button>
          
          <Button 
            mode="outlined" 
            icon="chart-line"
            style={{ flex: 1, minWidth: 150 }}
            onPress={() => {
              // Navigate to reports
            }}
          >
            View Reports
          </Button>
          
          <Button 
            mode="outlined" 
            icon="calendar-check"
            style={{ flex: 1, minWidth: 150 }}
            onPress={() => {
              // Navigate to events
            }}
          >
            Manage Events
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminHomeScreen;
