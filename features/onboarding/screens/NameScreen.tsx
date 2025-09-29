import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  InputAccessoryView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import InlineStepper from '../../../shared/components/InlineStepper';
import { onboardingSteps, getCurrentStepIndex } from '../../../shared/config/onboardingSteps';
import { OnboardingStepKey } from '../../../shared/types/Onboarding';

// Constants for layout calculations
const STEPPER_HEIGHT = 72;
const BUTTON_HEIGHT = 88; // Button + padding
const ERROR_SPACE_HEIGHT = 20; // Reserved space for error messages
const INPUT_ACCESSORY_VIEW_ID = 'nameInputAccessory';

export default function NameScreen() {
  // Safe area and layout
  const insets = useSafeAreaInsets();

  // Get current step info
  const currentStepKey: OnboardingStepKey = 'name';
  const currentStepIndex = getCurrentStepIndex(currentStepKey);
  const completedSteps: OnboardingStepKey[] = []; // TODO: Load from AsyncStorage
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);

  // Analytics tracking
  const [stepStartTime] = useState(Date.now());
  const [hasInteracted, setHasInteracted] = useState(false);

  // Animation refs
  const bounceAnim = useRef(new Animated.Value(1)).current;
  
  // Floating label animations
  const firstNameLabelAnim = useRef(new Animated.Value(firstName || firstNameFocused ? 1 : 0)).current;
  const lastNameLabelAnim = useRef(new Animated.Value(lastName || lastNameFocused ? 1 : 0)).current;
  
  // Validation icon animations
  const firstNameIconAnim = useRef(new Animated.Value(0)).current;
  const lastNameIconAnim = useRef(new Animated.Value(0)).current;
  
  // Input shake animations
  const firstNameShakeAnim = useRef(new Animated.Value(0)).current;
      const lastNameShakeAnim = useRef(new Animated.Value(0)).current;
  
  const handleInputFocus = (node: any, index: number) => {
    setCurrentInputIndex(index);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      node?.measureLayout(
        scrollViewRef.current?.getInnerViewNode(),
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
        },
        () => {}
      );
    }, 200);
  };

  const handleInputAccessoryPrevious = () => {
    if (currentInputIndex > 0) {
      firstNameInputRef.current?.focus();
    }
  };

  const handleInputAccessoryNext = () => {
    if (currentInputIndex < 1) {
      lastNameInputRef.current?.focus();
    }
  };

  const handleInputAccessoryDone = () => {
    Keyboard.dismiss();
    if (isFormValid) {
      handleContinue();
    }
  };

  // Button breathing animation
  const breathingAnim = useRef(new Animated.Value(0)).current;
  

  // Input refs for keyboard handling
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form validation
  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;
  const isFormValid = isFirstNameValid && isLastNameValid;

  // Analytics functions
  const trackStepCompletion = () => {
    const timeToComplete = Date.now() - stepStartTime;
    console.log('Analytics: Name step completed', {
      timeToComplete,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    // TODO: Send to analytics service
  };

  const trackDropOff = () => {
    if (hasInteracted) {
      const timeSpent = Date.now() - stepStartTime;
      console.log('Analytics: Name step drop-off', {
        timeSpent,
        hasFirstName: firstName.trim().length > 0,
        hasLastName: lastName.trim().length > 0,
      });
      // TODO: Send to analytics service
    }
  };

  // Load saved data
  const loadData = async () => {
    try {
      const savedFirstName = await AsyncStorage.getItem('onboarding_firstName');
      const savedLastName = await AsyncStorage.getItem('onboarding_lastName');

      if (savedFirstName) setFirstName(savedFirstName);
      if (savedLastName) setLastName(savedLastName);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  // Save data
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('onboarding_firstName', firstName.trim());
      await AsyncStorage.setItem('onboarding_lastName', lastName.trim());
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  // Load data on mount and cleanup
  useEffect(() => {
    loadData();

    // Cleanup timeout on unmount and track drop-off
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      trackDropOff();
    };
  }, []);

  // Save data when inputs change
  useEffect(() => {
    if (firstName || lastName) {
      saveData();
    }
  }, [firstName, lastName]);

  // Button animation when form becomes valid
  useEffect(() => {
    if (isFormValid) {
      // Initial bounce animation
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.02,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Start breathing animation
      const breathingLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(breathingAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]),
        { iterations: -1 }
      );
      breathingLoop.start();

      return () => {
        breathingLoop.stop();
      };
    } else {
      // Stop breathing animation when form becomes invalid
      breathingAnim.setValue(0);
    }
  }, [isFormValid]);

  // Floating label animations
  useEffect(() => {
    Animated.timing(firstNameLabelAnim, {
      toValue: firstName || firstNameFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [firstName, firstNameFocused]);

  useEffect(() => {
    Animated.timing(lastNameLabelAnim, {
      toValue: lastName || lastNameFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [lastName, lastNameFocused]);

  // Validation icon animations
  useEffect(() => {
    Animated.timing(firstNameIconAnim, {
      toValue: isFirstNameValid && firstName.trim().length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFirstNameValid, firstName]);

  useEffect(() => {
    Animated.timing(lastNameIconAnim, {
      toValue: isLastNameValid && lastName.trim().length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isLastNameValid, lastName]);

  // Shake animation function
  const shakeInput = (shakeAnim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 3, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -3, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 2, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // Validation functions
  const validateFirstName = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      setFirstNameError('First name is required');
      shakeInput(firstNameShakeAnim);
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      setLastNameError('Last name is required');
      shakeInput(lastNameShakeAnim);
      return false;
    }
    setLastNameError('');
    return true;
  };

  // Handle input changes with validation
  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (text.trim().length > 0) {
      setFirstNameError('');
    }
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (text.trim().length > 0) {
      setLastNameError('');
    }
  };

  // Handle input focus and blur with floating labels
  const handleFirstNameFocus = () => {
    setFirstNameFocused(true);
    setHasInteracted(true); // Track user interaction
    handleInputFocus(firstNameInputRef.current, 0);
  };

  const handleFirstNameBlur = () => {
    setFirstNameFocused(false);
    validateFirstName(firstName);
  };

  const handleLastNameFocus = () => {
    setLastNameFocused(true);
    setHasInteracted(true); // Track user interaction
    handleInputFocus(lastNameInputRef.current, 1);
  };

      const handleLastNameBlur = () => {
    setLastNameFocused(false);
    validateLastName(lastName);
  };

  // Normalize and capitalize names properly
  const normalizeName = (name: string) => {
    return name
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .split(' ')
      .map(word => {
        // Handle hyphens and apostrophes
        return word
          .split(/(-|')/)
          .map((part, index) => {
            if (part === '-' || part === "'") return part;
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          })
          .join('');
      })
      .join(' ');
  };

  const handleContinue = async () => {
    if (!isFormValid) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Track completion
    trackStepCompletion();

    // Button press animation
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // Normalize and save final names
      const finalFirstName = normalizeName(firstName);
      const finalLastName = normalizeName(lastName);
      
      // Save normalized names
      AsyncStorage.setItem('onboarding_firstName', finalFirstName);
      AsyncStorage.setItem('onboarding_lastName', finalLastName);

      // Check if editing from review
      const editingFromReview = await AsyncStorage.getItem('editingFromReview');
      if (editingFromReview === 'true') {
        await AsyncStorage.removeItem('editingFromReview');
        router.push('/onboarding/review');
      } else {
        router.push('/onboarding/profile-image');
      }
    });
  };

  const handleBackPress = () => {
    router.back();
  };


  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: Colors.surface.primary,
    }}>
            <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={[]}
        showBack={true}
        onBack={handleBackPress}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + STEPPER_HEIGHT : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              paddingHorizontal: Spacing.xl,
              paddingTop: Spacing.lg,
              paddingBottom: BUTTON_HEIGHT + insets.bottom + 24,
              minHeight: 600,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View>
              {/* Header Section */}
              <View style={{
                alignItems: 'center',
                paddingVertical: Spacing.xl,
              }}>
                
                <Text style={{
                  fontSize: 20,
                  lineHeight: 28,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.brand.primary,
                  textAlign: 'center',
                  marginBottom: Spacing.sm,
                  fontWeight: '600',
                }}>
                  Welcome to your locker 🔐
                </Text>
                
                <Text style={{
                  fontSize: 30,
                  lineHeight: 36,
                  fontFamily: Typography.fonts.display,
                  color: Colors.text.primary,
                  textAlign: 'center',
                  marginBottom: 10, // Tighter spacing: 8-12px
                }}>
                  What's your name, champ?
                </Text>
                
                <Text style={{
                  ...Typography.styles.bodyLarge,
                  color: Colors.text.secondary,
                  textAlign: 'center',
                  lineHeight: 24,
                  paddingHorizontal: Spacing.md,
                }}>
                  Let's get you set up with a personalized experience in your StatLocker.
                </Text>
              </View>

              {/* Input Section - Soft Card */}
              <View style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: 16,
                padding: 16,
                marginTop: 24, // 24px vertical rhythm
                ...Shadows.sm,
              }}>
                {/* First Name */}
                <MotiView
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 400, delay: 200 }}
                >
                  <View style={{ position: 'relative' }}>
                    {/* Floating Label */}
                    <Animated.Text
                      style={{
                        position: 'absolute',
                        left: Spacing.lg,
                        zIndex: 1,
                        backgroundColor: Colors.surface.elevated,
                        paddingHorizontal: 4,
                        fontSize: firstNameLabelAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 12],
                        }),
                        lineHeight: 16,
                        fontFamily: Typography.fonts.bodyMedium,
                        color: firstNameFocused ? Colors.brand.primary : Colors.text.secondary,
                        fontWeight: '600',
                        top: firstNameLabelAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [18, -8],
                        }),
                      }}
                    >
                      First Name
                    </Animated.Text>

                    {/* Input Container with Shake Animation */}
                    <Animated.View
                      style={{
                        transform: [{ translateX: firstNameShakeAnim }],
                      }}
                    >
                      <TextInput
                        ref={firstNameInputRef}
                        style={{
                          fontSize: 18,
                          lineHeight: 24,
                          fontFamily: Typography.fonts.body,
                          color: Colors.text.primary,
                          backgroundColor: Colors.surface.primary,
                          borderRadius: BorderRadius.lg,
                          borderWidth: 2,
                          borderColor: firstNameError 
                            ? Colors.status.error 
                            : firstNameFocused 
                              ? Colors.brand.primary 
                              : Colors.border.secondary,
                          paddingHorizontal: Spacing.lg,
                          paddingVertical: Spacing.lg,
                          paddingRight: 50, // Space for validation icon
                          minHeight: 56,
                          ...Shadows.sm,
                        }}
                        value={firstName}
                        onChangeText={handleFirstNameChange}
                        onBlur={handleFirstNameBlur}
                        onFocus={handleFirstNameFocus}
                        placeholder=''
                        placeholderTextColor={Colors.text.tertiary}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => lastNameInputRef.current?.focus()}
                        inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_VIEW_ID : undefined}
                      />

                      {/* Validation Icon */}
                      <Animated.View
                        style={{
                          position: 'absolute',
                          right: Spacing.lg,
                          top: '50%',
                          marginTop: -10,
                          opacity: firstNameIconAnim,
                          transform: [{ scale: firstNameIconAnim }],
                        }}
                      >
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={Colors.status.success} 
                        />
                      </Animated.View>
                    </Animated.View>

                    {/* Reserved error space */}
                    <View style={{ height: ERROR_SPACE_HEIGHT, justifyContent: 'flex-start' }}>
                      {firstNameError ? (
                        <Text style={{
                          fontSize: 12,
                          lineHeight: 16,
                          fontFamily: Typography.fonts.body,
                          color: Colors.status.error,
                          marginTop: Spacing.xs,
                        }}>
                          {firstNameError}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </MotiView>

                {/* Last Name */}
                <MotiView
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 400, delay: 300 }}
                  style={{ marginTop: Spacing.lg }}
                >
                  <View style={{ position: 'relative' }}>
                    {/* Floating Label */}
                    <Animated.Text
                      style={{
                        position: 'absolute',
                        left: Spacing.lg,
                        zIndex: 1,
                        backgroundColor: Colors.surface.elevated,
                        paddingHorizontal: 4,
                        fontSize: lastNameLabelAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 12],
                        }),
                        lineHeight: 16,
                        fontFamily: Typography.fonts.bodyMedium,
                        color: lastNameFocused ? Colors.brand.primary : Colors.text.secondary,
                        fontWeight: '600',
                        top: lastNameLabelAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [18, -8],
                        }),
                      }}
                    >
                      Last Name
                    </Animated.Text>

                    {/* Input Container with Shake Animation */}
                    <Animated.View
                      style={{
                        transform: [{ translateX: lastNameShakeAnim }],
                      }}
                    >
                      <TextInput
                        ref={lastNameInputRef}
                        style={{
                          fontSize: 18,
                          lineHeight: 24,
                          fontFamily: Typography.fonts.body,
                          color: Colors.text.primary,
                          backgroundColor: Colors.surface.primary,
                          borderRadius: BorderRadius.lg,
                          borderWidth: 2,
                          borderColor: lastNameError 
                            ? Colors.status.error 
                            : lastNameFocused 
                              ? Colors.brand.primary 
                              : Colors.border.secondary,
                          paddingHorizontal: Spacing.lg,
                          paddingVertical: Spacing.lg,
                          paddingRight: 50, // Space for validation icon
                          minHeight: 56,
                          ...Shadows.sm,
                        }}
                        value={lastName}
                        onChangeText={handleLastNameChange}
                        onBlur={handleLastNameBlur}
                        onFocus={handleLastNameFocus}
                        placeholder=''
                        placeholderTextColor={Colors.text.tertiary}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                        inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_VIEW_ID : undefined}
                      />

                      {/* Validation Icon */}
                      <Animated.View
                        style={{
                          position: 'absolute',
                          right: Spacing.lg,
                          top: '50%',
                          marginTop: -10,
                          opacity: lastNameIconAnim,
                          transform: [{ scale: lastNameIconAnim }],
                        }}
                      >
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={Colors.status.success} 
                        />
                      </Animated.View>
                    </Animated.View>

                    {/* Reserved error space */}
                    <View style={{ height: ERROR_SPACE_HEIGHT, justifyContent: 'flex-start' }}>
                      {lastNameError ? (
                        <Text style={{
                          fontSize: 12,
                          lineHeight: 16,
                          fontFamily: Typography.fonts.body,
                          color: Colors.status.error,
                          marginTop: Spacing.xs,
                        }}>
                          {lastNameError}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </MotiView>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Fixed Button Container */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        paddingBottom: 34,
        backgroundColor: Colors.surface.primary,
        borderTopWidth: 0.5,
        borderTopColor: Colors.border.secondary,
      }}>
        {/* Trust Message */}
        <Text style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: Typography.fonts.body,
          color: Colors.text.tertiary,
          textAlign: 'center',
          marginBottom: Spacing.md,
          opacity: isFormValid ? 1 : 0.7,
        }}>
          We'll use your name to personalize your setup.
        </Text>

        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <Pressable
            style={{
              borderRadius: BorderRadius.xl,
              overflow: 'hidden',
              opacity: isFormValid ? 1 : 0.6,
              ...(isFormValid ? Shadows.lg : {}),
            }}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            {/* Breathing Overlay */}
            {isFormValid && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#FFFFFF',
                  opacity: breathingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.1],
                  }),
                  borderRadius: BorderRadius.xl,
                }}
              />
            )}

            <LinearGradient
              colors={
                isFormValid
                  ? [Colors.brand.primary, `${Colors.brand.primary}DD`]
                  : [Colors.border.secondary, Colors.border.primary]
              }
              style={{
                paddingVertical: Spacing.lg,
                paddingHorizontal: Spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
              }}>
                <Text style={{
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: isFormValid ? Colors.text.inverse : Colors.text.tertiary,
                  fontWeight: '600',
                }}>
                  Add Profile Photo
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={isFormValid ? Colors.text.inverse : Colors.text.tertiary}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>


      {/* iOS Input Accessory View */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={INPUT_ACCESSORY_VIEW_ID}>
          <View style={{
            backgroundColor: Colors.surface.elevated,
            borderTopWidth: 0.5,
            borderTopColor: Colors.border.secondary,
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.sm,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Previous/Next Navigation */}
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <Pressable
                onPress={handleInputAccessoryPrevious}
                disabled={currentInputIndex === 0}
                style={{
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  opacity: currentInputIndex === 0 ? 0.4 : 1,
                }}
              >
                <Ionicons 
                  name="chevron-up" 
                  size={20} 
                  color={Colors.text.primary} 
                />
              </Pressable>
              
              <Pressable
                onPress={handleInputAccessoryNext}
                disabled={currentInputIndex === 1}
                style={{
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  opacity: currentInputIndex === 1 ? 0.4 : 1,
                }}
              >
                <Ionicons 
                  name="chevron-down" 
                  size={20} 
                  color={Colors.text.primary} 
                />
              </Pressable>
            </View>

            {/* Done Button */}
            <Pressable
              onPress={handleInputAccessoryDone}
              style={{
                backgroundColor: isFormValid ? Colors.brand.primary : Colors.border.secondary,
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.sm,
                borderRadius: BorderRadius.md,
                opacity: isFormValid ? 1 : 0.6,
              }}
            >
              <Text style={{
                fontSize: 16,
                lineHeight: 20,
                fontFamily: Typography.fonts.bodyMedium,
                color: isFormValid ? '#FFFFFF' : Colors.text.tertiary,
                fontWeight: '600',
              }}>
                {isFormValid ? 'Next' : 'Done'}
              </Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
}
