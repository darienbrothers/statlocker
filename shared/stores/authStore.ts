import { create } from 'zustand';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import AuthService, { UserProfile } from '../services/AuthService';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  userProfile: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Actions
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.signIn(email, password);
      set({ user, isLoading: false });
      
      // Load user profile after successful sign in
      await get().loadUserProfile();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.createAccount(email, password, firstName, lastName);
      set({ user, isLoading: false });
      
      // Load the newly created user profile
      await get().loadUserProfile();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.signOut();
      set({ user: null, userProfile: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.resetPassword(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const userProfile = await AuthService.getUserProfile(user.uid);
      set({ userProfile });
    } catch (error: any) {
      console.error('Failed to load user profile:', error);
      set({ error: 'Failed to load user profile' });
    }
  },

  updateUserProfile: async (updates: Partial<UserProfile>) => {
    const { user, userProfile } = get();
    if (!user || !userProfile) return;

    set({ isLoading: true, error: null });
    try {
      await AuthService.updateUserProfile(user.uid, updates);
      
      // Update local state
      set({ 
        userProfile: { ...userProfile, ...updates },
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  completeOnboarding: async () => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await AuthService.completeOnboarding(user.uid);
      
      // Update local state
      await get().loadUserProfile();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      get().loadUserProfile();
    } else {
      set({ userProfile: null });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: () => {
    set({ isInitialized: true });
  },
}));

// Initialize auth state listener
auth.onAuthStateChanged((user: User | null) => {
  const store = useAuthStore.getState();
  store.setUser(user);
  
  if (!store.isInitialized) {
    store.initialize();
  }
});

export default useAuthStore;
