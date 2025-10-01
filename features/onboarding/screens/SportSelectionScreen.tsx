import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../../../shared/theme';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

interface SportOption {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  available: boolean;
  color: string;
}

const SPORT_OPTIONS: SportOption[] = [
  {
    id: 'lacrosse',
    name: 'Lacrosse',
    icon: '🥍',
    subtitle: 'Goals • Assists • Ground Balls',
    available: true,
    color: Colors.brand.primary,
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    subtitle: 'Points • Rebounds • Assists',
    available: false,
    color: '#9CA3AF',
  },
  {
    id: 'football',
    name: 'Football',
    icon: '🏈',
    subtitle: 'Touchdowns • Yards • Tackles',
    available: false,
    color: '#3B82F6',
  },
  {
    id: 'soccer',
    name: 'Soccer',
    icon: '⚽',
    subtitle: 'Goals • Assists • Saves',
    available: false,
    color: '#10B981',
  },
];

export default function SportSelectionScreen() {
  const { setCurrentStep, markStepCompleted, updateSport, data } = useOnboardingStore();
  
  // Form state
  const [selectedSport, setSelectedSport] = useState(data.sport || '');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set status bar style for dark background
    StatusBar.setBarStyle('light-content', true);

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Animate progress bar to 20% (2/10)
      Animated.timing(progressAnim, {
        toValue: 0.2,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();

    return () => {
      StatusBar.setBarStyle('light-content', true);
    };
  }, []);

  const handleSportSelect = async (sportId: string, available: boolean) => {
    if (!available) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // TODO: Handle "Notify me" functionality for coming soon sports
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedSport(sportId);
  };

  const handleContinue = async () => {
    if (!selectedSport) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save selected sport
    updateSport(selectedSport);
    
    // Mark sport selection as completed and move to next step
    markStepCompleted(3);
    setCurrentStep(4);
    
    setTimeout(() => {
      router.push('/(onboarding)/team-identity');
    }, 200);
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const isFormValid = selectedSport !== '';
  const selectedSportName = SPORT_OPTIONS.find(sport => sport.id === selectedSport)?.name || '';
  const firstName = data.firstName || 'there';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logos/textLogoWhite.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Progress Bar and Navigation */}
          <View style={styles.navigationContainer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.stepIndicator}>2/10</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Content Section */}
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Headline and Subtext */}
            <View style={styles.textContent}>
              <Text style={styles.headline}>
                Alright {firstName}, which sport are you repping?
              </Text>
              
              <Text style={styles.subtext}>
                Your sport unlocks the right stats, drills, and goals in your Locker.
              </Text>
            </View>

            {/* Sport Options */}
            <View style={styles.sportsContainer}>
              {SPORT_OPTIONS.map((sport) => (
                <Pressable
                  key={sport.id}
                  style={[
                    styles.sportCard,
                    selectedSport === sport.id && styles.sportCardSelected,
                    !sport.available && styles.sportCardDisabled,
                  ]}
                  onPress={() => handleSportSelect(sport.id, sport.available)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${sport.name}`}
                >
                  <View style={styles.sportCardContent}>
                    {/* Icon and Status */}
                    <View style={styles.sportIconContainer}>
                      <View style={[
                        styles.sportIcon,
                        { backgroundColor: sport.available ? sport.color : '#374151' }
                      ]}>
                        <Text style={styles.sportEmoji}>{sport.icon}</Text>
                      </View>
                      
                      {selectedSport === sport.id && sport.available && (
                        <View style={styles.checkmarkContainer}>
                          <Ionicons name="checkmark-circle" size={24} color={Colors.brand.primary} />
                        </View>
                      )}
                    </View>

                    {/* Sport Info */}
                    <View style={styles.sportInfo}>
                      <View style={styles.sportHeader}>
                        <Text style={styles.sportName}>{sport.name}</Text>
                        <View style={[
                          styles.statusBadge,
                          sport.available ? styles.statusAvailable : styles.statusComingSoon
                        ]}>
                          <Text style={[
                            styles.statusText,
                            sport.available ? styles.statusTextAvailable : styles.statusTextComingSoon
                          ]}>
                            {sport.available ? '✅ Available Now' : '🟠 Coming Soon'}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.sportSubtitle}>{sport.subtitle}</Text>
                      
                      {!sport.available && (
                        <Pressable style={styles.notifyButton}>
                          <Text style={styles.notifyButtonText}>Notify me</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text style={[
              styles.continueButtonText,
              !isFormValid && styles.continueButtonTextDisabled,
            ]}>
              {selectedSportName ? `Continue with ${selectedSportName}` : 'Select a sport to continue'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 180,
    height: 50,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  headline: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 40,
  },
  subtext: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  sportsContainer: {
    gap: Spacing.lg,
  },
  sportCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sportCardSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: '#1F2937',
  },
  sportCardDisabled: {
    opacity: 0.7,
  },
  sportCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sportIconContainer: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  sportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportEmoji: {
    fontSize: 28,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000000',
    borderRadius: 12,
  },
  sportInfo: {
    flex: 1,
  },
  sportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  sportName: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusComingSoon: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#22C55E',
  },
  statusTextComingSoon: {
    color: '#F97316',
  },
  sportSubtitle: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    marginBottom: Spacing.sm,
  },
  notifyButton: {
    alignSelf: 'flex-start',
  },
  notifyButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  continueButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 28,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonDisabled: {
    backgroundColor: '#374151',
  },
  continueButtonText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
