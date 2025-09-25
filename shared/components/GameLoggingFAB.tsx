import React, { useRef, useEffect } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, BorderRadius, Shadows } from '../theme';

interface GameLoggingFABProps {
  onPress: () => void;
  isVisible?: boolean;
}

export const GameLoggingFAB: React.FC<GameLoggingFABProps> = ({
  onPress,
  isVisible = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Continuous pulse animation
  useEffect(() => {
    const createPulseAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const pulseAnimation = createPulseAnimation();
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  if (!isVisible) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 100 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 100 }}
      transition={{ type: 'spring', damping: 15, stiffness: 150 }}
      style={{
        position: 'absolute',
        bottom: 100, // Above tab bar
        left: '50%',
        transform: [{ translateX: -32 }], // Center the 64px FAB
        zIndex: 1000,
      }}
    >
      {/* Glow Effect */}
      <View
        style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: 36,
          backgroundColor: Colors.brand.primary,
          opacity: 0.2,
          ...Shadows.lg,
        }}
      />
      
      {/* Main FAB */}
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim },
          ],
        }}
      >
        <Pressable
          onPress={handlePress}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            overflow: 'hidden',
            ...Shadows.xl,
          }}
        >
          <LinearGradient
            colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons 
              name="flash" 
              size={28} 
              color="#FFFFFF" 
            />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Ripple Effect on Press */}
      <MotiView
        from={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ type: 'timing', duration: 600, loop: false }}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: Colors.brand.primary,
          opacity: 0,
        }}
      />
    </MotiView>
  );
};

export default GameLoggingFAB;
