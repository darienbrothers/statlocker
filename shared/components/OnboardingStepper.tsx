import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing } from '../theme';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function OnboardingStepper({
  currentStep,
  totalSteps,
  showBackButton = true,
  onBackPress,
}: OnboardingStepperProps) {
  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.surface.primary,
    }}>
      {/* Back Button */}
      {showBackButton ? (
        <Pressable
          onPress={handleBackPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.surface.elevated,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.border.primary,
          }}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={Colors.text.primary} 
          />
        </Pressable>
      ) : (
        <View style={{ width: 40 }} />
      )}

      {/* Step Indicator */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface.elevated,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border.secondary,
      }}>
        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: Typography.fonts.bodyMedium,
          color: Colors.brand.primary,
          fontWeight: '600',
        }}>
          {currentStep}
        </Text>
        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: Typography.fonts.body,
          color: Colors.text.secondary,
          marginHorizontal: 2,
        }}>
          /
        </Text>
        <Text style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: Typography.fonts.body,
          color: Colors.text.secondary,
        }}>
          {totalSteps}
        </Text>
        <Text style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: Typography.fonts.body,
          color: Colors.text.secondary,
          marginLeft: Spacing.xs,
        }}>
          Step
        </Text>
      </View>
    </View>
  );
}
