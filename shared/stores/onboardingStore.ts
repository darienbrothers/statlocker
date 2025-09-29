import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingData {
  // Step 1: Sport Selection
  sport: string;
  
  // Step 2: Name Input
  firstName: string;
  lastName: string;
  
  // Step 3: Team Identity
  teamIdentity: 'boys' | 'girls' | 'custom' | '';
  
  // Step 4: Position Selection
  position: string;
  
  // Step 5: Graduation Year & Team Info
  graduationYear: number | null;
  teamLevel: 'high-school' | 'club' | '';
  teamName: string;
  
  // Step 6: Goals Selection
  selectedGoals: string[];
  
  // Step 7: Strengths & Growth Areas
  strengths: string[];
  growthAreas: string[];
  
  // Step 8: Recruiting Interest
  recruitingInterest: boolean;
  
  // Progress tracking
  currentStep: number;
  completedSteps: number[];
  isComplete: boolean;
}

interface OnboardingStore {
  data: OnboardingData;
  
  // Actions
  updateSport: (sport: string) => void;
  updateName: (firstName: string, lastName: string) => void;
  updateTeamIdentity: (teamIdentity: 'boys' | 'girls' | 'custom') => void;
  updatePosition: (position: string) => void;
  updateGradYearAndTeam: (graduationYear: number, teamLevel: 'high-school' | 'club', teamName: string) => void;
  updateGoals: (goals: string[]) => void;
  updateStrengthsAndGrowth: (strengths: string[], growthAreas: string[]) => void;
  updateRecruitingInterest: (interest: boolean) => void;
  
  // Progress actions
  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Validation
  isStepValid: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
}

const initialData: OnboardingData = {
  sport: '',
  firstName: '',
  lastName: '',
  teamIdentity: '',
  position: '',
  graduationYear: null,
  teamLevel: '',
  teamName: '',
  selectedGoals: [],
  strengths: [],
  growthAreas: [],
  recruitingInterest: false,
  currentStep: 0,
  completedSteps: [],
  isComplete: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      // Update actions
      updateSport: (sport: string) =>
        set((state) => ({
          data: { ...state.data, sport },
        })),

      updateName: (firstName: string, lastName: string) =>
        set((state) => ({
          data: { ...state.data, firstName, lastName },
        })),

      updateTeamIdentity: (teamIdentity: 'boys' | 'girls' | 'custom') =>
        set((state) => ({
          data: { ...state.data, teamIdentity },
        })),

      updatePosition: (position: string) =>
        set((state) => ({
          data: { ...state.data, position },
        })),

      updateGradYearAndTeam: (graduationYear: number, teamLevel: 'high-school' | 'club', teamName: string) =>
        set((state) => ({
          data: { ...state.data, graduationYear, teamLevel, teamName },
        })),

      updateGoals: (selectedGoals: string[]) =>
        set((state) => ({
          data: { ...state.data, selectedGoals },
        })),

      updateStrengthsAndGrowth: (strengths: string[], growthAreas: string[]) =>
        set((state) => ({
          data: { ...state.data, strengths, growthAreas },
        })),

      updateRecruitingInterest: (recruitingInterest: boolean) =>
        set((state) => ({
          data: { ...state.data, recruitingInterest },
        })),

      // Progress actions
      setCurrentStep: (currentStep: number) =>
        set((state) => ({
          data: { ...state.data, currentStep },
        })),

      markStepCompleted: (step: number) =>
        set((state) => ({
          data: {
            ...state.data,
            completedSteps: Array.from(new Set([...state.data.completedSteps, step])),
          },
        })),

      completeOnboarding: () =>
        set((state) => ({
          data: { ...state.data, isComplete: true },
        })),

      resetOnboarding: () =>
        set(() => ({
          data: initialData,
        })),

      // Validation functions
      isStepValid: (step: number) => {
        const { data } = get();
        
        switch (step) {
          case 0: // Coach Intro
            return true;
          case 1: // Sport Selection
            return data.sport !== '';
          case 2: // Name Input
            return data.firstName.trim() !== '';
          case 3: // Team Identity
            return data.teamIdentity !== '';
          case 4: // Position Selection
            return data.position !== '';
          case 5: // Grad Year & Team
            return data.graduationYear !== null && data.teamLevel !== '';
          case 6: // Goals Selection
            return data.selectedGoals.length > 0;
          case 7: // Strengths & Growth
            return data.strengths.length > 0 || data.growthAreas.length > 0;
          case 8: // Recruiting Interest
            return true; // Always valid (boolean choice)
          default:
            return false;
        }
      },

      canProceedToStep: (step: number) => {
        const { isStepValid } = get();
        
        // Can always go to step 0
        if (step === 0) return true;
        
        // Must complete previous step to proceed
        return isStepValid(step - 1);
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions for Firebase integration
export const getOnboardingDataForFirebase = (data: OnboardingData) => {
  return {
    sport: data.sport,
    firstName: data.firstName,
    lastName: data.lastName,
    teamIdentity: data.teamIdentity,
    position: data.position,
    graduationYear: data.graduationYear,
    teamLevel: data.teamLevel,
    teamName: data.teamName,
    selectedGoals: data.selectedGoals,
    strengths: data.strengths,
    growthAreas: data.growthAreas,
    recruitingInterest: data.recruitingInterest,
    onboardingCompletedAt: new Date().toISOString(),
  };
};
