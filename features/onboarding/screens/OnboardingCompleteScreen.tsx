import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing } from '../../../shared/theme';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';
import { OnboardingService } from '../../../shared/services/onboardingService';

export default function OnboardingCompleteScreen() {
  const { data, completeOnboarding, resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    // Mark onboarding as complete
    completeOnboarding();
  }, []);

  const handleEnterApp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'temp-user-id'; // This should come from Firebase Auth
      
      // Save onboarding data to Firebase
      await OnboardingService.saveOnboardingData(userId, data);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Still allow user to proceed even if save fails
      router.replace('/(tabs)');
    }
  };

  const handleStartOver = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetOnboarding();
    router.replace('/(onboarding)/coach-intro');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.titleText}>
            Your Locker is Ready!
          </Text>
          <Text style={styles.subtitleText}>
            Welcome to StatLocker, {data.firstName}! Your personalized sports journey starts now.
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Setup</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Sport:</Text>
            <Text style={styles.summaryValue}>{data.sport}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Position:</Text>
            <Text style={styles.summaryValue}>{data.position}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Graduation:</Text>
            <Text style={styles.summaryValue}>{data.graduationYear}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Goals:</Text>
            <Text style={styles.summaryValue}>{data.selectedGoals.length} selected</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={handleEnterApp}
          >
            <LinearGradient
              colors={[Colors.brand.primary, Colors.brand.primaryShade]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Enter Your Locker 🚀</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={handleStartOver}
          >
            <Text style={styles.secondaryButtonText}>Start Over</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  titleText: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitleText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  summaryCard: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  summaryValue: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: 25,
    minHeight: 56,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonText: {
    ...Typography.styles.button,
    color: Colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryButtonText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontSize: 16,
  },
});
