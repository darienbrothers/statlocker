import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import InlineStepper from '../../../shared/components/InlineStepper';
import { onboardingSteps, getCurrentStepIndex } from '../../../shared/config/onboardingSteps';

const SPORTS = [
  { id: 'lacrosse', name: 'Lacrosse', icon: '🥍', available: true },
  { id: 'basketball', name: 'Basketball', icon: '🏀', available: false },
  { id: 'football', name: 'Football', icon: '🏈', available: false },
  { id: 'soccer', name: 'Soccer', icon: '⚽', available: false },
  { id: 'baseball', name: 'Baseball', icon: '⚾', available: false },
  { id: 'hockey', name: 'Hockey', icon: '🏒', available: false },
];

const BOYS_POSITIONS = ['Attack', 'Midfield', 'Defense', 'Goalie', 'LSM', 'FOGO'];
const GIRLS_POSITIONS = ['Attack', 'Midfield', 'Defense', 'Goalie'];

const GRADUATION_YEARS = [
  { year: 2025, grade: 'Senior' },
  { year: 2026, grade: 'Junior' },
  { year: 2027, grade: 'Sophomore' },
  { year: 2028, grade: 'Freshman' },
];

export default function BasicInfoScreen() {
  const insets = useSafeAreaInsets();
  const currentStepIndex = getCurrentStepIndex('basic');

  const [sport, setSport] = useState('');
  const [gender, setGender] = useState<'boys' | 'girls' | ''>('');
  const [position, setPosition] = useState('');
  const [graduationYear, setGraduationYear] = useState<number | null>(null);
  const [firstName, setFirstName] = useState<string>('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const genderFadeAnim = useRef(new Animated.Value(0)).current;
  const positionFadeAnim = useRef(new Animated.Value(0)).current;
  const breathingAnim = useRef(new Animated.Value(0)).current;

  const isFormValid = sport && gender && position && graduationYear;
  const currentPositions = gender === 'boys' ? BOYS_POSITIONS : gender === 'girls' ? GIRLS_POSITIONS : [];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Load all saved data
    (async () => {
      try {
        const data = await AsyncStorage.multiGet([
          'onboarding_firstName',
          'onboarding_sport',
          'onboarding_gender',
          'onboarding_position',
          'onboarding_graduationYear'
        ]);
        const dataMap = new Map(data);
        
        const storedName = dataMap.get('onboarding_firstName');
        if (storedName) {
          const val = storedName.trim();
          setFirstName(val.charAt(0).toUpperCase() + val.slice(1));
        }
        
        const storedSport = dataMap.get('onboarding_sport');
        if (storedSport) setSport(storedSport);
        
        const storedGender = dataMap.get('onboarding_gender');
        if (storedGender) setGender(storedGender as 'boys' | 'girls');
        
        const storedPosition = dataMap.get('onboarding_position');
        if (storedPosition) setPosition(storedPosition);
        
        const storedGradYear = dataMap.get('onboarding_graduationYear');
        if (storedGradYear) setGraduationYear(parseInt(storedGradYear));
      } catch (error) {
        console.log('Failed to load basic info data:', error);
      }
    })();
  }, []);

  // Animate gender section when sport changes
  useEffect(() => {
    if (sport === 'lacrosse') {
      Animated.timing(genderFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      genderFadeAnim.setValue(0);
    }
  }, [sport]);

  // Animate position section when gender changes
  useEffect(() => {
    if (gender) {
      Animated.timing(positionFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      positionFadeAnim.setValue(0);
    }
  }, [gender]);


  const handleContinue = async () => {
    if (!isFormValid) return;
    try {
      await AsyncStorage.multiSet([
        ['onboarding_sport', sport],
        ['onboarding_gender', gender],
        ['onboarding_position', position],
        ['onboarding_graduationYear', graduationYear?.toString() || ''],
      ]);
      router.push('/onboarding/team');
    } catch (e) {
      console.error('Failed to save basic info', e);
    }
  };

    const handleBackPress = () => {
    router.back();
  };


  // Auto-save data when it changes
  useEffect(() => {
    const saveData = async () => {
      if (sport || gender || position || graduationYear) {
        try {
          await AsyncStorage.multiSet([
            ['onboarding_sport', sport],
            ['onboarding_gender', gender],
            ['onboarding_position', position],
            ['onboarding_graduationYear', graduationYear?.toString() || ''],
          ]);
        } catch (e) {
          console.error('Failed to auto-save basic info', e);
        }
      }
    };
    saveData();
  }, [sport, gender, position, graduationYear]);

  // Button animation when form becomes valid
  useEffect(() => {
    if (isFormValid) {
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
      return () => breathingLoop.stop();
    } else {
      breathingAnim.setValue(0);
    }
  }, [isFormValid]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
      <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={['name', 'profile-image']}
        showBack={true}
        onBack={handleBackPress}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.xl }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header — personalized, concise */}
          <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
            <Text style={{
              fontSize: 20,
              lineHeight: 28,
              fontFamily: Typography.fonts.bodyMedium,
              color: Colors.brand.primary,
              textAlign: 'center',
              marginBottom: Spacing.sm,
              fontWeight: '600',
            }}>
              Build Your Player Profile
            </Text>

            <Text
              style={{
                fontSize: 28,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                textAlign: 'center',
                marginBottom: 6,
                letterSpacing: 0.2,
              }}
            >
              {firstName ? `${firstName}, time to show the world what you're made of.` : 'Time to show the world what you\'re made of.'}
            </Text>

            <Text
              style={{
                ...Typography.styles.bodyLarge,
                color: Colors.text.secondary,
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: Spacing.md,
              }}
            >
              This helps us tailor your stat categories, goals, and skill plans.
            </Text>
          </View>

          {/* Sport Selection */}
          <View style={{
            backgroundColor: Colors.surface.elevated,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            ...Shadows.sm,
          }}>
            <Text style={{
              fontSize: 18,
              fontFamily: Typography.fonts.bodyMedium,
              color: Colors.text.primary,
              marginBottom: Spacing.md,
            }}>
              What's Your Game?
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: Typography.fonts.body,
                color: Colors.text.tertiary,
                marginTop: -4,
                marginBottom: Spacing.md,
              }}
            >
              Select your sport to get started. (you can add others later)
            </Text>
            
            {SPORTS.map(sportOption => (
              <Pressable
                key={sportOption.id}
                style={{
                  backgroundColor: sport === sportOption.id ? `${Colors.brand.primary}10` : Colors.surface.primary,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: sport === sportOption.id ? Colors.brand.primary : Colors.border.secondary,
                  marginBottom: 8,
                  opacity: sportOption.available ? 1 : 0.6,
                }}
                onPress={() => sportOption.available && setSport(sportOption.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{sportOption.icon}</Text>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                  }}>
                    {sportOption.name}
                  </Text>
                  {!sportOption.available && (
                    <Text style={{
                      fontSize: 11,
                      color: Colors.text.tertiary,
                      marginLeft: 8,
                    }}>
                      Coming Soon
                    </Text>
                  )}
                  {sport === sportOption.id && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.brand.primary} style={{ marginLeft: 'auto' }} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Gender Selection */}
          {sport === 'lacrosse' && (
            <Animated.View style={{ opacity: genderFadeAnim, marginBottom: 24 }}>
              <View style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: 16,
                padding: 16,
                ...Shadows.sm,
              }}>
                <Text style={{ fontSize: 18, fontFamily: Typography.fonts.bodyMedium, marginBottom: 16 }}>
                  Boys or Girls League?
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.tertiary,
                    marginTop: -4,
                    marginBottom: Spacing.md,
                  }}
                >
                  We use this to load the right positions for you.
                </Text>
                
                {['boys', 'girls'].map((g) => (
                  <Pressable
                    key={g}
                    style={{
                      backgroundColor: gender === g ? `${Colors.brand.primary}10` : Colors.surface.primary,
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 2,
                      borderColor: gender === g ? Colors.brand.primary : Colors.border.secondary,
                      marginBottom: 8,
                    }}
                    onPress={() => setGender(g as 'boys' | 'girls')}
                  >
                    <Text>{g === 'boys' ? '♂️' : '♀️'} {g === 'boys' ? 'Boys' : 'Girls'} Lacrosse</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Position Selection */}
          {gender && (
            <Animated.View style={{ opacity: positionFadeAnim, marginBottom: 24 }}>
              <View style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: 16,
                padding: 16,
                ...Shadows.sm,
              }}>
                <Text style={{ fontSize: 18, fontFamily: Typography.fonts.bodyMedium, marginBottom: 16 }}>
                  Position
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.tertiary,
                    marginTop: -4,
                    marginBottom: Spacing.md,
                  }}
                >
                  Your position drives which stats we track.
                </Text>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {currentPositions.map((pos) => (
                    <Pressable
                      key={pos}
                      style={{
                        backgroundColor: position === pos ? `${Colors.brand.primary}10` : Colors.surface.primary,
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: position === pos ? Colors.brand.primary : Colors.border.secondary,
                      }}
                      onPress={() => setPosition(pos)}
                    >
                      <Text style={{ fontSize: 14 }}>{pos}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}

          {/* Graduation Year Selection */}
          {position && (
            <Animated.View style={{ opacity: positionFadeAnim, marginBottom: 24 }}>
              <View style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: 16,
                padding: 16,
                ...Shadows.sm,
              }}>
                <Text style={{ fontSize: 18, fontFamily: Typography.fonts.bodyMedium, marginBottom: 16 }}>
                  Graduation Year
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.tertiary,
                    marginTop: -4,
                    marginBottom: Spacing.md,
                  }}
                >
                  Grad year guides your goals and recruiting timeline.
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {GRADUATION_YEARS.map(({ year, grade }) => (
                    <Pressable
                      key={year}
                      style={{
                        backgroundColor: graduationYear === year ? `${Colors.brand.primary}10` : Colors.surface.primary,
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: graduationYear === year ? Colors.brand.primary : Colors.border.secondary,
                      }}
                      onPress={() => setGraduationYear(year)}
                    >
                      <Text style={{ fontSize: 14 }}>{year} ({grade})</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}

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
            We'll use this info to personalize your experience.
          </Text>

          {/* Continue Button */}
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <Pressable
              style={{
                borderRadius: 20,
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
                    borderRadius: 20,
                  }}
                />
              )}

              <LinearGradient
                colors={isFormValid ? [Colors.brand.primary, `${Colors.brand.primary}DD`] : [Colors.border.secondary, Colors.border.primary]}
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 28,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 56,
                }}
              >
                <Text style={{
                  fontSize: 18,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: isFormValid ? '#FFFFFF' : Colors.text.tertiary,
                  fontWeight: '600',
                }}>
                  Next
                </Text>
                <Ionicons name="arrow-forward" size={20} color={isFormValid ? '#FFFFFF' : Colors.text.tertiary} />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

