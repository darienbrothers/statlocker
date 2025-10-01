import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="onboarding-intro" />
      <Stack.Screen name="onboarding-part-one" />
      <Stack.Screen name="name" />
      <Stack.Screen name="sport-selection" />
      <Stack.Screen name="team-identity" />
    </Stack>
  );
}
