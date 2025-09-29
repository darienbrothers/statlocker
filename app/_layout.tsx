import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SecurityInitializer } from '../shared/security/securityInit';
import { ErrorLogger, StatLockerError, ErrorCategory, ErrorSeverity } from '../shared/utils/errorHandling';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [securityInitialized, setSecurityInitialized] = useState(false);
  const [securityError, setSecurityError] = useState<Error | null>(null);
  
  const [loaded] = useFonts({
    // Montserrat fonts - For headings and big stats (sporty, bold, geometric)
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    
    // Urbanist fonts - For body text and buttons (clean, modern, character)
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
    
    // Roboto Condensed fonts - For captions and stat labels (tight, sharp, stat tables)
    "RobotoCondensed-Regular": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
    "RobotoCondensed-Bold": require("../assets/fonts/RobotoCondensed-Bold.ttf"),
  });

  useEffect(() => {
    // Initialize security systems
    const initializeSecurity = async () => {
      try {
        await SecurityInitializer.initialize();
        setSecurityInitialized(true);
        console.log('🔒 Security systems initialized successfully');
      } catch (error) {
        const secError = error instanceof Error ? error : new Error('Security initialization failed');
        setSecurityError(secError);
        
        // Log the security initialization failure
        await ErrorLogger.logError(
          new StatLockerError(
            'Security initialization failed',
            ErrorCategory.SYSTEM,
            ErrorSeverity.CRITICAL,
            'App security systems failed to initialize',
            { error: secError.message }
          )
        );
        
        console.error('❌ Security initialization failed:', secError);
      }
    };

    initializeSecurity();
  }, []);

  useEffect(() => {
    if (loaded && securityInitialized) {
      // Hide the splash screen after fonts are loaded and security is initialized
      SplashScreen.hideAsync();
    }
  }, [loaded, securityInitialized]);

  if (!loaded) {
    return null; // Keep splash screen visible while loading
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#111827" } // Turf & Steel theme background
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="main" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="stats/game/[gameId]" />
      <Stack.Screen name="(modals)/log-live" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(modals)/log-post-game" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
