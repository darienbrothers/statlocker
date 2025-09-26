import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useAuthStore } from '../../shared/stores/authStore';

const GOAL_OPTIONS = [
  { id: 'improve-stats', label: 'Improve my stats', icon: 'trending-up' },
  { id: 'college-recruiting', label: 'Get recruited for college', icon: 'school' },
  { id: 'track-progress', label: 'Track my progress', icon: 'analytics' },
  { id: 'compare-performance', label: 'Compare with others', icon: 'people' },
  { id: 'team-success', label: 'Help my team succeed', icon: 'trophy' },
  { id: 'personal-best', label: 'Beat my personal records', icon: 'medal' },
];

export default function GoalsScreen() {
  const { updateUserProfile } = useAuthStore();
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = () => {
    return selectedGoals.length > 0;
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await updateUserProfile({
        goals: selectedGoals,
      });

      router.push('/(onboarding)/review');
    } catch (error) {
      console.error('Failed to update profile:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
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
            <View style={{ marginTop: Spacing.lg, marginBottom: Spacing.xl }}>
              <Text style={{
                fontSize: 28,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                marginBottom: Spacing.sm,
                fontWeight: '700',
              }}>
                What are your goals?
              </Text>
              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                lineHeight: 22,
              }}>
                Select all that apply. This helps us personalize your experience.
              </Text>
            </View>

            {/* Goals Selection */}
            <View style={{ gap: Spacing.md, flex: 1 }}>
              {GOAL_OPTIONS.map((goal) => (
                <Pressable
                  key={goal.id}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: Spacing.lg,
                      borderRadius: BorderRadius.lg,
                      borderWidth: 1,
                    },
                    selectedGoals.includes(goal.id)
                      ? {
                          backgroundColor: Colors.brand.primary + '20',
                          borderColor: Colors.brand.primary,
                        }
                      : {
                          backgroundColor: Colors.surface.elevated2,
                          borderColor: Colors.border.secondary,
                        }
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <View style={[
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: Spacing.md,
                    },
                    selectedGoals.includes(goal.id)
                      ? { backgroundColor: Colors.brand.primary }
                      : { backgroundColor: Colors.surface.elevated }
                  ]}>
                    <Ionicons 
                      name={goal.icon as any} 
                      size={20} 
                      color={selectedGoals.includes(goal.id) ? '#FFFFFF' : Colors.text.secondary} 
                    />
                  </View>
                  
                  <Text style={[
                    {
                      fontSize: 16,
                      fontFamily: Typography.fonts.bodyMedium,
                      fontWeight: '600',
                      flex: 1,
                    },
                    selectedGoals.includes(goal.id)
                      ? { color: Colors.brand.primary }
                      : { color: Colors.text.primary }
                  ]}>
                    {goal.label}
                  </Text>

                  {selectedGoals.includes(goal.id) && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={Colors.brand.primary} 
                    />
                  )}
                </Pressable>
              ))}
            </View>

            {/* Continue Button */}
            <View style={{ marginTop: Spacing.xl }}>
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
                  (!isFormValid() || isLoading) && { opacity: 0.6 }
                ]}
                onPress={handleContinue}
                disabled={!isFormValid() || isLoading}
              >
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}>
                  Continue
                </Text>
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
