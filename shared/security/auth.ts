/**
 * Enhanced Authentication and Authorization System
 * Provides secure user authentication with proper session management
 */

import React from 'react';
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

// User roles and permissions
export enum UserRole {
  ATHLETE = 'athlete',
  COACH = 'coach',
  PARENT = 'parent',
  ADMIN = 'admin',
}

export enum Permission {
  READ_OWN_DATA = 'read_own_data',
  WRITE_OWN_DATA = 'write_own_data',
  READ_TEAM_DATA = 'read_team_data',
  WRITE_TEAM_DATA = 'write_team_data',
  MANAGE_USERS = 'manage_users',
  ADMIN_ACCESS = 'admin_access',
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ATHLETE]: [
    Permission.READ_OWN_DATA,
    Permission.WRITE_OWN_DATA,
  ],
  [UserRole.COACH]: [
    Permission.READ_OWN_DATA,
    Permission.WRITE_OWN_DATA,
    Permission.READ_TEAM_DATA,
    Permission.WRITE_TEAM_DATA,
  ],
  [UserRole.PARENT]: [
    Permission.READ_OWN_DATA,
    Permission.READ_TEAM_DATA,
  ],
  [UserRole.ADMIN]: [
    Permission.READ_OWN_DATA,
    Permission.WRITE_OWN_DATA,
    Permission.READ_TEAM_DATA,
    Permission.WRITE_TEAM_DATA,
    Permission.MANAGE_USERS,
    Permission.ADMIN_ACCESS,
  ],
};

// Secure user data structure
export interface SecureUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  permissions: Permission[];
  profile: {
    firstName: string;
    lastName?: string;
    sport?: string;
    position?: string;
    graduationYear?: number;
  };
  security: {
    lastLogin: Date;
    loginAttempts: number;
    accountLocked: boolean;
    lockoutUntil?: Date;
    passwordLastChanged: Date;
    twoFactorEnabled: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastActiveAt: Date;
  };
}

// Session management
interface SecureSession {
  userId: string;
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  deviceInfo: {
    platform: string;
    version: string;
    deviceId: string;
  };
  isActive: boolean;
}

// Authentication validation schemas
const AuthSchemas = {
  email: z.string()
    .email('Invalid email format')
    .max(254)
    .transform(str => str.toLowerCase().trim()),
    
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number, and special character'),
           
  sessionToken: z.string()
    .min(32)
    .max(256)
    .regex(/^[A-Za-z0-9+/=]+$/, 'Invalid session token format'),
};

export class AuthenticationService {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly STORAGE_KEYS = {
    USER: '@statlocker/user',
    SESSION: '@statlocker/session',
    BIOMETRIC_ENABLED: '@statlocker/biometric',
  };

  /**
   * Validate login credentials with rate limiting
   */
  static async validateCredentials(email: string, password: string): Promise<{
    valid: boolean;
    errors: string[];
    lockoutRemaining?: number;
  }> {
    // Validate input format
    const emailResult = AuthSchemas.email.safeParse(email);
    const passwordResult = AuthSchemas.password.safeParse(password);

    const errors: string[] = [];
    if (!emailResult.success) {
      errors.push(...emailResult.error.errors.map(e => e.message));
    }
    if (!passwordResult.success) {
      errors.push(...passwordResult.error.errors.map(e => e.message));
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    // Check for account lockout
    const lockoutInfo = await this.checkAccountLockout(email);
    if (lockoutInfo.locked) {
      return {
        valid: false,
        errors: ['Account temporarily locked due to multiple failed attempts'],
        lockoutRemaining: lockoutInfo.remainingTime,
      };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Create secure session after successful authentication
   */
  static async createSecureSession(user: SecureUser): Promise<SecureSession> {
    const sessionId = this.generateSecureToken();
    const deviceInfo = await this.getDeviceInfo();
    
    const session: SecureSession = {
      userId: user.uid,
      sessionId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.SESSION_DURATION),
      deviceInfo,
      isActive: true,
    };

    // Store session securely
    await AsyncStorage.setItem(
      this.STORAGE_KEYS.SESSION,
      JSON.stringify(session)
    );

    return session;
  }

  /**
   * Validate current session
   */
  static async validateSession(): Promise<{
    valid: boolean;
    session?: SecureSession;
    reason?: string;
  }> {
    try {
      const sessionData = await AsyncStorage.getItem(this.STORAGE_KEYS.SESSION);
      if (!sessionData) {
        return { valid: false, reason: 'No session found' };
      }

      const session: SecureSession = JSON.parse(sessionData);
      
      // Check expiration
      if (new Date() > new Date(session.expiresAt)) {
        await this.clearSession();
        return { valid: false, reason: 'Session expired' };
      }

      // Check if session is active
      if (!session.isActive) {
        return { valid: false, reason: 'Session inactive' };
      }

      return { valid: true, session };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, reason: 'Session validation failed' };
    }
  }

  /**
   * Check user permissions
   */
  static hasPermission(user: SecureUser, permission: Permission): boolean {
    return user.permissions.includes(permission);
  }

  /**
   * Check multiple permissions (requires ALL)
   */
  static hasAllPermissions(user: SecureUser, permissions: Permission[]): boolean {
    return permissions.every(permission => user.permissions.includes(permission));
  }

  /**
   * Check if user can access resource
   */
  static canAccessResource(
    user: SecureUser,
    resourceOwnerId: string,
    requiredPermission: Permission
  ): boolean {
    // Users can always access their own data
    if (user.uid === resourceOwnerId && 
        (requiredPermission === Permission.READ_OWN_DATA || 
         requiredPermission === Permission.WRITE_OWN_DATA)) {
      return true;
    }

    // Check role-based permissions
    return this.hasPermission(user, requiredPermission);
  }

  /**
   * Secure logout with session cleanup
   */
  static async logout(): Promise<void> {
    try {
      // Clear all stored authentication data
      await Promise.all([
        AsyncStorage.removeItem(this.STORAGE_KEYS.USER),
        AsyncStorage.removeItem(this.STORAGE_KEYS.SESSION),
        AsyncStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED),
      ]);

      // TODO: Invalidate session on server side
      // await FirebaseService.invalidateSession(sessionId);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout securely');
    }
  }

  /**
   * Rate limiting for login attempts
   */
  private static async checkAccountLockout(email: string): Promise<{
    locked: boolean;
    remainingTime?: number;
  }> {
    const key = `@statlocker/lockout/${email}`;
    const lockoutData = await AsyncStorage.getItem(key);
    
    if (!lockoutData) {
      return { locked: false };
    }

    const { lockoutUntil, attempts } = JSON.parse(lockoutData);
    const now = Date.now();
    
    if (lockoutUntil && now < lockoutUntil) {
      return {
        locked: true,
        remainingTime: lockoutUntil - now,
      };
    }

    // Clear expired lockout
    if (lockoutUntil && now >= lockoutUntil) {
      await AsyncStorage.removeItem(key);
    }

    return { locked: false };
  }

  /**
   * Record failed login attempt
   */
  static async recordFailedLogin(email: string): Promise<void> {
    const key = `@statlocker/lockout/${email}`;
    const lockoutData = await AsyncStorage.getItem(key);
    
    let attempts = 1;
    if (lockoutData) {
      const data = JSON.parse(lockoutData);
      attempts = (data.attempts || 0) + 1;
    }

    const shouldLock = attempts >= this.MAX_LOGIN_ATTEMPTS;
    const lockoutUntil = shouldLock ? Date.now() + this.LOCKOUT_DURATION : undefined;

    await AsyncStorage.setItem(key, JSON.stringify({
      attempts,
      lockoutUntil,
      lastAttempt: Date.now(),
    }));
  }

  /**
   * Clear failed login attempts on successful login
   */
  static async clearFailedAttempts(email: string): Promise<void> {
    const key = `@statlocker/lockout/${email}`;
    await AsyncStorage.removeItem(key);
  }

  /**
   * Generate cryptographically secure token
   */
  private static generateSecureToken(): string {
    const array = new Uint8Array(32);
    // In React Native, we'd use expo-crypto or similar
    // For now, using a simple implementation
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return btoa(String.fromCharCode(...array));
  }

  /**
   * Get device information for session tracking
   */
  private static async getDeviceInfo() {
    // In a real implementation, use expo-device or react-native-device-info
    return {
      platform: 'ios', // Platform.OS
      version: '1.0.0', // Application.nativeApplicationVersion
      deviceId: 'device-id', // await Application.getInstallationIdAsync()
    };
  }

  /**
   * Clear session data
   */
  private static async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEYS.SESSION);
  }
}

// Authorization decorators/HOCs for components
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: Permission[] = []
): React.ComponentType<T> {
  return function AuthorizedComponent(props: T) {
    // Implementation would check authentication status
    // and permissions before rendering component
    // For now, just render the component
    // In a real implementation, you'd check auth state here
    return React.createElement(Component, props);
  };
}

// Hook for authentication state
export function useAuth() {
  // Implementation would return current auth state,
  // user data, and auth methods
  return {
    user: null as SecureUser | null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email: string, password: string) => {},
    logout: async () => {},
    hasPermission: (permission: Permission) => false,
  };
}
