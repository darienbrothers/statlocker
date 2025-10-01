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

import { Colors, Typography, Spacing } from '../../../shared/theme';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

export default function OnboardingPartOneScreen() {
  const { setCurrentStep, markStepCompleted } = useOnboardingStore();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const chevronAnim = useRef(new Animated.Value(50)).current;
  const chevronOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set status bar style for gradient background
    StatusBar.setBarStyle('light-content', true);

    // Staggered entrance animations
    Animated.sequence([
      // First animate "PART 1" label
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Then animate chevron from right
      Animated.parallel([
        Animated.timing(chevronAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(chevronOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto-advance after 2.5 seconds
    const timer = setTimeout(() => {
      handleContinue();
    }, 2500);

    return () => {
      clearTimeout(timer);
      StatusBar.setBarStyle('light-content', true);
    };
  }, []);

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Mark part one divider as completed and move to basic info
    markStepCompleted(1);
    setCurrentStep(2);
    
    setTimeout(() => {
      router.push('/(onboarding)/name');
    }, 100);
  };

  const handleTap = () => {
    handleContinue();
  };

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.brand.primary} />
      
      {/* Primary Green Gradient Background */}
      <LinearGradient
        colors={[Colors.brand.primaryTint, Colors.brand.primary, Colors.brand.primaryShade]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Centered Content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Section Label */}
            <Text style={styles.sectionLabel}>PART 1</Text>
            
            {/* Main Headline with Chevron */}
            <View style={styles.headlineContainer}>
              <Text style={styles.headline}>ABOUT YOU</Text>
              <Animated.View
                style={[
                  styles.chevronContainer,
                  {
                    opacity: chevronOpacity,
                    transform: [{ translateX: chevronAnim }],
                  },
                ]}
              >
                <Ionicons name="chevron-forward" size={32} color="rgba(255,255,255,0.8)" />
              </Animated.View>
            </View>
            
            {/* Optional Tagline */}
            <Text style={styles.tagline}>
              Let's start with the basics to personalize your Locker.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400', // Regular
    color: 'rgba(255,255,255,0.8)', // White 80% opacity
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 1.5,
  },
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  headline: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '700', // Bold
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chevronContainer: {
    marginLeft: Spacing.md,
  },
  tagline: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
});
