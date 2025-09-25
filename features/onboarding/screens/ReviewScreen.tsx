import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import InlineStepper from '../../../shared/components/InlineStepper';
import { onboardingSteps, getCurrentStepIndex } from '../../../shared/config/onboardingSteps';
import { GoalTemplate } from '../../../shared/types/goals';

const MonogramAvatar = ({ first, last }: { first?: string; last?: string }) => {
  const letter = (first || last || 'A').trim().charAt(0).toUpperCase();
  return (
    <View style={{
      width: 60, height: 60, borderRadius: 30,
      backgroundColor: Colors.surface.elevated,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: Colors.border.secondary,
    }}>
      <Text style={{ ...Typography.styles.h2, color: Colors.text.primary }}>{letter}</Text>
    </View>
  );
};

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
  const scrollRef = useRef<ScrollView>(null);

  const [userData, setUserData] = useState<any>(null);
  const [missing, setMissing] = useState<string[]>([]);

  // Animation refs
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const breathingAnim = useRef(new Animated.Value(0)).current;

  const handleBackPress = () => {
    router.back();
  };

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
          gender: dataMap.get('onboarding_gender') || '',
          position: dataMap.get('onboarding_position') || '',
          graduationYear: dataMap.get('onboarding_graduationYear') || '',
          schoolName: dataMap.get('onboarding_schoolName') || '',
          schoolCity: dataMap.get('onboarding_schoolCity') || '',
          schoolState: dataMap.get('onboarding_schoolState') || '',
          schoolLevel: dataMap.get('onboarding_schoolLevel') || '',
          schoolJersey: dataMap.get('onboarding_schoolJersey') || '',
          clubEnabled: dataMap.get('onboarding_clubEnabled') === 'true',
          clubOrg: dataMap.get('onboarding_clubOrg') || '',
          clubTeam: dataMap.get('onboarding_clubTeam') || '',
          clubCity: dataMap.get('onboarding_clubCity') || '',
          clubState: dataMap.get('onboarding_clubState') || '',
          clubJersey: dataMap.get('onboarding_clubJersey') || '',
          selectedGoals: goals ? JSON.parse(goals) : [],
        });
      } catch (e) {
        console.error('Failed to load all user data for review screen', e);
      }
    };
    loadAllData();
  }, []);

  // Check for missing data
  useEffect(() => {
    if (!userData) return;
    const m: string[] = [];
    if (!userData.firstName?.trim()) m.push('First name');
    if (!userData.lastName?.trim()) m.push('Last name');
    if (!userData.sport?.trim()) m.push('Sport');
    if (!userData.position?.trim()) m.push('Position');
    if (!userData.graduationYear?.trim()) m.push('Graduation year');
    if (!userData.schoolName?.trim()) m.push('High school');
    if (!userData.schoolLevel?.trim()) m.push('School level');
    if (!userData.selectedGoals?.length) m.push('Goals (choose 3)');
    setMissing(m);
  }, [userData]);

  // Breathing animation for button
  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breathingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    breathingAnimation.start();
    return () => breathingAnimation.stop();
  }, []);

  const allGood = missing.length === 0;
  
  const handleEdit = (route: string) => {
    // Set a flag to indicate we're coming from review
    AsyncStorage.setItem('editingFromReview', 'true');
    router.push(route as any);
  };

  const handleComplete = async () => {
    if (!allGood) {
      // Scroll to top to show missing items
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }
    
    try {
      // Save complete user profile for dashboard use
      const userProfile = {
        // Personal Info
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImage: userData.profileImage,
        
        // Athletic Info
        sport: userData.sport,
        gender: userData.gender,
        position: userData.position,
        graduationYear: userData.graduationYear,
        
        // School Info
        schoolName: userData.schoolName,
        schoolCity: userData.schoolCity,
        schoolState: userData.schoolState,
        schoolLevel: userData.schoolLevel,
        schoolJersey: userData.schoolJersey,
        
        // Club Info
        clubEnabled: userData.clubEnabled,
        clubOrg: userData.clubOrg,
        clubTeam: userData.clubTeam,
        clubCity: userData.clubCity,
        clubState: userData.clubState,
        clubJersey: userData.clubJersey,
        
        // Goals
        selectedGoals: userData.selectedGoals,
        
        // Metadata
        onboardingCompletedAt: new Date().toISOString(),
        profileVersion: '1.0'
      };

      // Save user profile for dashboard
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingComplete', 'true');
      
      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate to main app
      router.replace('/(tabs)/');
    } catch (error) {
      console.error('Failed to save user profile:', error);
      // Still navigate even if save fails
      router.replace('/(tabs)/');
    }
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
        showBack={true}
        onBack={handleBackPress}
      />
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: Spacing.xl * 3 }}>
        {/* Personalized Header */}
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
          <Text style={{
            fontSize: 20,
            fontFamily: Typography.fonts.bodyMedium,
            color: Colors.brand.primary,
            textAlign: 'center',
            marginBottom: Spacing.sm,
            fontWeight: '600',
          }}>
            Final Review ✨
          </Text>

          <Text style={{
            fontSize: 28,
            fontFamily: Typography.fonts.display,
            color: Colors.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.xs,
          }}>
            {userData.firstName ? `Ready to roll, ${userData.firstName}?` : 'Ready to roll?'}
          </Text>

          <Text style={styles.subtitle}>
            One last look before you're officially in the game.
          </Text>
        </View>

        {/* Missing Info Audit Card */}
        {missing.length > 0 && (
          <View style={[styles.card, { borderWidth: 1, borderColor: Colors.border.secondary }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Looks like you missed a few</Text>
              <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
                Tap "Edit" on any section to fix
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              {missing.map(item => (
                <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="alert-circle" size={16} color={Colors.brand.primary} />
                  <Text style={{ ...Typography.styles.body, color: Colors.text.primary }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <SummaryCard title="Name" onEdit={() => handleEdit('/onboarding/name')}>
          <Text style={styles.nameText}>{userData.firstName} {userData.lastName}</Text>
          {userData.firstName && userData.lastName ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm }}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
                Looks good
              </Text>
            </View>
          ) : null}
        </SummaryCard>

        <SummaryCard title="Profile Photo" onEdit={() => handleEdit('/onboarding/profile-image')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
            {userData.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            ) : (
              <MonogramAvatar first={userData.firstName} last={userData.lastName} />
            )}
            <View>
              {userData.profileImage ? (
                <Text style={{ ...Typography.styles.body, color: Colors.text.primary }}>
                  Photo added
                </Text>
              ) : (
                <Text style={{ ...Typography.styles.body, color: Colors.text.secondary }}>
                  No photo yet
                </Text>
              )}
            </View>
          </View>
          {userData.profileImage ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm }}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
                Looks good
              </Text>
            </View>
          ) : (
            <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary, marginTop: Spacing.sm }}>
              Add a photo later from your profile
            </Text>
          )}
        </SummaryCard>

        <SummaryCard title="Basic Info" onEdit={() => handleEdit('/onboarding/basic-info')}>
          <View style={styles.infoGrid}>
            <InfoItem label="Sport" value={userData.gender && userData.sport ? `${userData.gender} ${userData.sport}` : userData.sport} />
            <InfoItem label="Position" value={userData.position} />
            <InfoItem label="Grad Year" value={userData.graduationYear} />
          </View>
          {userData.sport && userData.position && userData.graduationYear ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm }}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
                Looks good
              </Text>
            </View>
          ) : null}
        </SummaryCard>

        <SummaryCard title="Team Info" onEdit={() => handleEdit('/onboarding/team')}>
          <View style={{ gap: Spacing.md }}>
            {/* High School Section */}
            <View>
              <Text style={{ ...Typography.styles.body, color: Colors.text.primary, marginBottom: Spacing.sm, fontWeight: '600' }}>
                High School
              </Text>
              <View style={styles.infoGrid}>
                <InfoItem label="School" value={userData.schoolName} />
                <InfoItem label="City, State" value={userData.schoolCity && userData.schoolState ? `${userData.schoolCity}, ${userData.schoolState}` : ''} />
                <InfoItem label="Level" value={userData.schoolLevel} />
                {userData.schoolJersey && <InfoItem label="Jersey #" value={userData.schoolJersey} />}
              </View>
            </View>

            {/* Club Section */}
            {userData.clubEnabled && (
              <View>
                <Text style={{ ...Typography.styles.body, color: Colors.text.primary, marginBottom: Spacing.sm, fontWeight: '600' }}>
                  Club Team
                </Text>
                <View style={styles.infoGrid}>
                  <InfoItem label="Organization" value={userData.clubOrg} />
                  <InfoItem label="Team" value={userData.clubTeam} />
                  {userData.clubCity && userData.clubState && (
                    <InfoItem label="City, State" value={`${userData.clubCity}, ${userData.clubState}`} />
                  )}
                  {userData.clubJersey && <InfoItem label="Jersey #" value={userData.clubJersey} />}
                </View>
              </View>
            )}
          </View>
          
          {userData.schoolName && userData.schoolLevel ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm }}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
                Looks good
              </Text>
            </View>
          ) : null}
        </SummaryCard>

        <SummaryCard title="Season Goals" onEdit={() => handleEdit('/onboarding/goals')}>
          <View style={{ gap: Spacing.sm }}>
            {userData.selectedGoals.map((goal: GoalTemplate, index: number) => (
              <View key={goal.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}>
                <Text style={{ ...Typography.styles.body, color: Colors.brand.primary, fontWeight: '600', minWidth: 20 }}>
                  {index + 1}.
                </Text>
                <Text style={styles.goalText}>{goal.title}</Text>
              </View>
            ))}
          </View>
          {userData.selectedGoals?.length === 3 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm }}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
                Looks good
              </Text>
            </View>
          ) : null}
        </SummaryCard>

      </ScrollView>

      {/* Fixed Button */}
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <Pressable
            style={{
              borderRadius: BorderRadius.xl,
              overflow: 'hidden',
              opacity: 1,
              ...Shadows.lg,
            }}
            onPress={handleComplete}
          >
            {/* Breathing Overlay */}
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
                borderRadius: BorderRadius.xl,
              }}
            />

            <LinearGradient
              colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
              style={{
                paddingVertical: Spacing.lg,
                paddingHorizontal: Spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
              }}>
                <Text style={{
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}>
                  {allGood ? 'Enter Locker' : 'Review Missing Fields'}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={'#FFFFFF'}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
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
