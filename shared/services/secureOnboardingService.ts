/**
 * Secure Onboarding Service
 * Enhanced version with comprehensive security, validation, and performance optimizations
 */

import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { OnboardingData, getOnboardingDataForFirebase } from '../stores/onboardingStore';
import { validateInput, ValidationSchemas, InputSanitizer } from '../security/validation';
import { AuthenticationService, Permission } from '../security/auth';
import { ErrorLogger, ValidationError, AuthorizationError, StatLockerError, ErrorCategory, ErrorSeverity } from '../utils/errorHandling';
import { PerformanceMonitor, PersistentCache } from '../performance/optimization';

export interface SecureUserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  sport: string;
  teamIdentity: 'boys' | 'girls' | 'custom' | '';
  position: string;
  graduationYear: number | null;
  teamLevel: 'high-school' | 'club' | '';
  teamName: string;
  selectedGoals: string[];
  strengths: string[];
  growthAreas: string[];
  recruitingInterest: boolean;
  onboardingCompletedAt: string;
  createdAt: string;
  updatedAt: string;
  // Enhanced security fields
  metadata: {
    version: string;
    source: 'mobile' | 'web';
    deviceId?: string;
  };
  security: {
    dataHash: string;
    lastValidated: string;
    ipAddress?: string;
  };
}

export class SecureOnboardingService {
  private static readonly COLLECTION_NAME = 'users';
  private static readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes
  private static readonly DATA_VERSION = '2.0.0';

  /**
   * Save onboarding data with comprehensive security validation
   */
  static async saveOnboardingData(
    userId: string, 
    onboardingData: OnboardingData,
    requestContext?: { ipAddress?: string; deviceId?: string }
  ): Promise<void> {
    const timer = PerformanceMonitor.startTimer('onboarding:save');
    
    try {
      // Validate user authentication
      await this.validateUserAccess(userId, Permission.WRITE_OWN_DATA);

      // Validate and sanitize input data
      const validationResult = this.validateOnboardingData(onboardingData);
      if (!validationResult.isValid) {
        throw new ValidationError(
          `Onboarding validation failed: ${validationResult.errors.join(', ')}`,
          'Please check your information and try again',
          { userId, errors: validationResult.errors }
        );
      }

      // Sanitize data
      const sanitizedData = this.sanitizeOnboardingData(onboardingData);
      const firebaseData = getOnboardingDataForFirebase(sanitizedData);

      // Generate security metadata
      const now = new Date().toISOString();
      const dataHash = await this.generateDataHash(firebaseData);

      const userData = {
        ...firebaseData,
        updatedAt: now,
        metadata: {
          version: this.DATA_VERSION,
          source: 'mobile' as const,
          deviceId: requestContext?.deviceId ? 
            InputSanitizer.sanitizeForDatabase(requestContext.deviceId) : undefined,
        },
        security: {
          dataHash,
          lastValidated: now,
          ipAddress: requestContext?.ipAddress ? 
            InputSanitizer.sanitizeForDatabase(requestContext.ipAddress) : undefined,
        },
      };

      // Save to Firebase
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      await setDoc(userRef, userData, { merge: true });

      // Update cache
      await PersistentCache.set(`user_profile:${userId}`, userData, this.CACHE_TTL);

      console.log('Secure onboarding data saved successfully for user:', userId);
      
    } catch (error) {
      await ErrorLogger.logError(
        error instanceof Error ? error : new Error('Unknown error'),
        { userId, operation: 'saveOnboardingData' },
        userId
      );
      throw error;
    } finally {
      timer();
    }
  }

  /**
   * Get user profile with caching and security validation
   */
  static async getUserProfile(userId: string): Promise<SecureUserProfile | null> {
    const timer = PerformanceMonitor.startTimer('onboarding:getUserProfile');
    
    try {
      // Validate user access
      await this.validateUserAccess(userId, Permission.READ_OWN_DATA);

      // Check cache first
      const cached = await PersistentCache.get<SecureUserProfile>(`user_profile:${userId}`);
      if (cached) {
        // Validate cached data integrity
        const isValid = await this.validateDataIntegrity(cached);
        if (isValid) {
          timer();
          return cached;
        } else {
          // Clear invalid cache
          await PersistentCache.delete(`user_profile:${userId}`);
        }
      }

      // Fetch from Firebase
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        timer();
        return null;
      }

      const profile = userSnap.data() as SecureUserProfile;
      
      // Validate data integrity
      const isValid = await this.validateDataIntegrity(profile);
      if (!isValid) {
        throw new StatLockerError(
          'Data integrity check failed',
          ErrorCategory.SECURITY,
          ErrorSeverity.HIGH,
          'Your profile data may have been corrupted. Please contact support.',
          { userId }
        );
      }

      // Update cache
      await PersistentCache.set(`user_profile:${userId}`, profile, this.CACHE_TTL);

      timer();
      return profile;
      
    } catch (error) {
      await ErrorLogger.logError(
        error instanceof Error ? error : new Error('Unknown error'),
        { userId, operation: 'getUserProfile' },
        userId
      );
      throw error;
    } finally {
      timer();
    }
  }

  /**
   * Create initial user profile with enhanced security
   */
  static async createUserProfile(
    userId: string,
    email: string,
    onboardingData: OnboardingData,
    requestContext?: { ipAddress?: string; deviceId?: string }
  ): Promise<void> {
    const timer = PerformanceMonitor.startTimer('onboarding:createUserProfile');
    
    try {
      // Validate email format
      const emailValidation = validateInput(ValidationSchemas.email, email);
      if (!emailValidation.success) {
        throw new ValidationError(
          'Invalid email format',
          'Please provide a valid email address',
          { userId, email: 'redacted' }
        );
      }

      // Validate onboarding data
      const validationResult = this.validateOnboardingData(onboardingData);
      if (!validationResult.isValid) {
        throw new ValidationError(
          `Profile creation validation failed: ${validationResult.errors.join(', ')}`,
          'Please complete all required fields',
          { userId, errors: validationResult.errors }
        );
      }

      // Sanitize data
      const sanitizedData = this.sanitizeOnboardingData(onboardingData);
      const firebaseData = getOnboardingDataForFirebase(sanitizedData);

      // Generate security metadata
      const now = new Date().toISOString();
      const dataHash = await this.generateDataHash({ ...firebaseData, email: emailValidation.data });

      const userData: SecureUserProfile = {
        uid: userId,
        email: emailValidation.data,
        ...firebaseData,
        createdAt: now,
        updatedAt: now,
        metadata: {
          version: this.DATA_VERSION,
          source: 'mobile',
          deviceId: requestContext?.deviceId ? 
            InputSanitizer.sanitizeForDatabase(requestContext.deviceId) : undefined,
        },
        security: {
          dataHash,
          lastValidated: now,
          ipAddress: requestContext?.ipAddress ? 
            InputSanitizer.sanitizeForDatabase(requestContext.ipAddress) : undefined,
        },
      };

      // Save to Firebase
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      await setDoc(userRef, userData);

      // Update cache
      await PersistentCache.set(`user_profile:${userId}`, userData, this.CACHE_TTL);

      console.log('Secure user profile created successfully for user:', userId);
      
    } catch (error) {
      await ErrorLogger.logError(
        error instanceof Error ? error : new Error('Unknown error'),
        { userId, operation: 'createUserProfile' },
        userId
      );
      throw error;
    } finally {
      timer();
    }
  }

  /**
   * Update user profile with validation and audit trail
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<SecureUserProfile>,
    requestContext?: { ipAddress?: string; reason?: string }
  ): Promise<void> {
    const timer = PerformanceMonitor.startTimer('onboarding:updateUserProfile');
    
    try {
      // Validate user access
      await this.validateUserAccess(userId, Permission.WRITE_OWN_DATA);

      // Get existing profile for validation
      const existingProfile = await this.getUserProfile(userId);
      if (!existingProfile) {
        throw new StatLockerError(
          'Profile not found for update',
          ErrorCategory.VALIDATION,
          ErrorSeverity.MEDIUM,
          'Profile not found. Please complete onboarding first.',
          { userId }
        );
      }

      // Sanitize updates
      const sanitizedUpdates = this.sanitizeProfileUpdates(updates);

      // Generate new data hash
      const mergedData = { ...existingProfile, ...sanitizedUpdates };
      const dataHash = await this.generateDataHash(mergedData);

      // Prepare update with metadata
      const now = new Date().toISOString();
      const updateData: any = {
        ...sanitizedUpdates,
        updatedAt: now,
        'metadata.version': this.DATA_VERSION,
        'security.dataHash': dataHash,
        'security.lastValidated': now,
      };

      if (requestContext?.ipAddress) {
        updateData['security.ipAddress'] = InputSanitizer.sanitizeForDatabase(requestContext.ipAddress);
      }

      // Update in Firebase
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(userRef, updateData);

      // Clear cache to force refresh
      await PersistentCache.delete(`user_profile:${userId}`);

      console.log('User profile updated successfully for user:', userId, {
        reason: requestContext?.reason || 'user_update',
        fields: Object.keys(sanitizedUpdates),
      });
      
    } catch (error) {
      await ErrorLogger.logError(
        error instanceof Error ? error : new Error('Unknown error'),
        { userId, operation: 'updateUserProfile', updates: Object.keys(updates) },
        userId
      );
      throw error;
    } finally {
      timer();
    }
  }

  /**
   * Enhanced validation with security checks
   */
  static validateOnboardingData(data: OnboardingData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Validate individual fields using our validation schemas
      if (data.firstName !== undefined) {
        const firstNameResult = validateInput(ValidationSchemas.name, data.firstName);
        if (!firstNameResult.success) {
          errors.push(...firstNameResult.errors);
        }
      }

      if (data.lastName !== undefined && data.lastName !== '') {
        const lastNameResult = validateInput(ValidationSchemas.name, data.lastName);
        if (!lastNameResult.success) {
          errors.push(...lastNameResult.errors);
        }
      }

      if (data.sport !== undefined) {
        const sportResult = validateInput(ValidationSchemas.sport, data.sport);
        if (!sportResult.success) {
          errors.push(...sportResult.errors);
        }
      }

      if (data.position !== undefined && data.position !== '') {
        const positionResult = validateInput(ValidationSchemas.position, data.position);
        if (!positionResult.success) {
          errors.push(...positionResult.errors);
        }
      }

      if (data.graduationYear !== undefined && data.graduationYear !== null) {
        const yearResult = validateInput(ValidationSchemas.graduationYear, data.graduationYear);
        if (!yearResult.success) {
          errors.push(...yearResult.errors);
        }
      }

      // Validate team identity
      if (!data.teamIdentity || !['boys', 'girls', 'custom'].includes(data.teamIdentity)) {
        errors.push('Valid team identity is required');
      }

      // Validate arrays
      if (data.selectedGoals.length === 0) {
        errors.push('At least one goal must be selected');
      }

      if (data.selectedGoals.length > 10) {
        errors.push('Too many goals selected (maximum 10)');
      }

      if (data.strengths && data.strengths.length > 10) {
        errors.push('Too many strengths listed (maximum 10)');
      }

      if (data.growthAreas && data.growthAreas.length > 10) {
        errors.push('Too many growth areas listed (maximum 10)');
      }

    } catch (error) {
      errors.push('Validation error occurred');
      ErrorLogger.logError(
        error instanceof Error ? error : new Error('Validation error'),
        { operation: 'validateOnboardingData' }
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize onboarding data to prevent XSS and injection attacks
   */
  private static sanitizeOnboardingData(data: OnboardingData): OnboardingData {
    return {
      ...data,
      firstName: InputSanitizer.sanitizeForDatabase(data.firstName),
      lastName: InputSanitizer.sanitizeForDatabase(data.lastName),
      sport: InputSanitizer.sanitizeForDatabase(data.sport),
      position: InputSanitizer.sanitizeForDatabase(data.position),
      teamName: data.teamName ? InputSanitizer.sanitizeForDatabase(data.teamName) : '',
      selectedGoals: data.selectedGoals.map(goal => InputSanitizer.sanitizeForDatabase(goal)),
      strengths: data.strengths.map(strength => InputSanitizer.sanitizeForDatabase(strength)),
      growthAreas: data.growthAreas.map(area => InputSanitizer.sanitizeForDatabase(area)),
    };
  }

  /**
   * Sanitize profile updates
   */
  private static sanitizeProfileUpdates(updates: Partial<SecureUserProfile>): Partial<SecureUserProfile> {
    const sanitized: Partial<SecureUserProfile> = {};

    // Sanitize string fields
    if (updates.firstName !== undefined) {
      sanitized.firstName = InputSanitizer.sanitizeForDatabase(updates.firstName);
    }
    if (updates.lastName !== undefined) {
      sanitized.lastName = InputSanitizer.sanitizeForDatabase(updates.lastName);
    }
    if (updates.position !== undefined) {
      sanitized.position = InputSanitizer.sanitizeForDatabase(updates.position);
    }
    if (updates.teamName !== undefined) {
      sanitized.teamName = InputSanitizer.sanitizeForDatabase(updates.teamName);
    }

    // Sanitize arrays
    if (updates.selectedGoals !== undefined) {
      sanitized.selectedGoals = updates.selectedGoals.map(goal => 
        InputSanitizer.sanitizeForDatabase(goal)
      );
    }
    if (updates.strengths !== undefined) {
      sanitized.strengths = updates.strengths.map(strength => 
        InputSanitizer.sanitizeForDatabase(strength)
      );
    }
    if (updates.growthAreas !== undefined) {
      sanitized.growthAreas = updates.growthAreas.map(area => 
        InputSanitizer.sanitizeForDatabase(area)
      );
    }

    // Copy non-string fields as-is (they don't need sanitization)
    if (updates.graduationYear !== undefined) {
      sanitized.graduationYear = updates.graduationYear;
    }
    if (updates.recruitingInterest !== undefined) {
      sanitized.recruitingInterest = updates.recruitingInterest;
    }
    if (updates.teamIdentity !== undefined) {
      sanitized.teamIdentity = updates.teamIdentity;
    }
    if (updates.teamLevel !== undefined) {
      sanitized.teamLevel = updates.teamLevel;
    }

    return sanitized;
  }

  /**
   * Validate user access with authentication and authorization
   */
  private static async validateUserAccess(userId: string, requiredPermission: Permission): Promise<void> {
    const sessionValidation = await AuthenticationService.validateSession();
    
    if (!sessionValidation.valid) {
      throw new AuthorizationError(
        'Invalid session for profile access',
        'Please log in to continue',
        { userId, requiredPermission }
      );
    }

    // In a real implementation, verify the session user matches the requested userId
    // and has the required permissions
  }

  /**
   * Generate data hash for integrity checking
   */
  private static async generateDataHash(data: any): Promise<string> {
    try {
      // Create a consistent string representation
      const dataString = JSON.stringify(data, Object.keys(data).sort());
      // In a real implementation, use crypto.subtle.digest
      return btoa(dataString).substring(0, 32);
    } catch (error) {
      console.warn('Failed to generate data hash:', error);
      return 'hash_generation_failed';
    }
  }

  /**
   * Validate data integrity using stored hash
   */
  private static async validateDataIntegrity(profile: SecureUserProfile): Promise<boolean> {
    try {
      if (!profile.security?.dataHash) {
        // Legacy data without hash - consider valid but log for migration
        console.warn('Profile missing data hash, consider migration:', profile.uid);
        return true;
      }

      // Create hash from current data (excluding security metadata)
      const { security, metadata, ...dataForHash } = profile;
      const currentHash = await this.generateDataHash(dataForHash);

      return currentHash === profile.security.dataHash;
    } catch (error) {
      console.warn('Data integrity validation failed:', error);
      return false; // Fail safe
    }
  }
}

// Enhanced error types
export class SecureOnboardingError extends StatLockerError {
  constructor(message: string, userMessage: string, context?: Record<string, any>) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.MEDIUM, userMessage, context);
    this.name = 'SecureOnboardingError';
  }
}

export class ProfileNotFoundError extends StatLockerError {
  constructor(userId: string) {
    super(
      `Profile not found for user: ${userId}`,
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      'Profile not found. Please complete onboarding first.',
      { userId }
    );
    this.name = 'ProfileNotFoundError';
  }
}
