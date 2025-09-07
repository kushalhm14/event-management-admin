import axios from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types/auth';
import { mockAuthData } from './mockAuthData';

const USE_MOCK_DATA = true; // Toggle this for real backend integration

// Mock delay for realistic API simulation
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock error simulation
const simulateError = (rate: number = 0.1) => {
  if (Math.random() < rate) {
    throw new Error('Network error - please try again');
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    simulateError(0.05); // 5% error rate
    
    const user = mockAuthData.users.find(
      (u: User) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In real implementation, password would be hashed and compared
    if (credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    
    // Check role if specified
    if (credentials.role && user.role !== credentials.role) {
      throw new Error(`Access denied for ${credentials.role} portal`);
    }
    
    const token = `mock_token_${user.id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    return {
      user: {
        ...user,
        lastActive: new Date().toISOString(),
      },
      token,
      expiresAt,
    };
  }

  // Real API implementation
  const response = await axios.post('/api/auth/login', credentials);
  return response.data;
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  if (USE_MOCK_DATA) {
    await mockDelay(1200);
    simulateError(0.05);
    
    // Check if user already exists
    const existingUser = mockAuthData.users.find(
      (u: User) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Validate passwords match
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: credentials.email.toLowerCase(),
      name: credentials.name,
      role: credentials.role,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verified: false, // Email verification required
      
      // Role-specific fields
      ...(credentials.role === 'student' && {
        studentId: credentials.studentId,
        course: credentials.course,
        year: credentials.year,
      }),
      ...(credentials.role !== 'student' && {
        department: credentials.department,
        permissions: getDefaultPermissions(credentials.role),
      }),
    };
    
    // Add to mock data (in real app, this would be saved to database)
    mockAuthData.users.push(newUser);
    
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    return {
      user: newUser,
      token,
      expiresAt,
    };
  }

  // Real API implementation
  const response = await axios.post('/api/auth/signup', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay(300);
    return;
  }

  // Real API implementation
  await axios.post('/api/auth/logout');
};

export const refreshToken = async (): Promise<AuthResponse> => {
  if (USE_MOCK_DATA) {
    await mockDelay(500);
    simulateError(0.02);
    
    // Mock token refresh - in real app, validate current token first
    const mockUser = mockAuthData.users[0]; // Simplified for mock
    const token = `mock_token_${mockUser.id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    return {
      user: mockUser,
      token,
      expiresAt,
    };
  }

  // Real API implementation
  const response = await axios.post('/api/auth/refresh');
  return response.data;
};

export const forgotPassword = async (request: ForgotPasswordRequest): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    simulateError(0.05);
    
    const user = mockAuthData.users.find(
      (u: User) => u.email.toLowerCase() === request.email.toLowerCase()
    );
    
    if (!user) {
      // Don't reveal if email exists for security
      return;
    }
    
    // In real app, send password reset email
    console.log(`Password reset email sent to ${request.email}`);
    return;
  }

  // Real API implementation
  await axios.post('/api/auth/forgot-password', request);
};

export const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    simulateError(0.05);
    
    if (request.password !== request.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // In real app, validate reset token and update password
    console.log('Password reset successfully');
    return;
  }

  // Real API implementation
  await axios.post('/api/auth/reset-password', request);
};

export const verifyEmail = async (request: VerifyEmailRequest): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    simulateError(0.05);
    
    // In real app, validate verification token and mark email as verified
    console.log('Email verified successfully');
    return;
  }

  // Real API implementation
  await axios.post('/api/auth/verify-email', request);
};

export const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    simulateError(0.05);
    
    if (request.newPassword !== request.confirmPassword) {
      throw new Error('New passwords do not match');
    }
    
    // In real app, validate current password and update
    console.log('Password changed successfully');
    return;
  }

  // Real API implementation
  await axios.patch('/api/auth/change-password', request);
};

export const updateProfile = async (request: UpdateProfileRequest): Promise<User> => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    simulateError(0.05);
    
    // Find and update user in mock data
    const userIndex = mockAuthData.users.findIndex((u: User) => u.id === 'student1'); // Simplified
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockAuthData.users[userIndex],
      ...request,
      lastActive: new Date().toISOString(),
    };
    
    mockAuthData.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // Real API implementation
  const response = await axios.patch('/api/auth/profile', request);
  return response.data;
};

// Helper function to get default permissions based on role
const getDefaultPermissions = (role: string): string[] => {
  switch (role) {
    case 'admin':
      return [
        'manage_events',
        'manage_users',
        'view_reports',
        'manage_system',
        'export_data',
      ];
    case 'organizer':
      return [
        'manage_events',
        'view_reports',
        'export_data',
      ];
    default:
      return [];
  }
};
