export type OnboardingStepKey =
  | 'name'
  | 'profile-image'
  | 'basic'
  | 'team'
  | 'goals'
  | 'review';

export type OnboardingStep = {
  key: OnboardingStepKey;
  label: string;        // e.g., "Name", "Basic", "Team", "Goals", "Review"
  route: string;        // your stack route name
  editable?: boolean;   // enables "Edit" chip when completed
};

export type StepState = 'completed' | 'current' | 'upcoming';

export interface InlineStepperProps {
  steps: OnboardingStep[];
  currentIndex: number;              // 0-based
  completedSteps: OnboardingStepKey[]; // array of completed step keys
  showBack?: boolean;
  onBack?: () => void;
}
