import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Pressable,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// Using multiple gradient overlays for sophisticated masking effect
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing } from '../../../shared/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  // Animations - Enhanced timing and values
  const backgroundScale = useRef(new Animated.Value(1.03)).current; // Ken Burns effect
  const maskOpacity = useRef(new Animated.Value(0)).current; // Mask fade-in
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-24)).current; // Raised higher
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(12)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    // Ken Burns background effect - subtle downward reveal
    Animated.timing(backgroundScale, {
      toValue: 1.0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Mask fade-in for seamless reveal
    Animated.timing(maskOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Simultaneous content entrance with background
    Animated.stagger(200, [
      // Logo entrance - enhanced timing with raised position
      Animated.parallel([
        Animated.timing(logoOpacity, { 
          toValue: 1, 
          duration: 800, 
          useNativeDriver: true 
        }),
        Animated.timing(logoTranslateY, { 
          toValue: -8, // Slightly raised but within safe area
          duration: 800, 
          useNativeDriver: true 
        }),
      ]),
      // Title entrance
      Animated.parallel([
        Animated.timing(titleOpacity, { 
          toValue: 1, 
          duration: 600, 
          useNativeDriver: true 
        }),
        Animated.timing(titleTranslateY, { 
          toValue: 0, 
          duration: 600, 
          useNativeDriver: true 
        }),
      ]),
      // Buttons entrance
      Animated.parallel([
        Animated.timing(buttonsOpacity, { 
          toValue: 1, 
          duration: 500, 
          useNativeDriver: true 
        }),
        Animated.timing(buttonsTranslateY, { 
          toValue: 0, 
          duration: 500, 
          useNativeDriver: true 
        }),
      ]),
    ]).start();
  }, []);

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/onboarding-intro');
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/auth?mode=signIn');
  };

  return (
    <View style={styles.root}>
      {/* Full screen background image with Ken Burns effect and opacity */}
      <Animated.View
        style={[
          styles.fullScreenImageContainer,
          {
            transform: [{ scale: backgroundScale }],
            opacity: 0.7, // Increased opacity to show more of the background
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/athleteBG.png')}
          style={styles.fullScreenImage}
          resizeMode="cover"
          accessible
          accessibilityIgnoresInvertColors
        />
      </Animated.View>

      {/* Bottom feather effect for image blending */}
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', '#000']}
        locations={[0, 0.7, 0.85, 1]}
        style={styles.imageBottomFeather}
      />
      
      {/* Overall screen gradient for text readability */}
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', '#000']}
        locations={[0, 0.4, 0.6, 0.8, 1]}
        style={styles.featherGradient}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.stackedContent}>
          {/* Spacer for top area */}
          <View style={styles.topSpacer} />

          {/* Bottom Content - Text and CTA buttons */}
          <View style={styles.bottomContentStack}>
            {/* Text Content closer to buttons */}
            <Animated.View
              style={[
                styles.bottomTextContainer,
                { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
              ]}
            >
              <Text style={styles.welcomeText}>Welcome to StatLocker</Text>
              <Text style={styles.taglineText}>
                StatLocker is your personal stat & performance hub, built to{' '}
                <Text style={styles.highlightText}>track your game</Text>, {' '}
                <Text style={styles.highlightText}>crush your goals</Text>, and fuel your future.
              </Text>
            </Animated.View>

            {/* Actions - Close to CTA for maximum impact */}
            <Animated.View
              style={[
                styles.bottomActions,
                { opacity: buttonsOpacity, transform: [{ translateY: buttonsTranslateY }] },
              ]}
            >
              <Pressable
                style={styles.primaryButton}
                onPress={handleGetStarted}
                accessibilityRole="button"
                accessibilityLabel="Get Started"
                hitSlop={8}
              >
                <LinearGradient
                  colors={[Colors.brand.primary, Colors.brand.primaryShade]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.primaryGrad}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleSignIn}
                accessibilityRole="button"
                accessibilityLabel="Log in"
                hitSlop={8}
              >
                <Text>
                  <Text style={styles.accountText}>Already have an account? </Text>
                  <Text style={styles.signIn}>Log In</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const MAX_WIDTH = 560; // keeps things tidy on large screens/tablets

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  // Top portion image container
  fullScreenImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%', // Only fill top 70% of screen
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    marginTop: 0,
  },
  // Bottom feather effect specifically for image area
  imageBottomFeather: {
    position: 'absolute',
    top: '50%', // Start feathering from middle of image area
    left: 0,
    right: 0,
    height: '50%', // Cover bottom half for smooth blend
  },
  // Overall feather gradient overlay for smooth transition
  featherGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Layout structure
  safe: {
    flex: 1,
  },
  stackedContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },
  // Text logo positioned at very top of screen
  topLogoContainer: {
    alignItems: 'center',
    paddingTop: 4, // Minimal padding - very close to top
    paddingBottom: 0, // No bottom padding
    zIndex: 2, // Ensure logo appears above background
  },
  topTextLogo: {
    width: 480, // Much bigger text logo
    height: 180, // Increased height for bigger logo
    maxWidth: '98%', // Maximum responsive sizing
  },
  // Center content container
  centerContentContainer: {
    flex: 1,
    justifyContent: 'center', // Center the text content
    alignItems: 'center',
    paddingTop: '20%', // Move text up from center
  },
  centerTextContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'System',
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700', // Bold for headlines
    lineHeight: 38,
    marginBottom: Spacing.md,
  },
  taglineText: {
    fontFamily: 'System',
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400', // Regular for body text
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.sm, // Add horizontal padding for better readability
  },
  highlightText: {
    fontFamily: 'System',
    color: Colors.brand.primary, // Primary green color for highlights
    fontWeight: '600', // Semibold for emphasis
  },
  taglineSecondary: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 16, // Smaller font size for "Track. Improve. Win."
    fontWeight: '500',
    lineHeight: 22,
    opacity: 0.9,
  },
  statsHighlight: {
    color: Colors.brand.primary, // Primary green color for "Stats"
    fontWeight: '700',
  },
  winHighlight: {
    color: Colors.text.primary, // White color for "Win"
    fontWeight: '700',
  },
  taglineHighlight: {
    color: Colors.brand.primary, // Primary green color (legacy)
    fontWeight: '700',
  },
  // Spacers for layout
  topSpacer: {
    flex: 1,
  },
  middleSpacer: {
    flex: 2, // Large spacer to push content to bottom
  },
  bottomSpacer: {
    flex: 0.5, // Smaller spacer to keep content closer to bottom
  },
  // Bottom content stack
  bottomContentStack: {
    paddingBottom: Spacing.xl * 2, // More breathing room from bottom
  },
  bottomTextContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 1.5, // Added more space between text and buttons
  },
  bottomTextWrap: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  bottomTitle: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    marginBottom: Spacing.md,
  },
  bottomSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    textAlign: 'center',
    opacity: 0.85,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: MAX_WIDTH,
  },
  // Bottom actions
  bottomActions: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignItems: 'center',
    gap: Spacing.lg,
    alignSelf: 'center',
  },
  primaryButton: {
    borderRadius: 28,
    overflow: 'hidden',
    alignSelf: 'stretch',
    minHeight: 56,
  },
  primaryGrad: {
    minHeight: 56,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'System',
    color: '#FFFFFF',
    fontWeight: '600', // Semibold for buttons
    fontSize: 18,
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: 'System',
    color: Colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400', // Regular for secondary text
    opacity: 0.8,
  },
  accountText: {
    fontFamily: 'System',
    color: Colors.text.primary, // White text for "Already have an account?"
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400', // Regular for body text
    opacity: 0.8,
  },
  signIn: {
    fontFamily: 'System',
    color: Colors.brand.primary,
    fontWeight: '600', // Semibold for emphasis
    opacity: 1,
  },
});
