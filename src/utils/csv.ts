/**
 * Utility functions for CSV export functionality
 */

/**
 * Convert JSON data to CSV format
 * @param rows Array of objects to convert to CSV
 * @param columns Optional array of column keys to include (uses all keys if not provided)
 * @returns CSV string
 */
export const jsonToCsv = (rows: any[], columns?: string[]): string => {
  if (!rows || !rows.length) return '';
  
  const keys = columns ?? Object.keys(rows[0]);
  const header = keys.join(',');
  
  const lines = rows.map(r => 
    keys.map(k => {
      const v = r[k] ?? '';
      const safe = typeof v === 'string' ? v.replace(/"/g, '""') : v;
      return `"${safe}"`;
    }).join(',')
  );
  
  return [header, ...lines].join('\n');
};

/**
 * Download CSV file in browser (web only)
 * @param csvString CSV content as string
 * @param filename Name of the file to download
 */
export const downloadCsv = (csvString: string, filename: string = 'report.csv'): void => {
  if (typeof window === 'undefined') {
    console.warn('downloadCsv is only available in web environment');
    return;
  }
  
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/**
 * Format date for CSV export
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDateForCsv = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch {
    return dateString;
  }
};

/**
 * Flatten nested object for CSV export
 * @param obj Object to flatten
 * @param prefix Prefix for flattened keys
 * @returns Flattened object
 */
export const flattenObject = (obj: any, prefix: string = ''): any => {
  const flattened: any = {};
  
  Object.keys(obj).forEach(key => {
    const newKey = prefix ? `${prefix}_${key}` : key;
    
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else {
      flattened[newKey] = obj[key];
    }
  });
  
  return flattened;
};

/**
 * Prepare event data for CSV export
 * @param events Array of events
 * @returns Formatted data for CSV
 */
export const prepareEventDataForCsv = (events: any[]): any[] => {
  return events.map(event => ({
    id: event.id,
    title: event.title,
    type: event.type,
    start_time: formatDateForCsv(event.start_time),
    end_time: formatDateForCsv(event.end_time),
    location: event.location,
    capacity: event.capacity,
    status: event.status,
    registrations_count: event.registrations_count || 0,
    created_at: formatDateForCsv(event.created_at),
  }));
};

/**
 * Prepare registration data for CSV export
 * @param registrations Array of registrations
 * @returns Formatted data for CSV
 */
export const prepareRegistrationDataForCsv = (registrations: any[]): any[] => {
  return registrations.map(reg => ({
    registration_id: reg.registration_id,
    student_name: reg.name,
    roll_no: reg.roll_no,
    email: reg.email,
    registered_at: formatDateForCsv(reg.registered_at),
    attendance_status: reg.attendance_status || 'Not marked',
    feedback_rating: reg.feedback?.rating || '',
    feedback_comment: reg.feedback?.comment || '',
  }));
};

/**
 * Prepare student data for CSV export
 * @param students Array of students
 * @returns Formatted data for CSV
 */
export const prepareStudentDataForCsv = (students: any[]): any[] => {
  return students.map(student => ({
    id: student.id,
    name: student.name,
    roll_no: student.roll_no,
    email: student.email,
    created_at: formatDateForCsv(student.created_at),
  }));
};
