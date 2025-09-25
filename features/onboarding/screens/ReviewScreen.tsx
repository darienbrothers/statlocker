import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import InlineStepper from '../../../shared/components/InlineStepper';
import { onboardingSteps, getCurrentStepIndex } from '../../../shared/config/onboardingSteps';
import { GoalTemplate } from '../../../shared/types/goals';

const SummaryCard = ({ title, onEdit, children }: { title: string, onEdit: () => void, children: React.ReactNode }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Pressable onPress={onEdit}>
        <Text style={styles.editButton}>Edit</Text>
      </Pressable>
    </View>
    {children}
  </View>
);

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <View>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const currentStepIndex = getCurrentStepIndex('review');

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const onboardingKeys = keys.filter(k => k.startsWith('onboarding_'));
        const data = await AsyncStorage.multiGet(onboardingKeys);
        const dataMap = new Map(data);

        const goals = dataMap.get('onboarding_selectedGoals');

        setUserData({
          firstName: dataMap.get('onboarding_firstName') || '',
          lastName: dataMap.get('onboarding_lastName') || '',
          profileImage: dataMap.get('onboarding_profileImage') || null,
          sport: dataMap.get('onboarding_sport') || '',
          position: dataMap.get('onboarding_position') || '',
          graduationYear: dataMap.get('onboarding_graduationYear') || '',
          schoolName: dataMap.get('onboarding_schoolName') || '',
          schoolLevel: dataMap.get('onboarding_schoolLevel') || '',
          clubEnabled: dataMap.get('onboarding_clubEnabled') === 'true',
          clubOrg: dataMap.get('onboarding_clubOrg') || '',
          selectedGoals: goals ? JSON.parse(goals) : [],
        });
      } catch (e) {
        console.error('Failed to load all user data for review screen', e);
      }
    };
    loadAllData();
  }, []);

  
  const handleEdit = (route: string) => {
    router.push(route as any);
  };

  const handleComplete = async () => {
    // TODO: Finalize profile, maybe set a flag like 'onboardingComplete' to true
    await AsyncStorage.setItem('onboardingComplete', 'true');
    router.replace('/(tabs)/'); // Navigate to the main app
  };

  if (!userData) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
            <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={['name', 'profile-image', 'basic', 'team', 'goals']}
      />
      <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
            <Text style={{
              fontSize: 20,
              fontFamily: Typography.fonts.bodyMedium,
              color: Colors.brand.primary,
              textAlign: 'center',
              marginBottom: Spacing.sm,
              fontWeight: '600',
            }}>
              Final Review
            </Text>
            <Text style={{
              fontSize: 28,
              fontFamily: Typography.fonts.display,
              color: Colors.text.primary,
              textAlign: 'center',
            }}>
              Does Everything Look Right?
            </Text>
            <Text style={styles.subtitle}>One last look before you're officially in the game.</Text>
        </View>

                <SummaryCard title="Name & Photo" onEdit={() => handleEdit('/onboarding/name')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            <Text style={styles.nameText}>{userData.firstName} {userData.lastName}</Text>
          </View>
        </SummaryCard>

        <SummaryCard title="Basic Info" onEdit={() => handleEdit('/onboarding/basic-info')}>
          <View style={styles.infoGrid}>
            <InfoItem label="Sport" value={userData.sport} />
            <InfoItem label="Position" value={userData.position} />
            <InfoItem label="Grad Year" value={userData.graduationYear} />
          </View>
        </SummaryCard>

        <SummaryCard title="Team" onEdit={() => handleEdit('/onboarding/team')}>
          <View style={styles.infoGrid}>
            <InfoItem label="School" value={userData.schoolName} />
            <InfoItem label="Level" value={userData.schoolLevel} />
            {userData.clubEnabled && <InfoItem label="Club" value={userData.clubOrg} />}
          </View>
        </SummaryCard>

        <SummaryCard title="Goals" onEdit={() => handleEdit('/onboarding/goals')}>
          <View style={{ gap: Spacing.sm }}>
            {userData.selectedGoals.map((goal: GoalTemplate) => (
              <Text key={goal.id} style={styles.goalText}>• {goal.title}</Text>
            ))}
          </View>
        </SummaryCard>

      </ScrollView>

      {/* Fixed Button */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleComplete}>
          <LinearGradient
            colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
            style={styles.button}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Text style={{ ...Typography.styles.button, color: '#FFFFFF' }}>Complete Profile</Text>
              <Ionicons name="arrow-forward" size={20} color={'#FFFFFF'} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.styles.bodyLarge,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    backgroundColor: Colors.surface.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.secondary,
  },
  button: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: 16,
    padding: 16,
    ...Shadows.sm,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
  },
  editButton: {
    ...Typography.styles.body,
    color: Colors.brand.primary,
    fontWeight: '600',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nameText: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  infoLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  goalText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
  },
});
