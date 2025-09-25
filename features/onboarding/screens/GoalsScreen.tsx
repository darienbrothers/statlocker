import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Animated,
  ScrollView,
  StyleSheet,
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

  const [firstName, setFirstName] = useState('');
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [userLevel, setUserLevel] = useState<Level | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<GoalTemplate[]>([]);
  const [recommendedGoals, setRecommendedGoals] = useState<GoalTemplate[]>([]);
  const [previewGoal, setPreviewGoal] = useState<GoalTemplate | null>(null);
  const [levelFilter, setLevelFilter] = useState<Level | null>(null);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const breathingAnim = useRef(new Animated.Value(0)).current;

  // Load user data to filter goals
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.multiGet([
          'onboarding_firstName',
          'onboarding_position',
          'onboarding_schoolLevel',
          'onboarding_selectedGoals'
        ]);
        const dataMap = new Map(data);
        
        const storedName = dataMap.get('onboarding_firstName');
        if (storedName) {
          const val = storedName.trim();
          setFirstName(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
        }
        
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

  // Filter goals based on user data and level filter
  useEffect(() => {
    if (userPosition) {
      const targetLevel = levelFilter || userLevel;
      const filtered = GOALS_LIBRARY.filter(goal => 
        goal.position === userPosition && // Only exact position match, no Skills
        (goal.level === targetLevel || goal.level === 'All') &&
        goal.timeframe === 'season' // Only show season goals for onboarding
      );
      setRecommendedGoals(filtered.slice(0, 4)); // Show 4 goals when filtered
    }
  }, [userPosition, userLevel, levelFilter]);

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

  const animateTick = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const isFormValid = selectedGoals.length === GOAL_LIMIT;

  const handleDealMe3 = () => {
    // Clear current selections and pick 3 random goals
    const shuffled = [...recommendedGoals].sort(() => 0.5 - Math.random());
    const newGoals = shuffled.slice(0, GOAL_LIMIT);
    setSelectedGoals(newGoals);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    animateTick();
  };

  const handleClearAll = () => {
    setSelectedGoals([]);
    setLevelFilter(null); // Reset filter too
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleShuffleGoals = () => {
    // Shuffle the recommended goals to show different options
    const shuffled = [...recommendedGoals].sort(() => 0.5 - Math.random());
    setRecommendedGoals(shuffled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };


  const handleContinue = async () => {
    if (!isFormValid) return;
    try {
      // Save for onboarding flow
      await AsyncStorage.setItem('onboarding_selectedGoals', JSON.stringify(selectedGoals));
      // Also save for dashboard use
      await AsyncStorage.setItem('user_selectedGoals', JSON.stringify(selectedGoals));
      // Check if editing from review
      const editingFromReview = await AsyncStorage.getItem('editingFromReview');
      if (editingFromReview === 'true') {
        await AsyncStorage.removeItem('editingFromReview');
      }
      router.push('/onboarding/review');
    } catch (e) {
      console.error('Failed to save selected goals', e);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSelectGoal = (goal: GoalTemplate) => {
    const isSelected = selectedGoals.some(g => g.id === goal.id);
    if (isSelected) {
      setSelectedGoals(prev => prev.filter(g => g.id !== goal.id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (selectedGoals.length < GOAL_LIMIT) {
      const newGoals = [...selectedGoals, goal];
      setSelectedGoals(newGoals);
      animateTick();
      
      // Fire success haptic when hitting limit for first time
      if (newGoals.length === GOAL_LIMIT) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  // Auto-save selected goals when they change
  useEffect(() => {
    const saveGoals = async () => {
      try {
        await AsyncStorage.multiSet([
          ['onboarding_selectedGoals', JSON.stringify(selectedGoals)],
          ['user_selectedGoals', JSON.stringify(selectedGoals)]
        ]);
      } catch (e) {
        console.error('Failed to auto-save selected goals', e);
      }
    };
    if (selectedGoals.length > 0) {
      saveGoals();
    }
  }, [selectedGoals]);

  const remaining = GOAL_LIMIT - selectedGoals.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
      <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={['name', 'profile-image', 'basic', 'team']}
        showBack={true}
        onBack={handleBackPress}
      />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Enhanced Header */}
        <View style={{ alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl }}>
          <Text style={{
            fontSize: 28,
            fontFamily: Typography.fonts.display,
            color: Colors.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.xs,
            fontWeight: '600',
          }}>
            Choose 3 Goals 🎯
          </Text>

          <Text style={{
            fontSize: 20,
            fontFamily: Typography.fonts.bodyMedium,
            color: Colors.brand.primary,
            textAlign: 'center',
            marginBottom: Spacing.sm,
          }}>
            {firstName ? `Lock in your focus, ${firstName}` : 'Lock in your focus'}
          </Text>

          <Text style={{
            ...Typography.styles.bodyLarge,
            color: Colors.text.secondary,
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: Spacing.lg
          }}>
            We'll track these on your dashboard and tie progress to your position.
          </Text>
        </View>

        {/* Coach Tip */}
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.tertiary,
          textAlign: 'center',
          marginBottom: Spacing.md,
          paddingHorizontal: Spacing.xl,
        }}>
          💡 Focus on game performance goals that match your position and level. These will drive your season progress tracking.
        </Text>

        {/* Shuffle Controls */}
        <View style={{
          flexDirection: 'row',
          gap: Spacing.sm,
          paddingHorizontal: Spacing.xl,
          marginBottom: Spacing.md,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Pressable
            onPress={handleDealMe3}
            disabled={recommendedGoals.length < 3}
            style={{
              backgroundColor: Colors.surface.elevated,
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.md,
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: Colors.border.secondary,
              opacity: recommendedGoals.length < 3 ? 0.5 : 1,
            }}
          >
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.brand.primary,
              fontWeight: '600',
            }}>
              🎲 Deal Me 3
            </Text>
          </Pressable>


          <Pressable
            onPress={handleShuffleGoals}
            style={{
              backgroundColor: Colors.surface.elevated,
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.md,
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: Colors.border.secondary,
            }}
          >
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.primary,
              fontWeight: '600',
            }}>
              🔀 Shuffle Goals
            </Text>
          </Pressable>

          {selectedGoals.length > 0 && (
            <Pressable
              onPress={handleClearAll}
              style={{
                backgroundColor: Colors.surface.elevated,
                paddingVertical: Spacing.sm,
                paddingHorizontal: Spacing.md,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: Colors.border.secondary,
              }}
            >
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontWeight: '600',
              }}>
                🗑️ Clear All
              </Text>
            </Pressable>
          )}
        </View>

        {/* Level Filters */}
        <View style={{
          paddingHorizontal: Spacing.xl,
          marginBottom: Spacing.lg,
        }}>
          <Text style={{
            ...Typography.styles.caption,
            color: Colors.text.secondary,
            textAlign: 'center',
            marginBottom: Spacing.sm,
            fontWeight: '600',
          }}>
            Filter by Level
          </Text>
          <View style={{
            flexDirection: 'row',
            gap: Spacing.sm,
            justifyContent: 'center',
          }}>
            {(['Freshman', 'JV', 'Varsity'] as Level[]).map(level => (
              <Pressable
                key={level}
                onPress={() => {
                  setLevelFilter(levelFilter === level ? null : level);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  backgroundColor: levelFilter === level ? Colors.brand.primary : Colors.surface.elevated,
                  paddingVertical: Spacing.sm,
                  paddingHorizontal: Spacing.md,
                  borderRadius: BorderRadius.md,
                  borderWidth: 1,
                  borderColor: levelFilter === level ? Colors.brand.primary : Colors.border.secondary,
                  minWidth: 80,
                }}
              >
                <Text style={{
                  ...Typography.styles.caption,
                  color: levelFilter === level ? '#FFFFFF' : Colors.text.primary,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Selected Goals Chips */}
        {selectedGoals.length > 0 && (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingHorizontal: Spacing.xl,
            marginBottom: Spacing.md,
          }}>
            {selectedGoals.map(g => (
              <Pressable
                key={g.id}
                onPress={() => handleSelectGoal(g)}
                style={{
                  backgroundColor: Colors.surface.elevated,
                  borderColor: Colors.brand.primary,
                  borderWidth: 1,
                  borderRadius: 999,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={{ ...Typography.styles.caption, color: Colors.text.primary }}>
                  {g.title} ×
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        
        {/* Goals List */}
        <View style={{ paddingHorizontal: Spacing.xl }}>
          {recommendedGoals.length > 0 ? (
            <FlatList
              data={recommendedGoals}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const isSelected = selectedGoals.some(g => g.id === item.id);
                return (
                  <Pressable 
                    onPress={() => handleSelectGoal(item)}
                    onLongPress={() => setPreviewGoal(item)}
                    delayLongPress={200}
                    style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                      <Ionicons 
                        name={isSelected ? 'checkbox' : 'square-outline'} 
                        size={24} 
                        color={isSelected ? Colors.brand.primary : Colors.text.secondary} 
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.goalTitle, isSelected && { color: Colors.brand.primary }]}>
                          {item.title}
                        </Text>
                        <Text style={styles.goalMeta}>
                          {item.target} {item.unit} • {item.timeframe}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No goals for this position/level yet. Try changing your position in Basic Info.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Preview Modal */}
      {previewGoal && (
        <View style={styles.previewModal}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ ...Typography.styles.h2, color: Colors.text.primary, flex: 1, marginRight: 12 }}>
              {previewGoal.title}
            </Text>
            <Pressable onPress={() => setPreviewGoal(null)}>
              <Ionicons name="close" size={22} color={Colors.text.secondary} />
            </Pressable>
          </View>

          <Text style={{ ...Typography.styles.body, color: Colors.text.secondary, marginTop: 8 }}>
            {(previewGoal as any).description || 'Track this consistently to see your season trend improve.'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: Spacing.md }}>
            <Text style={{ ...Typography.styles.caption, color: Colors.text.tertiary }}>
              {previewGoal.position} • {previewGoal.level}
            </Text>
          </View>

          <Pressable
            onPress={() => { handleSelectGoal(previewGoal); setPreviewGoal(null); }}
            style={{ marginTop: Spacing.lg, borderRadius: BorderRadius.lg, overflow: 'hidden' }}
          >
            <LinearGradient 
              colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]} 
              style={{ padding: 14, alignItems: 'center' }}
            >
              <Text style={{ ...Typography.styles.button, color: '#fff' }}>
                {selectedGoals.some(g => g.id === previewGoal.id) ? 'Remove Goal' : 'Add Goal'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {/* Fixed Button */}
      <View style={styles.buttonContainer}>
        <Text style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: Typography.fonts.body,
          color: Colors.text.tertiary,
          textAlign: 'center',
          marginBottom: Spacing.md,
          opacity: isFormValid ? 1 : 0.7,
        }}>
          You can always adjust these goals later in your profile settings.
        </Text>

        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <Pressable
            style={{
              borderRadius: BorderRadius.xl,
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
                  borderRadius: BorderRadius.xl,
                }}
              />
            )}

            <LinearGradient
              colors={
                isFormValid
                  ? [Colors.brand.primary, `${Colors.brand.primary}DD`]
                  : [Colors.border.secondary, Colors.border.primary]
              }
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
                  color: isFormValid ? '#FFFFFF' : Colors.text.tertiary,
                  fontWeight: '600',
                }}>
                  {isFormValid ? 'Confirm 3 Goals' : `Choose ${remaining} more`}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={isFormValid ? '#FFFFFF' : Colors.text.tertiary}
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
  goalCard: {
    backgroundColor: Colors.surface.elevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    ...Shadows.sm,
  },
  goalCardSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: `${Colors.brand.primary}08`,
  },
  goalTitle: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    marginBottom: 4,
    fontWeight: '600',
  },
  goalMeta: {
    ...Typography.styles.caption,
    color: Colors.text.tertiary,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  previewModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surface.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    ...Shadows.lg,
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
