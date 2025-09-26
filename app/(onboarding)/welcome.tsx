import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../shared/theme';

export default function WelcomeScreen() {
  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/basic-info');
  };

  return (
    <LinearGradient
      colors={[Colors.surface.primary, Colors.surface.elevated]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ 
          flex: 1, 
          padding: Spacing.xl,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Logo */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: Colors.brand.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}>
            <Ionicons name="stats-chart" size={40} color="#FFFFFF" />
          </View>

          {/* Welcome Text */}
          <Text style={{
            fontSize: 32,
            fontFamily: Typography.fonts.display,
            color: Colors.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.md,
            fontWeight: '700',
          }}>
            Welcome to StatLocker
          </Text>

          <Text style={{
            fontSize: 18,
            fontFamily: Typography.fonts.body,
            color: Colors.text.secondary,
            textAlign: 'center',
            marginBottom: Spacing.xl,
            lineHeight: 24,
          }}>
            Let's set up your profile to start tracking your lacrosse journey
          </Text>

          {/* Get Started Button */}
          <Pressable
            style={{
              width: '100%',
              height: 56,
              backgroundColor: Colors.brand.primary,
              borderRadius: BorderRadius.xl,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: Spacing.xl,
              ...Shadows.sm,
            }}
            onPress={handleGetStarted}
          >
            <Text style={{
              fontSize: 16,
              fontFamily: Typography.fonts.bodyMedium,
              color: '#FFFFFF',
              fontWeight: '600',
            }}>
              Get Started
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
