import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { OnboardingData, getOnboardingDataForFirebase } from '../stores/onboardingStore';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  sport: string;
  teamIdentity: 'boys' | 'girls' | 'custom';
  position: string;
  graduationYear: number;
  teamLevel: 'high-school' | 'club';
  teamName: string;
  selectedGoals: string[];
  strengths: string[];
  growthAreas: string[];
  recruitingInterest: boolean;
  onboardingCompletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export class OnboardingService {
  /**
   * Save onboarding data to Firebase
   */
  static async saveOnboardingData(userId: string, onboardingData: OnboardingData): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const firebaseData = getOnboardingDataForFirebase(onboardingData);
      
      const userData = {
        ...firebaseData,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, userData, { merge: true });
      
      console.log('Onboarding data saved successfully');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw new Error('Failed to save onboarding data');
    }
  }

  /**
   * Get user profile from Firebase
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      } else {
        console.log('No user profile found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Create initial user profile
   */
  static async createUserProfile(
    userId: string, 
    email: string, 
    onboardingData: OnboardingData
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const firebaseData = getOnboardingDataForFirebase(onboardingData);
      
      const userData = {
        email,
        ...firebaseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, userData);
      
      console.log('User profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string, 
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, updateData, { merge: true });
      
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Validate onboarding data before saving
   */
  static validateOnboardingData(data: OnboardingData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.sport) {
      errors.push('Sport is required');
    }

    if (!data.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!data.teamIdentity) {
      errors.push('Team identity is required');
    }

    if (!data.position) {
      errors.push('Position is required');
    }

    if (!data.graduationYear) {
      errors.push('Graduation year is required');
    }

    if (data.selectedGoals.length === 0) {
      errors.push('At least one goal must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Error types for better error handling
export class OnboardingError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OnboardingError';
  }
}

export class ValidationError extends OnboardingError {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = 'ValidationError';
  }
}
