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
  }, [onFinish, logoOpacity, logoTranslateY, logoScale]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Centered Content */}
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
            source={require('../assets/logos/logoWhite.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

      </View>
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
    // Much bigger logo for maximum impact
    width: Math.min(width, height) * 0.75,
    height: Math.min(width, height) * 0.75,
    maxWidth: 450,
    maxHeight: 450,
    minWidth: 300,
    minHeight: 300,
  },
});
