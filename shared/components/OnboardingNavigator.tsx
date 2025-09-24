import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  estimatedTime: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface OnboardingNavigatorProps {
  currentStep: number;
  totalSteps: number;
  currentStepId: string;
  steps: OnboardingStep[];
  showBackButton?: boolean;
  onBackPress?: () => void;
  onStepPress?: (step: OnboardingStep) => void;
}

export default function OnboardingNavigator({
  currentStep,
  totalSteps,
  currentStepId,
  steps,
  showBackButton = true,
  onBackPress,
  onStepPress,
}: OnboardingNavigatorProps) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const currentStepData = steps.find(step => step.id === currentStepId);

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handlePillPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSheetVisible(true);
    
    // Animate sheet in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseSheet = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate sheet out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSheetVisible(false);
    });
  };

  const handleStepPress = async (step: OnboardingStep) => {
    if (step.isLocked) {
      // Show lock toast
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // TODO: Show toast message
      return;
    }

    if (step.isCompleted || step.id === currentStepId) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      handleCloseSheet();
      
      if (onStepPress) {
        onStepPress(step);
      } else {
        router.push(step.route as any);
      }
    }
  };

  const getStepIcon = (step: OnboardingStep) => {
    if (step.id === currentStepId) {
      return '⏳';
    } else if (step.isCompleted) {
      return '✓';
    } else if (step.isLocked) {
      return '🔒';
    } else {
      return '●';
    }
  };

  const getStepIconColor = (step: OnboardingStep) => {
    if (step.id === currentStepId) {
      return Colors.brand.primary;
    } else if (step.isCompleted) {
      return Colors.status.success;
    } else if (step.isLocked) {
      return Colors.text.tertiary;
    } else {
      return Colors.text.secondary;
    }
  };

  return (
    <>
      {/* Navigation Header */}
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

        {/* Onboarding Navigator Pill */}
        <Pressable
          onPress={handlePillPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface.elevated,
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: Colors.border.secondary,
            ...Shadows.sm,
            minWidth: 200,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {/* Step Info */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: Typography.fonts.bodyMedium,
                color: Colors.text.primary,
                fontWeight: '600',
              }}>
                Step {currentStep} of {totalSteps} · {currentStepData?.title}
              </Text>
              
              {/* Progress Dots */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
                gap: 4,
              }}>
                {Array.from({ length: totalSteps }, (_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: index < currentStep 
                        ? Colors.brand.primary 
                        : Colors.border.secondary,
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Chevron */}
            <Ionicons 
              name="chevron-down" 
              size={16} 
              color={Colors.text.secondary}
              style={{ marginLeft: Spacing.sm }}
            />
          </View>
        </Pressable>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={isSheetVisible}
        transparent
        animationType="none"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
        onRequestClose={handleCloseSheet}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0.5)',
            opacity: opacityAnim,
          }}
        >
          <Pressable 
            style={{ flex: 1 }} 
            onPress={handleCloseSheet}
          />
          
          <Animated.View
            style={{
              backgroundColor: Colors.surface.primary,
              borderTopLeftRadius: Platform.OS === 'ios' ? 0 : 24,
              borderTopRightRadius: Platform.OS === 'ios' ? 0 : 24,
              paddingTop: Platform.OS === 'ios' ? 0 : Spacing.lg,
              paddingBottom: Platform.OS === 'ios' ? 0 : 34,
              maxHeight: '70%',
              ...Shadows.xl,
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              }],
            }}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={100} style={{ flex: 1 }}>
                <SheetContent 
                  steps={steps}
                  currentStepId={currentStepId}
                  onStepPress={handleStepPress}
                  onClose={handleCloseSheet}
                  getStepIcon={getStepIcon}
                  getStepIconColor={getStepIconColor}
                />
              </BlurView>
            ) : (
              <SheetContent 
                steps={steps}
                currentStepId={currentStepId}
                onStepPress={handleStepPress}
                onClose={handleCloseSheet}
                getStepIcon={getStepIcon}
                getStepIconColor={getStepIconColor}
              />
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

// Sheet Content Component
function SheetContent({ 
  steps, 
  currentStepId, 
  onStepPress, 
  onClose,
  getStepIcon,
  getStepIconColor 
}: {
  steps: OnboardingStep[];
  currentStepId: string;
  onStepPress: (step: OnboardingStep) => void;
  onClose: () => void;
  getStepIcon: (step: OnboardingStep) => string;
  getStepIconColor: (step: OnboardingStep) => string;
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* Handle Bar */}
      <View style={{
        alignItems: 'center',
        paddingVertical: Spacing.md,
      }}>
        <View style={{
          width: 36,
          height: 4,
          backgroundColor: Colors.border.secondary,
          borderRadius: 2,
        }} />
      </View>

      {/* Header */}
      <View style={{
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.border.secondary,
      }}>
        <Text style={{
          fontSize: 24,
          lineHeight: 32,
          fontFamily: Typography.fonts.display,
          color: Colors.text.primary,
          textAlign: 'center',
        }}>
          Onboarding Steps
        </Text>
      </View>

      {/* Steps List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.lg,
        }}
        accessibilityRole="tablist"
      >
        {steps.map((step, index) => (
          <MotiView
            key={step.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ 
              type: 'timing', 
              duration: 300, 
              delay: index * 50 
            }}
          >
            <Pressable
              onPress={() => onStepPress(step)}
              disabled={step.isLocked && step.id !== currentStepId && !step.isCompleted}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: Spacing.lg,
                paddingHorizontal: Spacing.md,
                borderRadius: BorderRadius.lg,
                backgroundColor: step.id === currentStepId 
                  ? `${Colors.brand.primary}10` 
                  : 'transparent',
                marginBottom: Spacing.sm,
                opacity: step.isLocked && step.id !== currentStepId && !step.isCompleted ? 0.5 : 1,
              }}
              accessibilityRole="tab"
              accessibilityLabel={`${step.title}, ${step.subtitle}`}
              accessibilityState={{ selected: step.id === currentStepId }}
            >
              {/* Step Icon */}
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: step.id === currentStepId 
                  ? Colors.brand.primary 
                  : Colors.surface.elevated,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: Spacing.md,
              }}>
                <Text style={{
                  fontSize: 16,
                  color: step.id === currentStepId ? '#FFFFFF' : getStepIconColor(step),
                }}>
                  {step.isCompleted ? '✓' : (index + 1).toString()}
                </Text>
              </View>

              {/* Step Info */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  fontWeight: '600',
                }}>
                  {step.title}
                </Text>
                <Text style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: Typography.fonts.body,
                  color: Colors.text.secondary,
                  marginTop: 2,
                }}>
                  {step.estimatedTime} • {step.subtitle}
                </Text>
              </View>

              {/* Status Indicator */}
              {step.isCompleted && (
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={Colors.status.success} 
                  />
                </MotiView>
              )}
            </Pressable>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}
