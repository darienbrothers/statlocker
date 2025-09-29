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
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../../../shared/theme';

export default function WelcomeScreen() {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-10)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Set status bar style for black background
    StatusBar.setBarStyle('light-content', true);

    // Animate logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate title after logo
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
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
      StatusBar.setBarStyle('light-content', true);
    };
  }, []);

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/coach-intro');
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/auth?mode=signIn');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background Image */}
      <Image
        source={require('../../../assets/images/welcomeBackground.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      
      {/* Background Blend Overlay */}
      <View style={styles.backgroundBlend} />
      
      {/* Edge Fade Gradients for seamless blending */}
      <LinearGradient
        colors={['#000000', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
        style={styles.topGradient}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)', '#000000']}
        style={styles.bottomGradient}
      />
      
      {/* Left Edge Gradient */}
      <LinearGradient
        colors={['#000000', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.leftGradient}
      />
      
      {/* Right Edge Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)', '#000000']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.rightGradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Logo at top */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <Image
          source={require('../../../assets/logos/textLogoWhite.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Welcome Message */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.welcomeTitle}>
            Welcome to StatLocker
          </Text>
          <Text style={styles.taglineMain}>
            Track faster. Improve smarter.
          </Text>
        </Animated.View>

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
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </Pressable>

          {/* Already our user link - matching screenshot design */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5, // Reduced opacity for better text readability
  },
  backgroundBlend: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Stronger overlay for better text contrast
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%', // Reduced to show more of the athletes
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%', // Reduced to show more of the athletes
  },
  leftGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '25%', // Fade from left edge
  },
  rightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '25%', // Fade from right edge
  },
  safeArea: {
    flex: 1,
  },
  logoContainer: {
    paddingTop: Spacing.xl * 2, // Position similar to GRAVL
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    marginBottom: Spacing.lg,
    zIndex: 10, // Ensure logo is above gradients
  },
  logo: {
    width: 450, // Much bigger logo for impact
    height: 130, // Proportional height
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    zIndex: 10, // Ensure content is above gradients
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md, // Adjust spacing for new layout
  },
  welcomeTitle: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    textAlign: 'center' as const,
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: Spacing.sm,
    lineHeight: 38,
  },
  taglineMain: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center' as const,
    fontSize: 24,
    fontWeight: '500' as const,
    marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  taglineSecondary: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center' as const,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  buttonsContainer: {
    gap: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  primaryButton: {
    borderRadius: 25,
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
    ...Typography.styles.button,
    color: Colors.text.inverse,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  secondaryButtonText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
    fontSize: 16,
  },
  signInText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '700' as const, // Bold for "Sign In"
  },
});
