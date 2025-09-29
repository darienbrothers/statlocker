import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius } from '../../../shared/theme';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

export default function CoachIntroScreen() {
  const { setCurrentStep, markStepCompleted } = useOnboardingStore();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const unlockIconScale = useRef(new Animated.Value(1)).current;
  const unlockIconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set status bar style for black background
    StatusBar.setBarStyle('light-content', true);

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      StatusBar.setBarStyle('light-content', true);
    };
  }, []);

  const handleContinue = async () => {
    // Unlock animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(unlockIconScale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(unlockIconRotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(unlockIconScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Mark coach intro as completed and move to sport selection
    markStepCompleted(0);
    setCurrentStep(1);
    
    setTimeout(() => {
      router.push('/(onboarding)/sport-selection');
    }, 400);
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header with Back Button and Simple Progress Bar */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </Pressable>
        
        {/* Simple Progress Bar */}
        <View style={styles.simpleProgressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '11%' }]} />
          </View>
        </View>
      </View>

      {/* Content Container */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Unlock Icon Visual */}
        <View style={styles.visualContainer}>
          <Animated.View
            style={[
              styles.unlockIconContainer,
              {
                transform: [
                  { scale: unlockIconScale },
                  { 
                    rotate: unlockIconRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '15deg'],
                    })
                  },
                ],
              },
            ]}
          >
            <Ionicons 
              name="lock-open-outline" 
              size={80} 
              color={Colors.brand.primary} 
            />
          </Animated.View>
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.headline}>
            👉 We're Prepping Your Locker
          </Text>
          
          <Text style={styles.subtext}>
            Every athlete's journey is different. Let's customize StatLocker for your game.
          </Text>
          
          <Text style={styles.trustCopy}>
            Takes less than a minute • You can edit anytime
          </Text>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={[ Colors.brand.primary, Colors.brand.primaryShade]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>I'm Ready</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  simpleProgressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.text.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },
  visualContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },
  unlockIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  headline: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: '700',
  },
  subtext: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  trustCopy: {
    ...Typography.styles.caption,
    color: Colors.text.tertiary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    paddingBottom: Spacing.xl,
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
});
