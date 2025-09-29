import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius } from '../../../shared/theme';
import { ProgressBar } from '../../../shared/components';
import { useOnboardingStore } from '../../../shared/stores/onboardingStore';

const SPORTS = [
  { 
    id: 'lacrosse', 
    name: 'Lacrosse', 
    icon: '🥍', 
    available: true,
    description: 'Track saves, goals, assists, and more'
  },
  { 
    id: 'basketball', 
    name: 'Basketball', 
    icon: '🏀', 
    available: false,
    description: 'Coming soon'
  },
  { 
    id: 'football', 
    name: 'Football', 
    icon: '🏈', 
    available: false,
    description: 'Coming soon'
  },
  { 
    id: 'soccer', 
    name: 'Soccer', 
    icon: '⚽', 
    available: false,
    description: 'Coming soon'
  },
  { 
    id: 'baseball', 
    name: 'Baseball', 
    icon: '⚾', 
    available: false,
    description: 'Coming soon'
  },
  { 
    id: 'hockey', 
    name: 'Hockey', 
    icon: '🏒', 
    available: false,
    description: 'Coming soon'
  },
];

export default function SportSelectionScreen() {
  const { data, updateSport, setCurrentStep, markStepCompleted } = useOnboardingStore();
  const [selectedSport, setSelectedSport] = useState<string>(data.sport);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSportSelect = async (sportId: string, available: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!available) {
      setShowNotifyModal(true);
      return;
    }
    
    setSelectedSport(sportId);
  };

  const handleContinue = async () => {
    if (!selectedSport) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save sport selection to store
    updateSport(selectedSport);
    markStepCompleted(1);
    setCurrentStep(2);
    
    router.push('/(onboarding)/name-input');
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header with Back Button and Progress */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.progressContainer}>
          <ProgressBar currentStep={1} totalSteps={9} />
        </View>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>
            ⚡ Which sport do you dominate?
          </Text>
          <Text style={styles.subtitleText}>
            Your sport unlocks the right stats, drills, and goals inside your Locker.
          </Text>
        </View>

        {/* Sports Grid */}
        <ScrollView style={styles.sportsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.sportsGrid}>
            {SPORTS.map((sport) => (
              <Pressable
                key={sport.id}
                style={[
                  styles.sportCard,
                  selectedSport === sport.id && styles.selectedSportCard,
                  !sport.available && styles.disabledSportCard,
                ]}
                onPress={() => handleSportSelect(sport.id, sport.available)}
              >
                <View style={styles.sportContent}>
                  <Text style={styles.sportIcon}>{sport.icon}</Text>
                  <Text style={[
                    styles.sportName,
                    !sport.available && styles.disabledText
                  ]}>
                    {sport.name}
                  </Text>
                  <Text style={[
                    styles.sportDescription,
                    !sport.available && styles.disabledText
                  ]}>
                    {sport.description}
                  </Text>
                  
                  {!sport.available && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  )}
                  
                  {selectedSport === sport.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark" size={16} color={Colors.text.inverse} />
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          
          {/* Helper Text */}
          <Text style={styles.helperText}>
            Play more than one? Pick your main sport for now — you can add others later.
          </Text>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.continueButton,
              !selectedSport && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!selectedSport}
          >
            <LinearGradient
              colors={
                selectedSport 
                  ? [Colors.brand.primary, Colors.brand.primaryShade]
                  : [Colors.text.tertiary, Colors.text.tertiary]
              }
              start={[0, 0]}
              end={[1, 1]}
              style={styles.continueButtonGradient}
            >
              <Text style={[
                styles.continueButtonText,
                !selectedSport && styles.disabledButtonText
              ]}>
                Continue
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  progressContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  titleSection: {
    marginBottom: Spacing.xl,
  },
  titleText: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    fontSize: 28,
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  subtitleText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
  },
  sportsContainer: {
    flex: 1,
  },
  sportsGrid: {
    gap: Spacing.md,
  },
  sportCard: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSportCard: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.surface.elevated,
  },
  disabledSportCard: {
    opacity: 0.6,
  },
  sportContent: {
    alignItems: 'center',
    position: 'relative',
  },
  sportIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  sportName: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  sportDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.text.tertiary,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.brand.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  comingSoonText: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: Colors.brand.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    ...Typography.styles.caption,
    color: Colors.text.tertiary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    paddingBottom: Spacing.md,
  },
  continueButton: {
    borderRadius: 25,
    minHeight: 56,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonText: {
    ...Typography.styles.button,
    color: Colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: Colors.text.secondary,
  },
});
