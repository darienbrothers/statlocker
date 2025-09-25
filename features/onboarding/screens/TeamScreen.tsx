import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import InlineStepper from '../../../shared/components/InlineStepper';
import FloatingLabelInput from '../../../shared/components/FloatingLabelInput';
import { onboardingSteps, getCurrentStepIndex } from '../../../shared/config/onboardingSteps';
import { OnboardingStepKey } from '../../../shared/types/Onboarding';

const STEPPER_HEIGHT = 72;
const BUTTON_HEIGHT = 88;

export default function TeamScreen() {
  const insets = useSafeAreaInsets();
    const currentStepIndex = getCurrentStepIndex('team');
  const [firstName, setFirstName] = useState('');

  // High School State
  const [schoolName, setSchoolName] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolState, setSchoolState] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<'Varsity' | 'JV' | 'Freshman' | ''>('');
  const [schoolJersey, setSchoolJersey] = useState('');

  // Club Team State
  const [clubEnabled, setClubEnabled] = useState(false);
  const [clubOrg, setClubOrg] = useState('');
  const [clubTeam, setClubTeam] = useState('');
  const [clubCity, setClubCity] = useState('');
  const [clubState, setClubState] = useState('');
  const [clubJersey, setClubJersey] = useState('');

  // Animation Refs
    const clubFormFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const stored = (await AsyncStorage.getItem('onboarding_firstName')) || '';
        const val = stored.trim();
        setFirstName(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
      } catch {}
    })();
  }, []);

  // Load and Save Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.multiGet([
          'onboarding_schoolName', 'onboarding_schoolCity', 'onboarding_schoolState',
          'onboarding_schoolLevel', 'onboarding_schoolJersey', 'onboarding_clubEnabled',
          'onboarding_clubOrg', 'onboarding_clubTeam', 'onboarding_clubCity', 
          'onboarding_clubState', 'onboarding_clubJersey'
        ]);
        const dataMap = new Map(data);
        setSchoolName(dataMap.get('onboarding_schoolName') || '');
        setSchoolCity(dataMap.get('onboarding_schoolCity') || '');
        setSchoolState(dataMap.get('onboarding_schoolState') || '');
        setSchoolLevel((dataMap.get('onboarding_schoolLevel') as any) || '');
        setSchoolJersey(dataMap.get('onboarding_schoolJersey') || '');
        setClubEnabled(dataMap.get('onboarding_clubEnabled') === 'true');
        setClubOrg(dataMap.get('onboarding_clubOrg') || '');
        setClubTeam(dataMap.get('onboarding_clubTeam') || '');
        setClubCity(dataMap.get('onboarding_clubCity') || '');
        setClubState(dataMap.get('onboarding_clubState') || '');
        setClubJersey(dataMap.get('onboarding_clubJersey') || '');
      } catch (e) {
        console.error('Failed to load team data.', e);
      }
    };
    loadData();
  }, []);

  const saveData = async () => {
    const data: [string, string][] = [
      ['onboarding_schoolName', schoolName],
      ['onboarding_schoolCity', schoolCity],
      ['onboarding_schoolState', schoolState],
      ['onboarding_schoolLevel', schoolLevel],
      ['onboarding_schoolJersey', schoolJersey],
      ['onboarding_clubEnabled', clubEnabled.toString()],
      ['onboarding_clubOrg', clubOrg],
      ['onboarding_clubTeam', clubTeam],
      ['onboarding_clubCity', clubCity],
      ['onboarding_clubState', clubState],
      ['onboarding_clubJersey', clubJersey],
    ];

    try {
      await AsyncStorage.multiSet(data);
    } catch (e) {
      console.error('Failed to save team data.', e);
    }
  };

  const isHighSchoolValid = schoolName.trim() !== '' && schoolCity.trim() !== '' && schoolState.trim() !== '' && schoolLevel.trim() !== '';
  const isClubValid = !clubEnabled || (clubOrg.trim() !== '' && clubTeam.trim() !== '');
  const isFormValid = isHighSchoolValid && isClubValid;

  // Auto-save data on change
  useEffect(() => {
    saveData();
  }, [schoolName, schoolCity, schoolState, schoolLevel, schoolJersey, clubEnabled, clubOrg, clubTeam, clubCity, clubState, clubJersey]);

  useEffect(() => {
    Animated.timing(clubFormFadeAnim, {
      toValue: clubEnabled ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [clubEnabled]);

  const handleContinue = async () => {
    if (!isFormValid) return;
    await saveData();
    router.push('/onboarding/goals');
  };

    const handleBackPress = () => {
    router.back();
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
            <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={['name', 'profile-image', 'basic']}
        showBack={true}
        onBack={handleBackPress}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? STEPPER_HEIGHT : 0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: Spacing.xl,
            paddingTop: Spacing.lg,
            paddingBottom: BUTTON_HEIGHT + insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header — personalized + purpose */}
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
              Team Information
            </Text>
            
            <Text style={{
              fontSize: 28,
              fontFamily: Typography.fonts.display,
              color: Colors.text.primary,
              textAlign: 'center',
              marginBottom: 6
            }}>
              {firstName ? `Rep your home turf, ${firstName} 🏟️`  : 'Rep your home turf 🏟️'}
            </Text>

            <Text style={{
              ...Typography.styles.bodyLarge,
              color: Colors.text.secondary,
              textAlign: 'center',
              lineHeight: 22,
              paddingHorizontal: Spacing.lg
            }}>
              This helps us label your stats by team and show goals for each season.
            </Text>
          </View>

          {/* High School Card */}
          <View style={{ backgroundColor: Colors.surface.elevated, borderRadius: 16, padding: 16, ...Shadows.sm, marginBottom: 24 }}>
                        <Text style={{ ...Typography.styles.h3, color: Colors.text.primary, marginBottom: Spacing.md }}>High School Team</Text>
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.tertiary,
              marginTop: -4, marginBottom: Spacing.md
            }}>
              Tip: Include city & state so your profile looks legit to coaches.
            </Text>
            <View style={{ gap: Spacing.lg }}>
              <FloatingLabelInput label="School Name" value={schoolName} onChangeText={setSchoolName} autoCapitalize="words" />
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <FloatingLabelInput label="City" value={schoolCity} onChangeText={setSchoolCity} containerStyle={{ flex: 1 }} autoCapitalize="words" />
                <FloatingLabelInput label="State" value={schoolState} onChangeText={(v) => setSchoolState(v.toUpperCase())} containerStyle={{ flex: 0.5 }} maxLength={2} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: Spacing.sm }}>
                {['Varsity', 'JV', 'Freshman'].map(level => (
                  <Pressable key={level} onPress={() => {
                    setSchoolLevel(level as any);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }} style={[styles.levelButton, schoolLevel === level && styles.levelButtonActive]}>
                    <Text style={[styles.levelButtonText, schoolLevel === level && styles.levelButtonTextActive]}>{level}</Text>
                  </Pressable>
                ))}
              </View>
                            <FloatingLabelInput label="Jersey # (Optional)" value={schoolJersey} onChangeText={setSchoolJersey} keyboardType="number-pad" />
            </View>
          </View>

          {/* Club Team Card */}
          <View style={{ backgroundColor: Colors.surface.elevated, borderRadius: 16, padding: 16, ...Shadows.sm, marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ ...Typography.styles.h3, color: Colors.text.primary }}>Club Team</Text>
              <Switch value={clubEnabled} onValueChange={setClubEnabled} />
            </View>
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.tertiary,
              marginTop: 4
            }}>
              Toggle on if you also play club—we’ll keep HS and Club stats separate.
            </Text>
            {clubEnabled && (
              <Animated.View style={{ opacity:clubFormFadeAnim, marginTop: Spacing.lg }}>
                <View style={{ gap: Spacing.lg }}>
                  <FloatingLabelInput label="Club Organization" value={clubOrg} onChangeText={setClubOrg} autoCapitalize="words" />
                  <FloatingLabelInput label="Team Name" value={clubTeam} onChangeText={setClubTeam} autoCapitalize="words" />
                  <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                    <FloatingLabelInput label="City" value={clubCity} onChangeText={setClubCity} containerStyle={{ flex: 1 }} autoCapitalize="words" />
                    <FloatingLabelInput label="State" value={clubState} onChangeText={(v) => setClubState(v.toUpperCase())} containerStyle={{ flex: 0.5 }} maxLength={2} />
                  </View>
                  <FloatingLabelInput label="Jersey # (Optional)" value={clubJersey} onChangeText={setClubJersey} keyboardType="number-pad" />
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.xl, backgroundColor: Colors.surface.primary, borderTopWidth: 1, borderTopColor: Colors.border.secondary }}>
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
          Your team info helps us organize your stats and achievements.
        </Text>

        <Pressable onPress={handleContinue} disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.6 }}>
          <LinearGradient
            colors={isFormValid ? [Colors.brand.primary, `${Colors.brand.primary}DD`] : [Colors.border.secondary, Colors.border.primary]}
            style={{ padding: Spacing.lg, borderRadius: BorderRadius.xl, alignItems: 'center' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Text style={{ ...Typography.styles.button, color: isFormValid ? '#FFFFFF' : Colors.text.tertiary }}>
              Next
            </Text>
              <Ionicons name="arrow-forward" size={20} color={isFormValid ? '#FFFFFF' : Colors.text.tertiary} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  levelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border.secondary,
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  levelButtonText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
  },
});
