import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing } from '../../../shared/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Track Every Stat',
    subtitle: 'Every rep counts.',
    description: 'Log games with position-specific stats that matter most to your performance and growth.',
  },
  {
    id: 2,
    title: 'AI Insights',
    subtitle: 'Turn data into dominance.',
    description: 'Unlock personalized performance breakdowns and recommendations powered by advanced AI.',
  },
  {
    id: 3,
    title: 'Stay Organized',
    subtitle: 'Recruiting made simple.',
    description: 'Keep your athletic profile sharp with tools to manage schools, goals, and milestones.',
  },
  {
    id: 4,
    title: 'Crush Your Goals',
    subtitle: 'Progress you can see.',
    description: 'Set season goals, earn badges, and stay motivated as you push your game to the next level.',
  },
];

interface OnboardingSlidersProps {
  onComplete?: () => void;
}

export default function OnboardingSliders({ onComplete }: OnboardingSlidersProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const popupAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set status bar style
    StatusBar.setBarStyle('light-content', true);

    // Animate content entrance
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

  const goToSlide = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentSlide(index);
  };

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (currentSlide < slides.length - 1) {
      // Go to next slide
      goToSlide(currentSlide + 1);
    } else {
      // Last slide - show review popup or complete onboarding
      if (Math.random() > 0.5) { // 50% chance to show review popup
        setShowReviewPopup(true);
        // Animate popup entrance
        Animated.spring(popupAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      } else {
        completeOnboarding();
      }
    }
  };

  const completeOnboarding = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.replace('/(onboarding)/welcome');
    }
  };

  const handleReviewSubmit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Animate popup exit
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowReviewPopup(false);
      completeOnboarding();
    });
  };

  const handleReviewCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Animate popup exit
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowReviewPopup(false);
      completeOnboarding();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              style={[
                styles.progressDot,
                currentSlide === index && styles.progressDotActive,
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>

        {/* Slides */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.scrollView}
          >
            {slides.map((slide, index) => (
              <View key={slide.id} style={styles.slide}>
                {/* Content */}
                <View style={styles.slideContent}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  <Text style={styles.description}>{slide.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={[Colors.brand.primary, Colors.brand.primaryShade]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Review Popup */}
      {showReviewPopup && (
        <Animated.View
          style={[
            styles.popupOverlay,
            {
              opacity: popupAnim,
              transform: [
                {
                  scale: popupAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popupHeader}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconText}>S</Text>
              </View>
              <Text style={styles.popupTitle}>Enjoying StatLocker?</Text>
              <Text style={styles.popupSubtitle}>
                Tap a star to rate it on the App Store.
              </Text>
            </View>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} style={styles.star}>
                  <Text style={styles.starText}>★</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.popupButtons}>
              <Pressable style={styles.cancelButton} onPress={handleReviewCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitButton} onPress={handleReviewSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: Colors.brand.primary,
    width: 24,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: Typography.fonts.display,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: Typography.fonts.bodyMedium,
    color: Colors.brand.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.fonts.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  continueButton: {
    borderRadius: 12,
    minHeight: 56,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Typography.fonts.bodyMedium,
    fontWeight: '600',
  },
  // Review Popup Styles
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  popupContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 320,
  },
  popupHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appIconText: {
    fontSize: 24,
    fontFamily: Typography.fonts.display,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  popupTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: Typography.fonts.bodyMedium,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  popupSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Typography.fonts.body,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  star: {
    padding: Spacing.xs,
  },
  starText: {
    fontSize: 32,
    color: Colors.brand.primary,
  },
  popupButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.fonts.body,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  submitButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.fonts.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
