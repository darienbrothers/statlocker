import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { Colors } from '../theme';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo 
}) => {
  const { user, userProfile, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (requireAuth && !user) {
      // User is not authenticated, redirect to auth screen
      router.replace('/auth');
      return;
    }

    if (user && userProfile) {
      if (!userProfile.onboardingCompleted) {
        // User is authenticated but hasn't completed onboarding
        router.replace('/(onboarding)/welcome');
        return;
      }

      if (redirectTo) {
        // User is authenticated and onboarded, redirect to specified route
        router.replace(redirectTo);
        return;
      }
    }
  }, [user, userProfile, isInitialized, requireAuth, redirectTo]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface.primary,
      }}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  // Show loading if we're in a redirect state
  if (requireAuth && !user) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface.primary,
      }}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  if (user && userProfile && !userProfile.onboardingCompleted) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface.primary,
      }}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
