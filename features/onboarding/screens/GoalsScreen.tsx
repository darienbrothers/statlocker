import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
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
import { GOALS_LIBRARY } from '../../../shared/data/goalsLibrary';
import type { Position, Level, GoalTemplate } from '../../../shared/types/goals';

const GOAL_LIMIT = 3;

export default function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const currentStepIndex = getCurrentStepIndex('goals');

  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [userLevel, setUserLevel] = useState<Level | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<GoalTemplate[]>([]);
  const [recommendedGoals, setRecommendedGoals] = useState<GoalTemplate[]>([]);

  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Load user data to filter goals
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.multiGet([
          'onboarding_position',
          'onboarding_schoolLevel',
          'onboarding_selectedGoals'
        ]);
        const dataMap = new Map(data);
        
        const position = dataMap.get('onboarding_position') as Position;
        const level = dataMap.get('onboarding_schoolLevel') as Level;
        const savedGoals = dataMap.get('onboarding_selectedGoals');
        
        setUserPosition(position);
        setUserLevel(level);
        
        if (savedGoals) {
          try {
            const parsedGoals = JSON.parse(savedGoals);
            setSelectedGoals(parsedGoals);
          } catch (e) {
            console.error('Failed to parse saved goals:', e);
          }
        }
      } catch (e) {
        console.error('Failed to load user data for goals screen', e);
      }
    };
    loadUserData();
  }, []);

  // Filter goals based on user data
  useEffect(() => {
    if (userPosition && userLevel) {
      const filtered = GOALS_LIBRARY.filter(g => 
        (g.position === userPosition || g.position === 'Skills') && 
        (g.level === userLevel || g.level === 'All')
      );
      setRecommendedGoals(filtered);
    }
  }, [userPosition, userLevel]);

  const isFormValid = selectedGoals.length === GOAL_LIMIT;

  const handleShuffle = () => {
    const unselected = recommendedGoals.filter(g => !selectedGoals.some(sg => sg.id === g.id));
    const shuffled = [...unselected].sort(() => 0.5 - Math.random());
    const needed = GOAL_LIMIT - selectedGoals.length;
    if (needed > 0) {
      setSelectedGoals(prev => [...prev, ...shuffled.slice(0, needed)]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleContinue = async () => {
    if (!isFormValid) return;
    try {
      await AsyncStorage.setItem('onboarding_selectedGoals', JSON.stringify(selectedGoals));
    } catch (e) {
      console.error('Failed to save selected goals', e);
    }
    router.push('/onboarding/review');
  };

    const handleBackPress = () => {
    router.back();
  };


  const handleSelectGoal = (goal: GoalTemplate) => {
    const isSelected = selectedGoals.some(g => g.id === goal.id);
    if (isSelected) {
      setSelectedGoals(prev => prev.filter(g => g.id !== goal.id));
    } else if (selectedGoals.length < GOAL_LIMIT) {
      setSelectedGoals(prev => [...prev, goal]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Auto-save selected goals when they change
  useEffect(() => {
    const saveGoals = async () => {
      try {
        await AsyncStorage.setItem('onboarding_selectedGoals', JSON.stringify(selectedGoals));
      } catch (e) {
        console.error('Failed to auto-save selected goals', e);
      }
    };
    if (selectedGoals.length > 0) {
      saveGoals();
    }
  }, [selectedGoals]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
            <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={['name', 'profile-image', 'basic', 'team']}
        showBack={true}
        onBack={handleBackPress}
      />
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl }}>
            <Text style={{
              fontSize: 20,
              fontFamily: Typography.fonts.bodyMedium,
              color: Colors.brand.primary,
              textAlign: 'center',
              marginBottom: Spacing.sm,
              fontWeight: '600',
            }}>
              Set Your Goals
            </Text>
            <Text style={{
              fontSize: 28,
              fontFamily: Typography.fonts.display,
              color: Colors.text.primary,
              textAlign: 'center',
            }}>
              Commit to Your Craft
            </Text>
            <Text style={styles.subtitle}>Choose 3 goals to start. We've recommended some based on your profile.</Text>
        </View>

        {/* Goals List */}
        <FlatList
          data={recommendedGoals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedGoals.some(g => g.id === item.id);
            return (
              <Pressable onPress={() => handleSelectGoal(item)} style={[styles.goalCard, isSelected && styles.goalCardSelected]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  <Ionicons name={isSelected ? 'checkbox' : 'square-outline'} size={24} color={isSelected ? Colors.brand.primary : Colors.text.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalTitle}>{item.title}</Text>
                    <Text style={styles.goalSubtitle}>{item.position} • {item.level}</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${Math.random() * 60 + 10}%` }]} />
                </View>
              </Pressable>
            );
          }}
          ListHeaderComponent={() => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg }}>
              <Text style={styles.selectedCount}>{selectedGoals.length} / {GOAL_LIMIT} selected</Text>
              <Pressable onPress={handleShuffle}>
                <Text style={styles.shuffleButton}>Shuffle</Text>
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: Spacing.xl }}
        />
      </View>

      {/* Fixed Button */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleContinue} disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.6 }}>
          <LinearGradient
            colors={isFormValid ? [Colors.brand.primary, `${Colors.brand.primary}DD`] : [Colors.border.secondary, Colors.border.primary]}
            style={styles.button}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Text style={{ ...Typography.styles.button, color: isFormValid ? '#FFFFFF' : Colors.text.tertiary }}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={isFormValid ? '#FFFFFF' : Colors.text.tertiary} />
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
  goalCard: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: 16,
    padding: 16,
    ...Shadows.sm,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    borderColor: Colors.brand.primary,
  },
  goalTitle: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  goalSubtitle: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.surface.primary,
    borderRadius: 4,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
  },
  selectedCount: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  shuffleButton: {
    ...Typography.styles.body,
    color: Colors.brand.primary,
    fontWeight: '600',
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
});
