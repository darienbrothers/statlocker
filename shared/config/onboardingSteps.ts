import { OnboardingStep } from '../components/OnboardingNavigator';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'name',
    title: 'Name',
    subtitle: 'Required',
    route: '/onboarding/name',
    estimatedTime: '1 min',
    isCompleted: false,
    isLocked: false,
  },
  {
    id: 'basic-info',
    title: 'Basic Info',
    subtitle: 'Required',
    route: '/onboarding/basic-info',
    estimatedTime: '2 min',
    isCompleted: false,
    isLocked: true,
  },
  {
    id: 'team',
    title: 'Team',
    subtitle: 'Required',
    route: '/onboarding/team',
    estimatedTime: '1 min',
    isCompleted: false,
    isLocked: true,
  },
  {
    id: 'goals',
    title: 'Goals',
    subtitle: 'Optional',
    route: '/onboarding/goals',
    estimatedTime: '2 min',
    isCompleted: false,
    isLocked: true,
  },
  {
    id: 'review',
    title: 'Review',
    subtitle: 'Final step',
    route: '/onboarding/review',
    estimatedTime: '1 min',
    isCompleted: false,
    isLocked: true,
  },
];

// Helper function to get steps with completion state
export const getOnboardingStepsWithProgress = (completedStepIds: string[]): OnboardingStep[] => {
  return ONBOARDING_STEPS.map((step, index) => {
    const isCompleted = completedStepIds.includes(step.id);
    const previousStepsCompleted = ONBOARDING_STEPS
      .slice(0, index)
      .every(prevStep => completedStepIds.includes(prevStep.id));
    
    return {
      ...step,
      isCompleted,
      isLocked: !previousStepsCompleted && !isCompleted && step.id !== 'name',
    };
  });
};

// Helper to get current step number
export const getCurrentStepNumber = (currentStepId: string): number => {
  const stepIndex = ONBOARDING_STEPS.findIndex(step => step.id === currentStepId);
  return stepIndex >= 0 ? stepIndex + 1 : 1;
};
