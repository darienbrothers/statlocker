import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Text,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TYPOGRAPHY_TOKENS } from '../shared/theme/typography';
import { Colors } from '../shared/theme/colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set status bar to light content for background
    StatusBar.setBarStyle('light-content', true);

    // Elite logo entrance with spring bounce
    setTimeout(() => {
      // Haptic feedback on logo entrance
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Show loading indicator after logo appears
    setTimeout(() => {
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 900);

    // Navigate to welcome screen - shorter duration for clean logo experience
    setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        router.replace('/welcome');
      }
    }, 2000);

    return () => {
      StatusBar.setBarStyle('light-content', true);
    };
  }, [onFinish, logoOpacity, logoTranslateY, logoScale, loadingOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Logo Container */}
      <View style={styles.centerContainer}>
        {/* Logo with Enhanced Animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { translateY: logoTranslateY },
                { scale: logoScale }
              ],
            },
          ]}
        >
          <Image
            source={require('../assets/logos/textLogoWhite.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </Animated.View>
      </View>

      {/* Loading Indicator at Bottom */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: loadingOpacity,
          },
        ]}
      >
        <ActivityIndicator 
          size="large" 
          color={Colors.text.primary} 
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logo: {
    // Much bigger text logo for maximum impact
    width: width * 0.9, // 90% of screen width
    height: 150, // Fixed height for text logo
    maxWidth: 500,
    maxHeight: 180,
    minWidth: 350,
    minHeight: 120,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80, // Position near bottom of screen
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 12,
  },
  loadingText: {
    ...TYPOGRAPHY_TOKENS.bodyLarge,
    color: Colors.text.primary,
  },
});
