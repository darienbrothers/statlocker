import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Anton-Regular": require("../assets/fonts/Anton-Regular.ttf"),
    "PlusJakartaSans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Hide the splash screen after fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Keep splash screen visible while loading
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="main" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="stats/game/[gameId]" />
      <Stack.Screen name="(modals)/log-live" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(modals)/log-post-game" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
