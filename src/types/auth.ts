export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'organizer';
  avatar?: string;
  createdAt: string;
  lastActive: string;
  verified: boolean;
  
  // Student specific fields
  studentId?: string;
  course?: string;
  year?: number;
  
  // Admin/Organizer specific fields
  department?: string;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'student' | 'admin' | 'organizer';
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'admin' | 'organizer';
  
  // Student specific
  studentId?: string;
  course?: string;
  year?: number;
  
  // Admin/Organizer specific
  department?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  
  // Student specific
  course?: string;
  year?: number;
  
  // Admin/Organizer specific
  department?: string;
}
