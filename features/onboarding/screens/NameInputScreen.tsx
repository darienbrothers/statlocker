import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius } from '../../../shared/theme';
import { ProgressBar } from '../../../shared/components';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

export default function NameInputScreen() {
  const { data, updateName, setCurrentStep, markStepCompleted } = useOnboardingStore();
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [firstNameError, setFirstNameError] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Input refs
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-focus first name input
    setTimeout(() => {
      firstNameRef.current?.focus();
    }, 700);
  }, []);

  const validateInputs = () => {
    let isValid = true;
    
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    
    return isValid;
  };

  const handleContinue = async () => {
    if (!validateInputs()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save name data to store
    updateName(firstName, lastName);
    markStepCompleted(2);
    setCurrentStep(3);
    
    router.push('/(onboarding)/team-identity');
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const canContinue = firstName.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header with Back Button and Progress */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.progressContainer}>
          <ProgressBar currentStep={2} totalSteps={9} />
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>
              What should we call you?
            </Text>
            <Text style={styles.subtitleText}>
              We'll use this to personalize your Locker. (Update anytime in Settings.)
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                ref={firstNameRef}
                style={[
                  styles.textInput,
                  firstNameError && styles.errorInput
                ]}
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (firstNameError) setFirstNameError('');
                }}
                placeholder="Enter your first name"
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
              />
              {firstNameError ? (
                <Text style={styles.errorText}>{firstNameError}</Text>
              ) : null}
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Last Name
              </Text>
              <TextInput
                ref={lastNameRef}
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
              <Text style={styles.helperText}>
                Needed if you want to use your Locker for recruiting.
              </Text>
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.continueButton,
                !canContinue && styles.disabledButton
              ]}
              onPress={handleContinue}
              disabled={!canContinue}
            >
              <LinearGradient
                colors={
                  canContinue 
                    ? [Colors.brand.primary, Colors.brand.primaryShade]
                    : [Colors.text.tertiary, Colors.text.tertiary]
                }
                start={[0, 0]}
                end={[1, 1]}
                style={styles.continueButtonGradient}
              >
                <Text style={[
                  styles.continueButtonText,
                  !canContinue && styles.disabledButtonText
                ]}>
                  Continue
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  progressContainer: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  titleSection: {
    marginBottom: Spacing.xl * 2,
  },
  titleText: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    fontSize: 28,
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  subtitleText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
  },
  inputSection: {
    gap: Spacing.xl,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  inputLabel: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    color: Colors.status.error,
  },
  textInput: {
    ...Typography.styles.body,
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 52,
  },
  errorInput: {
    borderColor: Colors.status.error,
  },
  errorText: {
    ...Typography.styles.caption,
    color: Colors.status.error,
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    ...Typography.styles.caption,
    color: Colors.text.tertiary,
    fontSize: 12,
    marginTop: 4,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: Spacing.md,
  },
  continueButton: {
    borderRadius: 25,
    minHeight: 56,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonText: {
    ...Typography.styles.button,
    color: Colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: Colors.text.secondary,
  },
});
