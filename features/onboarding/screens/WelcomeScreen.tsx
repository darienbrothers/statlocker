import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 0,
    title: 'Welcome to StatLocker',
    subtitle: 'Track faster. Improve smarter.',
    description: 'Your all-in-one athletic performance platform.',
    image: require('../../../assets/images/logoBlack.png'),
  },
  {
    id: 1,
    title: 'Track Every Stat',
    subtitle: 'Own Every Rep',
    description:
      'Log games and practices with position-specific stats that matter to your performance.',
    image: require('../../../assets/images/trackStats.png'),
  },
  {
    id: 2,
    title: 'AI Insights',
    subtitle: 'Level Up Your Game',
    description:
      'Get personalized recommendations and performance analysis powered by advanced AI.',
    image: require('../../../assets/images/aiInsights.png'),
  },
  {
    id: 3,
    title: 'Stay Organized',
    subtitle: 'Build Your Profile',
    description:
      'Recruiting tools to stay organized and maintain a clean athletic profile.',
    image: require('../../../assets/images/planOrganize.png'),
  },
];

export default function WelcomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values for background effects
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation for background elements
    const createFloatingAnimation = (
      animValue: Animated.Value,
      duration: number,
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // Pulse animation for glow effects
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    createFloatingAnimation(floatingAnim1, 4000).start();
    createFloatingAnimation(floatingAnim2, 6000).start();
    pulseAnimation.start();
  }, []);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const goToSlide = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentSlide(index);
  };

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/name');
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to auth screen
    console.log('Navigate to sign in');
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors.surface.primary,
    }}>
      {/* Background Image */}
      <Image
        source={require('../../../assets/images/welcomeBackground.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      
      {/* Premium Background Overlay */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.1)',
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0.25)',
          'rgba(242, 244, 246, 0.3)'
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />


      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {slides.map((slide, index) => (
            <MotiView
              key={slide.id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: 'timing', 
                duration: 600, 
                delay: index * 200 
              }}
              style={{
                width,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Spacing.xl,
              }}
            >
              {/* Image Container */}
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: Spacing.xl,
              }}>
                <Image
                  source={slide.image}
                  style={{
                    width: width * 0.7,
                    height: width * 0.7,
                    maxHeight: 300,
                  }}
                  resizeMode="contain"
                />
              </View>

              {/* Content */}
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: Spacing.xl,
              }}>
                
                <Text style={{
                  ...Typography.styles.hero,
                  color: Colors.text.primary,
                  textAlign: 'center',
                  marginBottom: Spacing.sm,
                  fontSize: 36,
                  lineHeight: 42,
                }}>
                  {slide.title}
                </Text>
                
                <Text style={{
                  fontSize: 20,
                  lineHeight: 28,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.brand.primary,
                  textAlign: 'center',
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  {slide.subtitle}
                </Text>
                
                <Text style={{
                  ...Typography.styles.bodyLarge,
                  color: Colors.text.secondary,
                  textAlign: 'center',
                  lineHeight: 24,
                  paddingHorizontal: Spacing.md,
                }}>
                  {slide.description}
                </Text>
              </View>
            </MotiView>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: Spacing.lg,
        }}>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              style={{ padding: 4 }}
              onPress={() => goToSlide(index)}
            >
              <MotiView
                animate={{
                  width: currentSlide === index ? 24 : 6,
                  backgroundColor: currentSlide === index 
                    ? Colors.brand.primary 
                    : Colors.border.secondary,
                }}
                transition={{ type: 'timing', duration: 300 }}
                style={{
                  height: 6,
                  borderRadius: 3,
                }}
              />
            </Pressable>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={{
          paddingHorizontal: Spacing.xl,
          paddingBottom: Spacing.xl,
          gap: Spacing.md,
        }}>
          {/* Get Started Button */}
          <Pressable
            onPress={handleGetStarted}
            style={{
              backgroundColor: Colors.brand.primary,
              borderRadius: BorderRadius.lg,
              minHeight: 56,
              justifyContent: 'center',
              alignItems: 'center',
              ...Shadows.md,
            }}
          >
            <LinearGradient
              colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
              start={[0, 0]}
              end={[1, 1]}
              style={{
                width: '100%',
                paddingVertical: Spacing.lg,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: BorderRadius.lg,
                minHeight: 56,
              }}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 18,
                lineHeight: 24,
                fontFamily: Typography.fonts.bodyMedium,
                fontWeight: '600',
              }}>
                Get Started
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Sign In Link */}
          <Pressable
            style={{
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.xl,
              alignItems: 'center',
              minHeight: 44,
              justifyContent: 'center',
            }}
            onPress={handleSignIn}
          >
            <Text style={{
              color: Colors.text.primary,
              fontSize: 16,
              lineHeight: 24,
              fontFamily: Typography.fonts.body,
            }}>
              Already have an account?{' '}
              <Text style={{
                fontFamily: Typography.fonts.bodyMedium,
                fontWeight: '600',
                color: Colors.brand.primary,
              }}>
                Sign In
              </Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
