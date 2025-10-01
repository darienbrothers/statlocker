import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../../../shared/theme';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

export default function NameScreen() {
  const { setCurrentStep, markStepCompleted, updateName, data } = useOnboardingStore();
  
  // Form state
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set status bar style for dark background
    StatusBar.setBarStyle('light-content', true);

    // Animate entrance
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
      // Animate progress bar to 10% (1/10)
      Animated.timing(progressAnim, {
        toValue: 0.1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();

    return () => {
      StatusBar.setBarStyle('light-content', true);
    };
  }, []);

  const handleContinue = async () => {
    if (!firstName.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save user data
    updateName(firstName.trim(), lastName.trim());
    
    // Mark basic info as completed and move to next step
    markStepCompleted(2);
    setCurrentStep(3);
    
    setTimeout(() => {
      router.push('/(onboarding)/sport-selection');
    }, 200);
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const isFormValid = firstName.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logos/textLogoWhite.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Progress Bar and Navigation */}
          <View style={styles.navigationContainer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.stepIndicator}>1/10</Text>
          </View>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Content Section */}
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Headline and Subtext */}
              <View style={styles.textContent}>
                <Text style={styles.headline}>
                  What should we call you?
                </Text>
                
                <Text style={styles.subtext}>
                  Your name will appear on your Locker and make your journey feel personal.
                </Text>
              </View>

              {/* Input Fields */}
              <View style={styles.inputSection}>
                {/* First Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    First Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      firstNameFocused && styles.textInputFocused,
                    ]}
                    placeholder="Enter your first name"
                    placeholderTextColor="#666666"
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setFirstNameFocused(true)}
                    onBlur={() => setFirstNameFocused(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>

                {/* Last Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Last Name <Text style={styles.optional}>(optional)</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      lastNameFocused && styles.textInputFocused,
                    ]}
                    placeholder="Enter your last name"
                    placeholderTextColor="#666666"
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setLastNameFocused(true)}
                    onBlur={() => setLastNameFocused(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />
                </View>

                {/* Helper Note */}
                <View style={styles.helperContainer}>
                  <Ionicons name="information-circle" size={20} color="#4A90E2" />
                  <Text style={styles.helperText}>
                    This is just for personalization. We'll ask about recruiting details later if you're interested.
                  </Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>

          {/* CTA Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.continueButton,
                !isFormValid && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isFormValid}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={[
                styles.continueButtonText,
                !isFormValid && styles.continueButtonTextDisabled,
              ]}>
                Continue
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 180,
    height: 50,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  headline: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 40,
  },
  subtext: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  inputSection: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  required: {
    color: '#EF4444',
  },
  optional: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  textInput: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  textInputFocused: {
    borderColor: Colors.brand.primary,
    backgroundColor: '#374151',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  helperText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  continueButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 28,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonDisabled: {
    backgroundColor: '#374151',
  },
  continueButtonText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
