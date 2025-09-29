/**
 * Enhanced Error Handling and Logging System
 * Provides secure error handling with proper logging and user feedback
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputSanitizer } from '../security/validation';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NETWORK = 'network',
  DATABASE = 'database',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USER_INPUT = 'user_input',
  SYSTEM = 'system',
}

// Custom error types
export class StatLockerError extends Error {
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly userMessage: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;
  public readonly userId?: string;

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    userMessage: string,
    context?: Record<string, any>,
    userId?: string
  ) {
    super(message);
    this.name = 'StatLockerError';
    this.category = category;
    this.severity = severity;
    this.userMessage = userMessage;
    this.timestamp = new Date();
    this.context = context;
    this.userId = userId;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatLockerError);
    }
  }
}

// Predefined error types
export class ValidationError extends StatLockerError {
  constructor(message: string, userMessage: string, context?: Record<string, any>) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.MEDIUM, userMessage, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends StatLockerError {
  constructor(message: string, userMessage: string = 'Please log in to continue', context?: Record<string, any>) {
    super(message, ErrorCategory.AUTHENTICATION, ErrorSeverity.HIGH, userMessage, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends StatLockerError {
  constructor(message: string, userMessage: string = 'You do not have permission to perform this action', context?: Record<string, any>) {
    super(message, ErrorCategory.AUTHORIZATION, ErrorSeverity.HIGH, userMessage, context);
    this.name = 'AuthorizationError';
  }
}

export class NetworkError extends StatLockerError {
  constructor(message: string, userMessage: string = 'Network connection error. Please try again.', context?: Record<string, any>) {
    super(message, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, userMessage, context);
    this.name = 'NetworkError';
  }
}

export class SecurityError extends StatLockerError {
  constructor(message: string, userMessage: string = 'Security validation failed', context?: Record<string, any>) {
    super(message, ErrorCategory.SECURITY, ErrorSeverity.CRITICAL, userMessage, context);
    this.name = 'SecurityError';
  }
}

// Error log entry
interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  error: {
    name: string;
    message: string;
    stack?: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    userMessage: string;
  };
  context?: Record<string, any>;
  userId?: string;
  deviceInfo: {
    platform: string;
    version: string;
    userAgent: string;
  };
  resolved: boolean;
}

// Secure logging service
export class ErrorLogger {
  private static readonly LOG_STORAGE_KEY = '@statlocker/error_logs';
  private static readonly MAX_LOGS = 100;
  private static readonly LOG_RETENTION_DAYS = 7;

  /**
   * Log an error securely
   */
  static async logError(
    error: Error | StatLockerError,
    context?: Record<string, any>,
    userId?: string
  ): Promise<void> {
    try {
      const logEntry: ErrorLogEntry = {
        id: this.generateLogId(),
        timestamp: new Date(),
        error: {
          name: error.name,
          message: this.sanitizeErrorMessage(error.message),
          stack: this.sanitizeStackTrace(error.stack),
          category: error instanceof StatLockerError ? error.category : ErrorCategory.SYSTEM,
          severity: error instanceof StatLockerError ? error.severity : ErrorSeverity.MEDIUM,
          userMessage: error instanceof StatLockerError ? error.userMessage : 'An unexpected error occurred',
        },
        context: this.sanitizeContext(context),
        userId: userId ? InputSanitizer.sanitizeForDatabase(userId) : undefined,
        deviceInfo: await this.getDeviceInfo(),
        resolved: false,
      };

      await this.storeLogEntry(logEntry);
      
      // Send to remote logging service for critical errors
      if (logEntry.error.severity === ErrorSeverity.CRITICAL) {
        await this.sendToRemoteLogger(logEntry);
      }

      // Clean up old logs
      await this.cleanupOldLogs();
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
      // Fallback to console logging
      console.error('Original error:', error);
    }
  }

  /**
   * Get error logs for debugging
   */
  static async getErrorLogs(
    filters?: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      userId?: string;
      resolved?: boolean;
      limit?: number;
    }
  ): Promise<ErrorLogEntry[]> {
    try {
      const logs = await this.getAllLogs();
      
      let filteredLogs = logs;
      
      if (filters) {
        filteredLogs = logs.filter(log => {
          if (filters.category && log.error.category !== filters.category) return false;
          if (filters.severity && log.error.severity !== filters.severity) return false;
          if (filters.userId && log.userId !== filters.userId) return false;
          if (filters.resolved !== undefined && log.resolved !== filters.resolved) return false;
          return true;
        });
      }

      // Sort by timestamp (newest first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Apply limit
      if (filters?.limit) {
        filteredLogs = filteredLogs.slice(0, filters.limit);
      }

      return filteredLogs;
    } catch (error) {
      console.error('Failed to retrieve error logs:', error);
      return [];
    }
  }

  /**
   * Mark error as resolved
   */
  static async markErrorResolved(errorId: string): Promise<void> {
    try {
      const logs = await this.getAllLogs();
      const updatedLogs = logs.map(log => 
        log.id === errorId ? { ...log, resolved: true } : log
      );
      
      await AsyncStorage.setItem(this.LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to mark error as resolved:', error);
    }
  }

  /**
   * Clear all error logs
   */
  static async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.LOG_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear error logs:', error);
    }
  }

  /**
   * Get error statistics
   */
  static async getErrorStats(): Promise<{
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    resolved: number;
    unresolved: number;
  }> {
    try {
      const logs = await this.getAllLogs();
      
      const stats = {
        total: logs.length,
        byCategory: {} as Record<ErrorCategory, number>,
        bySeverity: {} as Record<ErrorSeverity, number>,
        resolved: logs.filter(log => log.resolved).length,
        unresolved: logs.filter(log => !log.resolved).length,
      };

      // Initialize counters
      Object.values(ErrorCategory).forEach(category => {
        stats.byCategory[category] = 0;
      });
      Object.values(ErrorSeverity).forEach(severity => {
        stats.bySeverity[severity] = 0;
      });

      // Count occurrences
      logs.forEach(log => {
        stats.byCategory[log.error.category]++;
        stats.bySeverity[log.error.severity]++;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get error statistics:', error);
      return {
        total: 0,
        byCategory: {} as Record<ErrorCategory, number>,
        bySeverity: {} as Record<ErrorSeverity, number>,
        resolved: 0,
        unresolved: 0,
      };
    }
  }

  private static generateLogId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static sanitizeErrorMessage(message: string): string {
    // Remove sensitive information from error messages
    return InputSanitizer.sanitizeForDatabase(message)
      .replace(/password[=:]\s*\S+/gi, 'password=***')
      .replace(/token[=:]\s*\S+/gi, 'token=***')
      .replace(/key[=:]\s*\S+/gi, 'key=***')
      .replace(/secret[=:]\s*\S+/gi, 'secret=***');
  }

  private static sanitizeStackTrace(stack?: string): string | undefined {
    if (!stack) return undefined;
    
    // Remove sensitive file paths and keep only relevant parts
    return stack
      .split('\n')
      .map(line => {
        // Keep only the function name and relative path
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
          const [, functionName, filePath, lineNum, colNum] = match;
          const fileName = filePath.split('/').pop() || filePath;
          return `at ${functionName} (${fileName}:${lineNum}:${colNum})`;
        }
        return line;
      })
      .slice(0, 10) // Limit stack trace length
      .join('\n');
  }

  private static sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context) return undefined;

    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(context)) {
      const sanitizedKey = InputSanitizer.sanitizeForDatabase(key);
      
      if (typeof value === 'string') {
        sanitized[sanitizedKey] = InputSanitizer.sanitizeForDatabase(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize objects (limit depth to prevent infinite recursion)
        sanitized[sanitizedKey] = this.sanitizeObjectShallow(value);
      } else {
        sanitized[sanitizedKey] = value;
      }
    }

    return sanitized;
  }

  private static sanitizeObjectShallow(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.slice(0, 10).map(item => 
        typeof item === 'string' ? InputSanitizer.sanitizeForDatabase(item) : item
      );
    }

    const sanitized: any = {};
    const entries = Object.entries(obj).slice(0, 20); // Limit object size
    
    for (const [key, value] of entries) {
      const sanitizedKey = InputSanitizer.sanitizeForDatabase(key);
      sanitized[sanitizedKey] = typeof value === 'string' 
        ? InputSanitizer.sanitizeForDatabase(value) 
        : value;
    }

    return sanitized;
  }

  private static async getDeviceInfo() {
    // In a real implementation, use expo-device or react-native-device-info
    return {
      platform: 'ios', // Platform.OS
      version: '1.0.0', // Application.nativeApplicationVersion
      userAgent: 'StatLocker/1.0.0', // navigator.userAgent equivalent
    };
  }

  private static async storeLogEntry(logEntry: ErrorLogEntry): Promise<void> {
    const logs = await this.getAllLogs();
    logs.push(logEntry);
    
    // Keep only the most recent logs
    const trimmedLogs = logs.slice(-this.MAX_LOGS);
    
    await AsyncStorage.setItem(this.LOG_STORAGE_KEY, JSON.stringify(trimmedLogs));
  }

  private static async getAllLogs(): Promise<ErrorLogEntry[]> {
    try {
      const logsJson = await AsyncStorage.getItem(this.LOG_STORAGE_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to retrieve logs from storage:', error);
      return [];
    }
  }

  private static async cleanupOldLogs(): Promise<void> {
    try {
      const logs = await this.getAllLogs();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.LOG_RETENTION_DAYS);
      
      const recentLogs = logs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      );
      
      if (recentLogs.length !== logs.length) {
        await AsyncStorage.setItem(this.LOG_STORAGE_KEY, JSON.stringify(recentLogs));
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }

  private static async sendToRemoteLogger(logEntry: ErrorLogEntry): Promise<void> {
    try {
      // In a real implementation, send to a logging service like Sentry, LogRocket, etc.
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry),
      // });
      console.warn('Critical error logged:', logEntry);
    } catch (error) {
      console.error('Failed to send log to remote service:', error);
    }
  }
}

// Global error handler
export class GlobalErrorHandler {
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;

    try {
      // Handle unhandled promise rejections (Web only)
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
        console.log('✅ Web error handlers initialized');
      } else {
        console.log('✅ Web error handlers skipped (React Native environment)');
      }

      // Handle uncaught exceptions (React Native)
      if (typeof global !== 'undefined' && (global as any).ErrorUtils) {
        const ErrorUtils = (global as any).ErrorUtils;
        const originalHandler = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
          this.handleUncaughtException(error, isFatal);
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        });
        console.log('✅ React Native error handlers initialized');
      } else {
        console.log('✅ React Native error handlers not available');
      }

      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize global error handlers:', error);
      // Don't throw error, just mark as initialized to prevent retry loops
      this.initialized = true;
    }
  }

  private static handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    ErrorLogger.logError(
      new StatLockerError(
        error.message,
        ErrorCategory.SYSTEM,
        ErrorSeverity.HIGH,
        'An unexpected error occurred',
        { type: 'unhandled_rejection' }
      )
    );
  };

  private static handleUncaughtException = (error: Error, isFatal: boolean): void => {
    ErrorLogger.logError(
      new StatLockerError(
        error.message,
        ErrorCategory.SYSTEM,
        isFatal ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
        'An unexpected error occurred',
        { type: 'uncaught_exception', isFatal, stack: error.stack }
      )
    );
  };
}

// Error boundary helper for React components (simplified for React Native)
export function createErrorBoundary(fallbackComponent: React.ComponentType<{ error: Error }>) {
  // In React Native, error boundaries are less common
  // This is a placeholder that would need to be implemented with a proper React class component
  // For now, return a simple wrapper function
  return function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
    // In a real implementation, this would be a proper React.Component class
    // For now, just render children directly
    return children as React.ReactElement;
  };
}

// Utility functions for common error scenarios
export const ErrorUtils = {
  /**
   * Handle API errors consistently
   */
  handleApiError: (error: any, context?: Record<string, any>) => {
    if (error.code === 401) {
      throw new AuthenticationError('Authentication failed', 'Please log in again', context);
    } else if (error.code === 403) {
      throw new AuthorizationError('Access denied', 'You do not have permission for this action', context);
    } else if (error.code >= 500) {
      throw new StatLockerError(
        error.message,
        ErrorCategory.NETWORK,
        ErrorSeverity.HIGH,
        'Server error. Please try again later.',
        context
      );
    } else {
      throw new NetworkError(error.message, 'Network request failed', context);
    }
  },

  /**
   * Wrap async operations with error handling
   */
  withErrorHandling: async <T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof StatLockerError) {
        await ErrorLogger.logError(error, context);
        throw error;
      } else {
        const wrappedError = new StatLockerError(
          error instanceof Error ? error.message : String(error),
          ErrorCategory.SYSTEM,
          ErrorSeverity.MEDIUM,
          'An error occurred while processing your request',
          context
        );
        await ErrorLogger.logError(wrappedError, context);
        throw wrappedError;
      }
    }
  },
};
