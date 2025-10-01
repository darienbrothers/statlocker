import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../../../shared/theme';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

export default function OnboardingIntroScreen() {
  const { setCurrentStep, markStepCompleted } = useOnboardingStore();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Set status bar style for dark background
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
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Mark intro as completed and move to part one divider
    markStepCompleted(0);
    setCurrentStep(1);
    
    setTimeout(() => {
      router.push('/(onboarding)/onboarding-part-one');
    }, 200);
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Large Logo at Top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logos/logoWhite.png')}
          style={styles.logo}
          resizeMode="contain"
          accessible
          accessibilityIgnoresInvertColors
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Content Container - No Scroll */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
            {/* Text Content */}
            <View style={styles.textContent}>
              <Text style={styles.headline}>
                Your StatLocker{' '}
                <Text style={styles.highlightText}>journey starts here</Text>
              </Text>
              
              <Text style={styles.subtext}>
                We're prepping your Locker so every{' '}
                <Text style={styles.highlightText}>stat</Text>,{' '}
                <Text style={styles.highlightText}>goal</Text>, and{' '}
                <Text style={styles.highlightText}>milestone</Text>{' '}
                feels built just for you.
              </Text>
            </View>

            {/* Feature Cards */}
            <View style={styles.featuresContainer}>
              {/* Track Stats Card */}
              <View style={styles.featureCard}>
                <View style={[styles.iconContainer, styles.primaryIcon]}>
                  <Ionicons name="bar-chart" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Track Your Stats</Text>
                  <Text style={styles.cardSubtitle}>Every game, every play</Text>
                </View>
              </View>

              {/* Achieve Goals Card */}
              <View style={styles.featureCard}>
                <View style={[styles.iconContainer, styles.blueIcon]}>
                  <Ionicons name="trophy" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Achieve Your Goals</Text>
                  <Text style={styles.cardSubtitle}>Season milestones</Text>
                </View>
              </View>

              {/* AI Insights Card */}
              <View style={styles.featureCard}>
                <View style={[styles.iconContainer, styles.purpleIcon]}>
                  <Ionicons name="analytics" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>AI-powered insights & trends</Text>
                  <Text style={styles.cardSubtitle}>Smarter breakdowns after every game</Text>
                </View>
              </View>
            </View>

            {/* CTA Button */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.primaryButton}
                onPress={handleContinue}
                accessibilityRole="button"
                accessibilityLabel="I'm Ready"
              >
                <LinearGradient
                  colors={[Colors.brand.primary, Colors.brand.primaryShade]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  logoContainer: {
    position: 'absolute',
    top: '8%', // Moved higher up for more breathing room
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    width: 200, // Big logo size
    height: 200,
    maxWidth: '80%', // Responsive sizing
  },
  safeArea: {
    flex: 1,
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
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between', // Distribute content evenly
    paddingTop: '35%', // Start content below logo
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: 0, // No top margin to start closer to image
    marginBottom: Spacing.md, // Reduced bottom margin
  },
  headline: {
    fontFamily: 'System',
    color: '#FFFFFF', // White text for dark theme
    fontSize: 28, // Slightly smaller to save space
    fontWeight: '700', // Bold for headlines
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: Spacing.md, // Reduced margin
  },
  subtext: {
    fontFamily: 'System',
    color: '#9CA3AF', // Gray text for subtext
    fontSize: 16,
    fontWeight: '400', // Regular for body text
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  highlightText: {
    fontFamily: 'System',
    color: '#11b981', // Updated primary green for highlights
    fontWeight: '600', // Semibold for emphasis
  },
  featuresContainer: {
    marginTop: Spacing.md, // Further reduced top margin
    marginBottom: Spacing.sm, // Minimal bottom margin
    gap: Spacing.sm, // Tighter spacing between cards
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D2C', // Dark navy card background
    borderRadius: 12, // Slightly smaller radius
    padding: Spacing.md, // Reduced padding
    marginHorizontal: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  primaryIcon: {
    backgroundColor: '#11b981', // Primary green
  },
  blueIcon: {
    backgroundColor: '#4285F4', // Accent blue
  },
  purpleIcon: {
    backgroundColor: '#7E57C2', // Accent purple
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'System',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: 'System',
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },
  buttonContainer: {
    paddingBottom: Spacing.lg, // Reduced bottom padding
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md, // Reduced top margin
  },
  primaryButton: {
    borderRadius: 28,
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
    fontFamily: 'System',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700', // Bold for CTA
    textAlign: 'center',
  },
});
