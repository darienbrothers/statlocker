import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../shared/theme';
import { useAuthStore } from '../../shared/stores/authStore';

const SPORTS = ['Lacrosse', 'Soccer', 'Basketball', 'Hockey', 'Baseball', 'Football'];
const GENDERS = ['Male', 'Female'];
const POSITIONS = {
  Lacrosse: ['Attack', 'Midfield', 'Defense', 'Goalie', 'LSM', 'FOGO'],
  Soccer: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  Basketball: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  Hockey: ['Center', 'Left Wing', 'Right Wing', 'Defenseman', 'Goaltender'],
  Baseball: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Outfield'],
  Football: ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter'],
};

export default function BasicInfoScreen() {
  const { updateUserProfile, userProfile } = useAuthStore();
  
  const [sport, setSport] = useState('Lacrosse');
  const [gender, setGender] = useState('');
  const [position, setPosition] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);

  const isFormValid = () => {
    return sport && gender && position && graduationYear;
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
        sport,
        gender: gender.toLowerCase(),
        position,
        graduationYear: parseInt(graduationYear),
      });

      router.push('/(onboarding)/team');
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
                Tell us about yourself
              </Text>
              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                lineHeight: 22,
              }}>
                This helps us personalize your experience and provide relevant insights
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: Spacing.xl }}>
              {/* Sport Selection */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  What sport do you play?
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                  {SPORTS.map((sportOption) => (
                    <Pressable
                      key={sportOption}
                      style={[
                        {
                          paddingHorizontal: Spacing.lg,
                          paddingVertical: Spacing.md,
                          borderRadius: BorderRadius.lg,
                          borderWidth: 1,
                        },
                        sport === sportOption
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
                        setSport(sportOption);
                        setPosition(''); // Reset position when sport changes
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={[
                        {
                          fontSize: 14,
                          fontFamily: Typography.fonts.bodyMedium,
                          fontWeight: '600',
                        },
                        sport === sportOption
                          ? { color: '#FFFFFF' }
                          : { color: Colors.text.primary }
                      ]}>
                        {sportOption}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Gender Selection */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  Gender
                </Text>
                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                  {GENDERS.map((genderOption) => (
                    <Pressable
                      key={genderOption}
                      style={[
                        {
                          flex: 1,
                          paddingVertical: Spacing.md,
                          borderRadius: BorderRadius.lg,
                          borderWidth: 1,
                          alignItems: 'center',
                        },
                        gender === genderOption
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
                        setGender(genderOption);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={[
                        {
                          fontSize: 14,
                          fontFamily: Typography.fonts.bodyMedium,
                          fontWeight: '600',
                        },
                        gender === genderOption
                          ? { color: '#FFFFFF' }
                          : { color: Colors.text.primary }
                      ]}>
                        {genderOption}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Position Selection */}
              {sport && (
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    marginBottom: Spacing.md,
                    fontWeight: '600',
                  }}>
                    What position do you play?
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                    {POSITIONS[sport as keyof typeof POSITIONS]?.map((positionOption) => (
                      <Pressable
                        key={positionOption}
                        style={[
                          {
                            paddingHorizontal: Spacing.lg,
                            paddingVertical: Spacing.md,
                            borderRadius: BorderRadius.lg,
                            borderWidth: 1,
                          },
                          position === positionOption
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
                          setPosition(positionOption);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Text style={[
                          {
                            fontSize: 14,
                            fontFamily: Typography.fonts.bodyMedium,
                            fontWeight: '600',
                          },
                          position === positionOption
                            ? { color: '#FFFFFF' }
                            : { color: Colors.text.primary }
                        ]}>
                          {positionOption}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Graduation Year */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.primary,
                  marginBottom: Spacing.md,
                  fontWeight: '600',
                }}>
                  Graduation Year
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                  {graduationYears.map((year) => (
                    <Pressable
                      key={year}
                      style={[
                        {
                          paddingHorizontal: Spacing.lg,
                          paddingVertical: Spacing.md,
                          borderRadius: BorderRadius.lg,
                          borderWidth: 1,
                        },
                        graduationYear === year.toString()
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
                        setGraduationYear(year.toString());
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text style={[
                        {
                          fontSize: 14,
                          fontFamily: Typography.fonts.bodyMedium,
                          fontWeight: '600',
                        },
                        graduationYear === year.toString()
                          ? { color: '#FFFFFF' }
                          : { color: Colors.text.primary }
                      ]}>
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
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
