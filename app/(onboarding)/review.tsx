import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useAuthStore } from '../../shared/stores/authStore';

export default function ReviewScreen() {
  const { userProfile, completeOnboarding } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      await completeOnboarding();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate to main app
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  if (!userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

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
            <View style={{ marginTop: Spacing.lg, marginBottom: Spacing.xl, alignItems: 'center' }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.brand.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Spacing.lg,
              }}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>

              <Text style={{
                fontSize: 28,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                marginBottom: Spacing.sm,
                fontWeight: '700',
                textAlign: 'center',
              }}>
                You're all set!
              </Text>
              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                lineHeight: 22,
                textAlign: 'center',
              }}>
                Here's a summary of your profile
              </Text>
            </View>

            {/* Profile Summary */}
            <View style={{
              backgroundColor: Colors.surface.elevated,
              borderRadius: BorderRadius.xl,
              padding: Spacing.lg,
              marginBottom: Spacing.xl,
              ...Shadows.sm,
            }}>
              {/* Personal Info */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 18,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  Personal Information
                </Text>
                <View style={{ gap: Spacing.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.body, color: Colors.text.secondary }}>
                      Name
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.bodyMedium, color: Colors.text.primary }}>
                      {userProfile.displayName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.body, color: Colors.text.secondary }}>
                      Sport
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.bodyMedium, color: Colors.text.primary }}>
                      {userProfile.sport}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.body, color: Colors.text.secondary }}>
                      Position
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.bodyMedium, color: Colors.text.primary }}>
                      {userProfile.position}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.body, color: Colors.text.secondary }}>
                      Graduation Year
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.bodyMedium, color: Colors.text.primary }}>
                      {userProfile.graduationYear}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Team Info */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 18,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  Team Information
                </Text>
                <View style={{ gap: Spacing.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.body, color: Colors.text.secondary }}>
                      School
                    </Text>
                    <Text style={{ fontSize: 14, fontFamily: Typography.fonts.bodyMedium, color: Colors.text.primary }}>
                      {userProfile.schoolName}
                    </Text>
                  </View>
                  {userProfile.clubName && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, fontFamily: Typography.fonts.body, color: Colors.text.secondary }}>
                        Club Team
                      </Text>
                      <Text style={{ fontSize: 14, fontFamily: Typography.fonts.bodyMedium, color: Colors.text.primary }}>
                        {userProfile.clubName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Goals */}
              {userProfile.goals && userProfile.goals.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    marginBottom: Spacing.md,
                    fontWeight: '600',
                  }}>
                    Your Goals
                  </Text>
                  <View style={{ gap: Spacing.xs }}>
                    {userProfile.goals.map((goal, index) => (
                      <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.brand.primary} />
                        <Text style={{ 
                          fontSize: 14, 
                          fontFamily: Typography.fonts.body, 
                          color: Colors.text.primary,
                          marginLeft: Spacing.sm,
                        }}>
                          {goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Complete Button */}
            <View style={{ marginTop: 'auto' }}>
              <Pressable
                style={[
                  {
                    height: 56,
                    backgroundColor: Colors.brand.primary,
                    borderRadius: BorderRadius.xl,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...Shadows.sm,
                  },
                  isLoading && { opacity: 0.6 }
                ]}
                onPress={handleComplete}
                disabled={isLoading}
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
                    Start Using StatLocker
                  </Text>
                )}
              </Pressable>
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
