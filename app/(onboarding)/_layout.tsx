import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="coach-intro" />
      <Stack.Screen name="sport-selection" />
      <Stack.Screen name="name-input" />
      <Stack.Screen name="team-identity" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
