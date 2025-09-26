import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useAuthStore } from '../../../shared/stores/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';

type Mode = 'signIn' | 'signUp';

export default function AuthScreen() {
  const { signIn, signUp, resetPassword, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<Mode>('signUp');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };

    switch (field) {
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Please enter a valid email';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (mode === 'signIn' && !value.trim()) {
          errors.password = 'Password is required';
        } else if (mode === 'signUp' && value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'firstName':
        if (mode === 'signUp' && !value.trim()) {
          errors.firstName = 'First name is required';
        } else {
          delete errors.firstName;
        }
        break;
      case 'lastName':
        if (mode === 'signUp' && !value.trim()) {
          errors.lastName = 'Last name is required';
        } else {
          delete errors.lastName;
        }
        break;
    }

    setFieldErrors(errors);
  };

  const isFormValid = () => {
    const hasNoErrors = Object.keys(fieldErrors).length === 0;

    if (mode === 'signUp') {
      return hasNoErrors && firstName.trim() && lastName.trim() && email.trim() && password.length >= 6;
    } else {
      return hasNoErrors && email.trim() && password.trim();
    }
  };

  const handleAuth = async () => {
    if (!isFormValid()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    clearError();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (mode === 'signUp') {
        await signUp(email, password, firstName, lastName);
        // Navigate to onboarding for new users
        router.replace('/(onboarding)/welcome');
      } else {
        await signIn(email, password);
        // Navigate to main app for existing users
        router.replace('/(tabs)/dashboard');
      }
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Error is handled by the store
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setFieldErrors({ ...fieldErrors, email: 'Please enter your email address' });
      return;
    }

    try {
      await resetPassword(email);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Show success message (you might want to add a toast or alert here)
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const toggleMode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
    clearError();
    setFieldErrors({});
  };

  const handleGoBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <LinearGradient
      colors={[Colors.surface.primary, Colors.surface.elevated]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, padding: Spacing.xl }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginTop: 60, marginBottom: 32 }}>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: Colors.brand.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <Ionicons name="stats-chart" size={28} color="#FFFFFF" />
              </View>

              <Text style={{
                fontSize: 28,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                marginBottom: 8,
                textAlign: 'center',
                fontWeight: '700',
              }}>
                {mode === 'signIn' ? 'Welcome Back' : 'Create Your Account'}
              </Text>

              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                textAlign: 'center',
              }}>
                Your stats. Your story. Your future.
              </Text>
            </View>

            {/* Mode Selector */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: Colors.surface.elevated2,
              borderRadius: BorderRadius.lg,
              padding: 4,
              marginBottom: Spacing.lg,
            }}>
              <Pressable
                style={[
                  {
                    flex: 1,
                    paddingVertical: Spacing.md,
                    alignItems: 'center',
                    borderRadius: BorderRadius.md,
                  },
                  mode === 'signIn' && {
                    backgroundColor: Colors.brand.primary,
                  }
                ]}
                onPress={toggleMode}
              >
                <Text style={[
                  {
                    fontSize: 14,
                    fontFamily: Typography.fonts.bodyMedium,
                    fontWeight: '600',
                  },
                  mode === 'signIn' ? { color: '#FFFFFF' } : { color: Colors.text.secondary }
                ]}>
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                style={[
                  {
                    flex: 1,
                    paddingVertical: Spacing.md,
                    alignItems: 'center',
                    borderRadius: BorderRadius.md,
                  },
                  mode === 'signUp' && {
                    backgroundColor: Colors.brand.primary,
                  }
                ]}
                onPress={toggleMode}
              >
                <Text style={[
                  {
                    fontSize: 14,
                    fontFamily: Typography.fonts.bodyMedium,
                    fontWeight: '600',
                  },
                  mode === 'signUp' ? { color: '#FFFFFF' } : { color: Colors.text.secondary }
                ]}>
                  Create Account
                </Text>
              </Pressable>
            </View>

            {/* Form */}
            <View style={{ gap: Spacing.lg }}>
              {mode === 'signUp' && (
                <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={{
                        height: 56,
                        backgroundColor: Colors.surface.elevated2,
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        borderColor: fieldErrors.firstName ? Colors.status.error : Colors.border.secondary,
                        paddingHorizontal: Spacing.lg,
                        fontSize: 16,
                        fontFamily: Typography.fonts.body,
                        color: Colors.text.primary,
                      }}
                      placeholder="First name"
                      placeholderTextColor={Colors.text.secondary}
                      value={firstName}
                      onChangeText={(text) => {
                        setFirstName(text);
                        validateField('firstName', text);
                      }}
                      textContentType="givenName"
                      autoCapitalize="words"
                    />
                    {fieldErrors.firstName && (
                      <Text style={{
                        fontSize: 12,
                        fontFamily: Typography.fonts.body,
                        color: Colors.status.error,
                        marginTop: 4,
                        marginLeft: 4,
                      }}>
                        {fieldErrors.firstName}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={{
                        height: 56,
                        backgroundColor: Colors.surface.elevated2,
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        borderColor: fieldErrors.lastName ? Colors.status.error : Colors.border.secondary,
                        paddingHorizontal: Spacing.lg,
                        fontSize: 16,
                        fontFamily: Typography.fonts.body,
                        color: Colors.text.primary,
                      }}
                      placeholder="Last name"
                      placeholderTextColor={Colors.text.secondary}
                      value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        validateField('lastName', text);
                      }}
                      textContentType="familyName"
                      autoCapitalize="words"
                    />
                    {fieldErrors.lastName && (
                      <Text style={{
                        fontSize: 12,
                        fontFamily: Typography.fonts.body,
                        color: Colors.status.error,
                        marginTop: 4,
                        marginLeft: 4,
                      }}>
                        {fieldErrors.lastName}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <View>
                <TextInput
                  style={{
                    height: 56,
                    backgroundColor: Colors.surface.elevated2,
                    borderRadius: BorderRadius.lg,
                    borderWidth: 1,
                    borderColor: fieldErrors.email ? Colors.status.error : Colors.border.secondary,
                    paddingHorizontal: Spacing.lg,
                    fontSize: 16,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.primary,
                  }}
                  placeholder="Email"
                  placeholderTextColor={Colors.text.secondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    validateField('email', text);
                  }}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {fieldErrors.email && (
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.status.error,
                    marginTop: 4,
                    marginLeft: 4,
                  }}>
                    {fieldErrors.email}
                  </Text>
                )}
              </View>

              {(mode === 'signIn' || mode === 'signUp') && (
                <View>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      style={{
                        height: 56,
                        backgroundColor: Colors.surface.elevated2,
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        borderColor: fieldErrors.password ? Colors.status.error : Colors.border.secondary,
                        paddingHorizontal: Spacing.lg,
                        paddingRight: 50,
                        fontSize: 16,
                        fontFamily: Typography.fonts.body,
                        color: Colors.text.primary,
                      }}
                      placeholder="Password"
                      placeholderTextColor={Colors.text.secondary}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        validateField('password', text);
                      }}
                      secureTextEntry={!showPassword}
                      textContentType="password"
                    />
                    <Pressable
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: 18,
                      }}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={Colors.text.secondary}
                      />
                    </Pressable>
                  </View>
                  {fieldErrors.password && (
                    <Text style={{
                      fontSize: 12,
                      fontFamily: Typography.fonts.body,
                      color: Colors.status.error,
                      marginTop: 4,
                      marginLeft: 4,
                    }}>
                      {fieldErrors.password}
                    </Text>
                  )}
                </View>
              )}

              {error && (
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.body,
                  color: Colors.status.error,
                  textAlign: 'center',
                  backgroundColor: Colors.status.error + '20',
                  padding: Spacing.md,
                  borderRadius: BorderRadius.md,
                }}>
                  {error}
                </Text>
              )}

              {/* Primary CTA */}
              <Pressable
                style={[
                  {
                    height: 56,
                    backgroundColor: Colors.brand.primary,
                    borderRadius: BorderRadius.xl,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Spacing.sm,
                    ...Shadows.sm,
                  },
                  (isLoading || !isFormValid()) && { opacity: 0.6 }
                ]}
                onPress={handleAuth}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{
                    fontSize: 16,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}>
                    {mode === 'signIn' ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </Pressable>

              {/* Secondary Links */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: Spacing.sm,
              }}>
                <Pressable onPress={toggleMode}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    fontWeight: '600',
                  }}>
                    {mode === 'signIn'
                      ? 'Need an account? Sign up'
                      : 'Have an account? Sign in'}
                  </Text>
                </Pressable>
                {mode === 'signIn' && (
                  <Pressable onPress={handleResetPassword}>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.body,
                      color: Colors.text.secondary,
                    }}>
                      Forgot Password?
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Legal */}
              <Text style={{
                fontSize: 12,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                textAlign: 'center',
                marginTop: Spacing.xl,
                marginHorizontal: Spacing.sm,
                lineHeight: 16,
              }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Back Button */}
      <Pressable
        style={{
          position: 'absolute',
          top: 60,
          left: Spacing.lg,
          zIndex: 1,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Colors.surface.elevated2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleGoBack}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </Pressable>
    </LinearGradient>
  );
}
