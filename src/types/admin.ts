// Admin Portal Types
export interface College {
  id: string;
  name: string;
  created_at: string;
}

export interface Event {
  id: string;
  college_id: string;
  title: string;
  description: string;
  type: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  created_at: string;
  registrations_count?: number;
}

export interface EventFormData {
  title: string;
  description: string;
  type: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  status?: 'scheduled' | 'cancelled' | 'completed';
}

export interface Student {
  id: string;
  college_id: string;
  name: string;
  roll_no: string;
  email: string;
  created_at: string;
}

export interface StudentFormData {
  name: string;
  roll_no: string;
  email: string;
}

export interface Registration {
  registration_id: string;
  student_id: string;
  name: string;
  roll_no: string;
  email: string;
  registered_at: string;
  attendance_status: 'present' | 'absent' | 'excused' | null;
  feedback?: {
    rating: number;
    comment: string;
  };
}

export interface AttendanceUpdate {
  status: 'present' | 'absent' | 'excused';
  marked_by: string;
}

export interface EventSummary {
  event_id: string;
  title: string;
  registrations: number;
  attendees: number;
  attendance_percent: number;
  avg_feedback?: number;
}

export interface PopularEvent {
  event_id: string;
  title: string;
  registrations: number;
}

export interface TopStudent {
  student_id: string;
  name: string;
  event_count: number;
  attendance_rate: number;
}

export interface AdminDashboardStats {
  total_events: number;
  total_registrations: number;
  total_students: number;
  upcoming_events: number;
}

export interface TableColumn {
  key: string;
  label: string;
  width?: string | number;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  renderCell?: (row: any, colKey: string) => React.ReactNode;
  onRowSelect?: (selectedRows: any[]) => void;
  selectable?: boolean;
  pagination?: boolean;
}
