import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  sport?: string;
  position?: string;
  gender?: string;
  graduationYear?: number;
  schoolName?: string;
  clubName?: string;
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
}

export class AuthService {
  /**
   * Create a new user account with email and password
   */
  static async createAccount(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user profile in Firestore
      await AuthService.createUserProfile(user, firstName, lastName);
      
      return user;
    } catch (error: any) {
      throw AuthService.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw AuthService.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw AuthService.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw AuthService.handleAuthError(error);
    }
  }

  /**
   * Create user profile in Firestore
   */
  static async createUserProfile(user: User, firstName: string, lastName: string): Promise<void> {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: false,
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as UserProfile;
      }
      return null;
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile in Firestore
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await updateDoc(doc(db, 'users', uid), updateData);
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async completeOnboarding(uid: string): Promise<void> {
    try {
      await AuthService.updateUserProfile(uid, { onboardingCompleted: true });
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      throw new Error('Failed to complete onboarding');
    }
  }

  /**
   * Handle Firebase auth errors and return user-friendly messages
   */
  private static handleAuthError(error: any): Error {
    let message = 'An unexpected error occurred';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email already in use';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'You\'re offline. Changes will sync when you\'re back.';
        break;
      default:
        message = error.message || 'Authentication failed';
        break;
    }

    return new Error(message);
  }
}

export default AuthService;
