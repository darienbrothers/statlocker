import { OnboardingStep, OnboardingStepKey } from '../types/Onboarding';

export const onboardingSteps: OnboardingStep[] = [
  { key: 'name',  label: 'Name',   route: '/onboarding/name', editable: true },
  { key: 'profile-image', label: 'Profile', route: '/onboarding/profile-image', editable: true },
  { key: 'basic', label: 'Basic',  route: '/onboarding/basic-info', editable: true },
  { key: 'team',  label: 'Team',   route: '/onboarding/team', editable: true },
  { key: 'goals', label: 'Goals',  route: '/onboarding/goals', editable: true },
  { key: 'review',label: 'Review', route: '/onboarding/review', editable: false },
];

// Helper to get current step index
export const getCurrentStepIndex = (currentStepKey: OnboardingStepKey): number => {
  const stepIndex = onboardingSteps.findIndex(step => step.key === currentStepKey);
  return stepIndex >= 0 ? stepIndex : 0;
};

// Helper to get step by key
export const getStepByKey = (key: OnboardingStepKey): OnboardingStep | undefined => {
  return onboardingSteps.find(step => step.key === key);
};
