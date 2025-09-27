import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing } from '../../../shared/theme';

export default function WelcomeScreen() {
  // Animation values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(-10)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Set status bar style for white background
    StatusBar.setBarStyle('dark-content', true);

    // Animate title entrance
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate subtitle after title
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Animate buttons last
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    return () => {
      StatusBar.setBarStyle('dark-content', true);
    };
  }, []);

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/basic-info');
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/auth?mode=signIn');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Image - Top Portion */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/welcomeBG.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* Top Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.3)', 'transparent']}
          locations={[0, 0.3, 1]}
          style={styles.gradientOverlay}
        />
        {/* Bottom Blend Gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)', '#000000']}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.bottomBlendGradient}
        />
      </View>

      {/* Bottom Content Area */}
      <View style={styles.bottomContainer}>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
          <View style={styles.contentContainer}>
            {/* Title and Subtitle */}
            <View style={styles.textContainer}>
              <Animated.View
                style={[
                  styles.titleContainer,
                  {
                    opacity: titleOpacity,
                    transform: [{ translateY: titleTranslateY }],
                  },
                ]}
              >
                <Text style={styles.titleText}>Welcome to StatLocker</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.subtitleContainer,
                  {
                    opacity: subtitleOpacity,
                    transform: [{ translateY: subtitleTranslateY }],
                  },
                ]}
              >
                <Text style={styles.subtitleText}>
                  Track your journey, crush your goals, and elevate your game — all in one place.
                </Text>
              </Animated.View>
            </View>

            {/* Action Buttons */}
            <Animated.View
              style={[
                styles.buttonsContainer,
                {
                  opacity: buttonsOpacity,
                  transform: [{ translateY: buttonsTranslateY }],
                },
              ]}
            >
              {/* Start Journey Button */}
              <Pressable
                style={styles.primaryButton}
                onPress={handleGetStarted}
              >
                <LinearGradient
                  colors={[Colors.brand.primary, Colors.brand.primaryShade]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Start Journey</Text>
                </LinearGradient>
              </Pressable>

              {/* Sign In Link */}
              <Pressable
                style={styles.secondaryButton}
                onPress={handleSignIn}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account?{' '}
                  <Text style={styles.signInText}>Sign In</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageContainer: {
    flex: 0.6, // Takes up 60% of screen height
    width: '100%' as const,
    position: 'relative' as const,
  },
  backgroundImage: {
    width: '100%' as const,
    height: '130%' as const, // Make image larger for better positioning
    top: '-5%' as const, // Shift image down less to show more of the top
  },
  gradientOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  bottomBlendGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%' as const, // Covers bottom half of image area
    zIndex: 2,
  },
  bottomContainer: {
    flex: 0.4, // Takes up 40% of screen height
    backgroundColor: '#000000',
    justifyContent: 'space-between' as const,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  textContainer: {
    alignItems: 'center' as const,
  },
  titleContainer: {
    marginBottom: Spacing.sm,
  },
  titleText: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: Typography.fonts.display,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    fontWeight: '700' as const,
  },
  subtitleContainer: {
    marginBottom: Spacing.lg,
  },
  subtitleText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.fonts.body,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    fontWeight: '400' as const,
    opacity: 0.9,
  },
  buttonsContainer: {
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: 12,
    minHeight: 56,
    overflow: 'hidden' as const,
  },
  primaryButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 56,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Typography.fonts.bodyMedium,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 44,
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.fonts.body,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    opacity: 0.8,
  },
  signInText: {
    color: '#FFFFFF',
    fontFamily: Typography.fonts.bodyMedium,
    fontWeight: '600' as const,
    opacity: 1,
  },
});
