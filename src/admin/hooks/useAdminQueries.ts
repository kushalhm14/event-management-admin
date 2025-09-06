import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import {
  College,
  Event,
  EventFormData,
  Student,
  StudentFormData,
  Registration,
  AttendanceUpdate,
  AdminDashboardStats,
  PopularEvent,
  TopStudent,
  EventSummary,
} from '../../types/admin';

// Query keys
export const adminQueryKeys = {
  colleges: ['colleges'],
  events: (collegeId: string) => ['events', collegeId],
  eventDetails: (eventId: string) => ['event', eventId],
  registrations: (eventId: string) => ['registrations', eventId],
  students: (collegeId: string) => ['students', collegeId],
  studentParticipation: (studentId: string) => ['student-participation', studentId],
  dashboardStats: (collegeId: string) => ['dashboard-stats', collegeId],
  eventPopularity: (collegeId: string, type?: string) => ['event-popularity', collegeId, type],
  topStudents: (collegeId: string) => ['top-students', collegeId],
  eventSummary: (eventId: string) => ['event-summary', eventId],
  eventFeedback: (eventId: string) => ['event-feedback', eventId],
};

// Colleges
export const useColleges = () => {
  return useQuery({
    queryKey: adminQueryKeys.colleges,
    queryFn: adminApi.getColleges,
  });
};

// Events
export const useEvents = (collegeId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.events(collegeId),
    queryFn: () => adminApi.getEvents(collegeId),
    enabled: !!collegeId,
  });
};

export const useEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.eventDetails(eventId),
    queryFn: () => adminApi.getEventDetails(eventId),
    enabled: !!eventId,
  });
};

export const useCreateEvent = (collegeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EventFormData) => adminApi.createEvent(collegeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.events(collegeId) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboardStats(collegeId) });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Partial<EventFormData> }) =>
      adminApi.updateEvent(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.eventDetails(variables.eventId) });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

// Registrations & Attendance
export const useEventRegistrations = (eventId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.registrations(eventId),
    queryFn: () => adminApi.getEventRegistrations(eventId),
    enabled: !!eventId,
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ registrationId, data }: { registrationId: string; data: AttendanceUpdate }) =>
      adminApi.updateAttendance(registrationId, data),
    onSuccess: (_, variables) => {
      // Invalidate queries that depend on attendance data
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-summary'] });
    },
  });
};

export const useBulkUpdateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ registrationIds, status, markedBy }: { 
      registrationIds: string[]; 
      status: string; 
      markedBy: string; 
    }) => adminApi.bulkUpdateAttendance(registrationIds, status, markedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-summary'] });
    },
  });
};

// Students
export const useStudents = (collegeId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.students(collegeId),
    queryFn: () => adminApi.getStudents(collegeId),
    enabled: !!collegeId,
  });
};

export const useCreateStudent = (collegeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StudentFormData) => adminApi.createStudent(collegeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.students(collegeId) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboardStats(collegeId) });
    },
  });
};

export const useStudentParticipation = (studentId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.studentParticipation(studentId),
    queryFn: () => adminApi.getStudentParticipation(studentId),
    enabled: !!studentId,
  });
};

// Reports
export const useDashboardStats = (collegeId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.dashboardStats(collegeId),
    queryFn: () => adminApi.getDashboardStats(collegeId),
    enabled: !!collegeId,
  });
};

export const useEventPopularity = (collegeId: string, type?: string, limit?: number) => {
  return useQuery({
    queryKey: adminQueryKeys.eventPopularity(collegeId, type),
    queryFn: () => adminApi.getEventPopularity(collegeId, type, limit),
    enabled: !!collegeId,
  });
};

export const useTopActiveStudents = (collegeId: string, limit: number = 3) => {
  return useQuery({
    queryKey: adminQueryKeys.topStudents(collegeId),
    queryFn: () => adminApi.getTopActiveStudents(collegeId, limit),
    enabled: !!collegeId,
  });
};

export const useEventSummary = (eventId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.eventSummary(eventId),
    queryFn: () => adminApi.getEventSummary(eventId),
    enabled: !!eventId,
  });
};

// Feedback
export const useEventFeedback = (eventId: string) => {
  return useQuery({
    queryKey: adminQueryKeys.eventFeedback(eventId),
    queryFn: () => adminApi.getEventFeedback(eventId),
    enabled: !!eventId,
  });
};
