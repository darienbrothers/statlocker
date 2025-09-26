import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useAuthStore } from '../../shared/stores/authStore';

export default function TeamScreen() {
  const { updateUserProfile } = useAuthStore();
  
  const [schoolName, setSchoolName] = useState('');
  const [clubName, setClubName] = useState('');
  const [hasClubTeam, setHasClubTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = () => {
    return schoolName.trim().length > 0;
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
        schoolName: schoolName.trim(),
        clubName: hasClubTeam ? clubName.trim() : undefined,
      });

      router.push('/(onboarding)/goals');
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
                Team Information
              </Text>
              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                lineHeight: 22,
              }}>
                Tell us about your school and club teams
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: Spacing.xl }}>
              {/* School Team */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  School Name *
                </Text>
                <TextInput
                  style={{
                    height: 56,
                    backgroundColor: Colors.surface.elevated2,
                    borderRadius: BorderRadius.lg,
                    borderWidth: 1,
                    borderColor: Colors.border.secondary,
                    paddingHorizontal: Spacing.lg,
                    fontSize: 16,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.primary,
                  }}
                  placeholder="Enter your school name"
                  placeholderTextColor={Colors.text.secondary}
                  value={schoolName}
                  onChangeText={setSchoolName}
                  autoCapitalize="words"
                />
              </View>

              {/* Club Team Toggle */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  Do you also play for a club team?
                </Text>
                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                  <Pressable
                    style={[
                      {
                        flex: 1,
                        paddingVertical: Spacing.md,
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        alignItems: 'center',
                      },
                      hasClubTeam
                        ? {
                            backgroundColor: Colors.brand.primary,
                            borderColor: Colors.brand.primary,
                          }
                        : {
                            backgroundColor: Colors.surface.elevated2,
                            borderColor: Colors.border.secondary,
                          }
                    ]}
                    onPress={() => {
                      setHasClubTeam(true);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={[
                      {
                        fontSize: 14,
                        fontFamily: Typography.fonts.bodyMedium,
                        fontWeight: '600',
                      },
                      hasClubTeam
                        ? { color: '#FFFFFF' }
                        : { color: Colors.text.primary }
                    ]}>
                      Yes
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      {
                        flex: 1,
                        paddingVertical: Spacing.md,
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        alignItems: 'center',
                      },
                      !hasClubTeam
                        ? {
                            backgroundColor: Colors.brand.primary,
                            borderColor: Colors.brand.primary,
                          }
                        : {
                            backgroundColor: Colors.surface.elevated2,
                            borderColor: Colors.border.secondary,
                          }
                    ]}
                    onPress={() => {
                      setHasClubTeam(false);
                      setClubName('');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={[
                      {
                        fontSize: 14,
                        fontFamily: Typography.fonts.bodyMedium,
                        fontWeight: '600',
                      },
                      !hasClubTeam
                        ? { color: '#FFFFFF' }
                        : { color: Colors.text.primary }
                    ]}>
                      No
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Club Team Name */}
              {hasClubTeam && (
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    marginBottom: Spacing.md,
                    fontWeight: '600',
                  }}>
                    Club Team Name
                  </Text>
                  <TextInput
                    style={{
                      height: 56,
                      backgroundColor: Colors.surface.elevated2,
                      borderRadius: BorderRadius.lg,
                      borderWidth: 1,
                      borderColor: Colors.border.secondary,
                      paddingHorizontal: Spacing.lg,
                      fontSize: 16,
                      fontFamily: Typography.fonts.body,
                      color: Colors.text.primary,
                    }}
                    placeholder="Enter your club team name"
                    placeholderTextColor={Colors.text.secondary}
                    value={clubName}
                    onChangeText={setClubName}
                    autoCapitalize="words"
                  />
                </View>
              )}
            </View>

            {/* Continue Button */}
            <View style={{ marginTop: 'auto', paddingTop: Spacing.xl }}>
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
