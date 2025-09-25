import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { OnboardingStep, StepState, InlineStepperProps } from '../types/Onboarding';

const { width } = Dimensions.get('window');

export default function InlineStepper({
  steps,
  currentIndex,
  completedSteps,
  showBack = false,
  onBack,
}: InlineStepperProps) {
  // Animation refs for connector rails
  const connectorAnims = useRef(
    steps.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    steps.forEach((_, index) => {
      const shouldFill = index < currentIndex;
      Animated.timing(connectorAnims[index], {
        toValue: shouldFill ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex]);

  const getStepState = (index: number): StepState => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  const isStepCompleted = (stepKey: string): boolean => {
    return completedSteps.includes(stepKey as any);
  };

  const handleStepPress = async (index: number, stepState: StepState) => {
    // Steps are no longer clickable - removed edit functionality
    return;
  };

  const handleBackPress = async () => {
    if (onBack) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBack();
    }
  };

  // Calculate available width for stepper nodes
  const backButtonWidth = showBack ? 40 : 0;
  const padding = Spacing.lg * 2;
  const availableWidth = width - backButtonWidth - padding;
  const nodeWidth = availableWidth / steps.length;

  return (
    <View style={{
      height: 64,
      backgroundColor: Colors.surface.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.border.secondary,
      ...Shadows.sm,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      }}>
        {/* Back Button */}
        {showBack && (
          <Pressable
            onPress={handleBackPress}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.surface.elevated,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: Spacing.md,
              borderWidth: 1,
              borderColor: Colors.border.primary,
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons 
              name="chevron-back" 
              size={18} 
              color={Colors.text.primary} 
            />
          </Pressable>
        )}

        {/* Stepper Nodes */}
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {steps.map((step, index) => {
            const stepState = getStepState(index);
            const isCompleted = isStepCompleted(step.key);
            const isLast = index === steps.length - 1;

            return (
              <View
                key={step.key}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Connector Rail */}
                {!isLast && (
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    left: '60%',
                    right: '-40%',
                    height: 2,
                    backgroundColor: Colors.border.secondary,
                    zIndex: 0,
                  }}>
                    <Animated.View
                      style={{
                        height: '100%',
                        backgroundColor: Colors.brand.primary,
                        width: connectorAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      }}
                    />
                  </View>
                )}

                {/* Step Node */}
                <Pressable
                  onPress={() => handleStepPress(index, stepState)}
                  style={{
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: stepState === 'current' }}
                  accessibilityLabel={`Step ${index + 1} of ${steps.length}: ${step.label}. ${
                    stepState === 'current' ? 'Current' : 
                    stepState === 'completed' ? 'Completed' : 'Upcoming'
                  }.`}
                >
                  {/* Node Circle */}
                  <MotiView
                    animate={{
                      backgroundColor: stepState === 'upcoming' 
                        ? Colors.surface.primary 
                        : Colors.brand.primary,
                      borderColor: stepState === 'upcoming' 
                        ? Colors.border.secondary 
                        : Colors.brand.primary,
                    }}
                    transition={{ type: 'timing', duration: 200 }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    {stepState === 'completed' ? (
                      <MotiView
                        from={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'timing', duration: 200 }}
                      >
                        <Ionicons 
                          name="checkmark" 
                          size={14} 
                          color="#FFFFFF" 
                        />
                      </MotiView>
                    ) : (
                      <Text style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: Typography.fonts.bodyMedium,
                        color: stepState === 'current' ? '#FFFFFF' : Colors.text.tertiary,
                        fontWeight: '600',
                      }}>
                        {index + 1}
                      </Text>
                    )}
                  </MotiView>

                  {/* Step Label */}
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 11,
                        lineHeight: 14,
                        fontFamily: stepState === 'current' 
                          ? Typography.fonts.bodyMedium 
                          : Typography.fonts.body,
                        color: stepState === 'current' 
                          ? Colors.brand.primary 
                          : stepState === 'completed'
                            ? Colors.text.primary
                            : Colors.text.tertiary,
                        fontWeight: stepState === 'current' ? '600' : '400',
                        textAlign: 'center',
                        maxWidth: nodeWidth - 8,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      accessibilityLabel={step.label}
                    >
                      {step.label}
                    </Text>

                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
