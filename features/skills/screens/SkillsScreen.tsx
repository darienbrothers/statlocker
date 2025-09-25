import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';

// Types
interface Drill {
  id: string;
  title: string;
  description: string;
  position: 'Goalie' | 'Field Player' | 'All';
  skillType: 'Reflexes' | 'Footwork' | 'Passing' | 'Shooting' | 'Conditioning' | 'Ball Handling';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: number; // minutes
  reps?: string;
  sets?: number;
  equipment?: string[];
  completedAt?: string; // ISO date string
}

interface WeeklyTarget {
  id: string;
  drillId: string;
  targetCount: number; // times per week
  currentCount: number;
  drillTitle: string;
}

interface FilterState {
  position: string | null;
  skillType: string | null;
  difficulty: string | null;
  maxTime: number | null;
}

// Filter Chips Component
const FilterChips = ({ 
  filters, 
  onFilterChange 
}: { 
  filters: FilterState; 
  onFilterChange: (key: keyof FilterState, value: any) => void;
}) => {
  const positions = ['All', 'Goalie', 'Field Player'];
  const skillTypes = ['All', 'Reflexes', 'Footwork', 'Passing', 'Shooting', 'Conditioning', 'Ball Handling'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const timeOptions = [
    { label: 'Any Time', value: null },
    { label: '≤ 10 min', value: 10 },
    { label: '≤ 20 min', value: 20 },
    { label: '≤ 30 min', value: 30 },
  ];

  const FilterRow = ({ 
    title, 
    options, 
    selectedValue, 
    onSelect 
  }: { 
    title: string; 
    options: any[]; 
    selectedValue: any; 
    onSelect: (value: any) => void;
  }) => (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={{
        ...Typography.styles.body,
        color: Colors.text.primary,
        fontWeight: '600',
        fontSize: 14,
        marginBottom: Spacing.sm,
      }}>
        {title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {options.map((option, index) => {
            const isSelected = title === 'Time' 
              ? selectedValue === option.value
              : selectedValue === option || (selectedValue === null && option === 'All');
            
            return (
              <Pressable
                key={index}
                onPress={() => {
                  const value = title === 'Time' 
                    ? option.value 
                    : option === 'All' ? null : option;
                  onSelect(value);
                }}
                style={{
                  backgroundColor: isSelected ? Colors.brand.primary : Colors.surface.elevated,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  borderRadius: BorderRadius.lg,
                  borderWidth: 1,
                  borderColor: isSelected ? Colors.brand.primary : Colors.border.secondary,
                }}
              >
                <Text style={{
                  ...Typography.styles.caption,
                  color: isSelected ? '#FFFFFF' : Colors.text.primary,
                  fontWeight: '600',
                  fontSize: 12,
                }}>
                  {title === 'Time' ? option.label : option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={{
      backgroundColor: Colors.surface.elevated,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      ...Shadows.card,
    }}>
      <Text style={{
        fontSize: 28,
        fontFamily: Typography.fonts.display,
        color: Colors.text.primary,
        fontWeight: '600',
        lineHeight: 34,
        marginBottom: Spacing.md,
      }}>
        Filters
      </Text>
      
      <FilterRow
        title="Position"
        options={positions}
        selectedValue={filters.position}
        onSelect={(value) => onFilterChange('position', value)}
      />
      
      <FilterRow
        title="Skill Type"
        options={skillTypes}
        selectedValue={filters.skillType}
        onSelect={(value) => onFilterChange('skillType', value)}
      />
      
      <FilterRow
        title="Difficulty"
        options={difficulties}
        selectedValue={filters.difficulty}
        onSelect={(value) => onFilterChange('difficulty', value)}
      />
      
      <FilterRow
        title="Time"
        options={timeOptions}
        selectedValue={filters.maxTime}
        onSelect={(value) => onFilterChange('maxTime', value)}
      />
    </View>
  );
};

// Drill Card Component
const DrillCard = ({ 
  drill, 
  onComplete, 
  isCompleted 
}: { 
  drill: Drill; 
  onComplete: (drillId: string) => void;
  isCompleted: boolean;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return Colors.status.success;
      case 'Intermediate': return Colors.status.warning;
      case 'Advanced': return Colors.status.error;
      default: return Colors.text.secondary;
    }
  };

  const handleComplete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete(drill.id);
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Shadows.card,
        opacity: isCompleted ? 0.7 : 1,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: Spacing.sm,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              ...Typography.styles.h3,
              color: Colors.text.primary,
              fontWeight: '600',
              fontSize: 16,
              lineHeight: 20,
              marginBottom: 4,
            }}>
              {drill.title}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <View style={{
                backgroundColor: getDifficultyColor(drill.difficulty) + '20',
                paddingHorizontal: Spacing.sm,
                paddingVertical: 2,
                borderRadius: BorderRadius.sm,
              }}>
                <Text style={{
                  ...Typography.styles.caption,
                  color: getDifficultyColor(drill.difficulty),
                  fontSize: 11,
                  fontWeight: '600',
                }}>
                  {drill.difficulty}
                </Text>
              </View>
              
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 11,
              }}>
                {drill.position}
              </Text>
              
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 11,
              }}>
                {drill.timeEstimate} min
              </Text>
            </View>
          </View>
          
          <Pressable
            onPress={handleComplete}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isCompleted ? Colors.status.success : Colors.surface.elevated2,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: isCompleted ? Colors.status.success : Colors.border.secondary,
            }}
          >
            {isCompleted && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </Pressable>
        </View>

        {/* Description */}
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.secondary,
          fontSize: 14,
          lineHeight: 18,
          marginBottom: Spacing.sm,
        }}>
          {drill.description}
        </Text>

        {/* Details */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
          {drill.reps && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="repeat-outline" size={14} color={Colors.text.secondary} />
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginLeft: 4,
              }}>
                {drill.reps}
              </Text>
            </View>
          )}
          
          {drill.sets && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="layers-outline" size={14} color={Colors.text.secondary} />
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginLeft: 4,
              }}>
                {drill.sets} sets
              </Text>
            </View>
          )}
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="fitness-outline" size={14} color={Colors.text.secondary} />
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.secondary,
              fontSize: 12,
              marginLeft: 4,
            }}>
              {drill.skillType}
            </Text>
          </View>
        </View>

        {/* Equipment */}
        {drill.equipment && drill.equipment.length > 0 && (
          <View style={{ marginTop: Spacing.sm }}>
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.secondary,
              fontSize: 11,
              marginBottom: 4,
            }}>
              Equipment: {drill.equipment.join(', ')}
            </Text>
          </View>
        )}
      </View>
    </MotiView>
  );
};

// Weekly Targets Component
const WeeklyTargets = ({ 
  targets, 
  onUpdateTarget 
}: { 
  targets: WeeklyTarget[]; 
  onUpdateTarget: (targetId: string, increment: boolean) => void;
}) => {
  if (targets.length === 0) return null;

  return (
    <View style={{
      backgroundColor: Colors.surface.elevated,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      ...Shadows.card,
    }}>
      <Text style={{
        fontSize: 28,
        fontFamily: Typography.fonts.display,
        color: Colors.text.primary,
        fontWeight: '600',
        lineHeight: 34,
        marginBottom: Spacing.md,
      }}>
        Weekly Targets
      </Text>
      
      {targets.map((target) => {
        const progress = target.currentCount / target.targetCount;
        const isComplete = target.currentCount >= target.targetCount;
        
        return (
          <View key={target.id} style={{ marginBottom: Spacing.md }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: Spacing.sm,
            }}>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 14,
                flex: 1,
              }}>
                {target.drillTitle}
              </Text>
              <Text style={{
                ...Typography.styles.caption,
                color: isComplete ? Colors.status.success : Colors.text.secondary,
                fontSize: 12,
                fontWeight: '600',
              }}>
                {target.currentCount}/{target.targetCount}
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View style={{
              height: 6,
              backgroundColor: Colors.surface.elevated2,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <MotiView
                from={{ width: 0 }}
                animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                transition={{ type: 'timing', duration: 500 }}
                style={{
                  height: '100%',
                  backgroundColor: isComplete ? Colors.status.success : Colors.brand.primary,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default function SkillsScreen() {
  const [filters, setFilters] = useState<FilterState>({
    position: null,
    skillType: null,
    difficulty: null,
    maxTime: null,
  });

  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());
  
  // Sample drill data including Wall Ball drills
  const [drills] = useState<Drill[]>([
    // Wall Ball Drills
    {
      id: '1',
      title: 'Wall Ball - Basic Catching',
      description: 'Stand 3 feet from wall, throw ball and catch on rebound. Focus on proper hand positioning and quick reactions.',
      position: 'Goalie',
      skillType: 'Reflexes',
      difficulty: 'Beginner',
      timeEstimate: 10,
      reps: '20 throws',
      sets: 3,
      equipment: ['Lacrosse ball', 'Wall'],
    },
    {
      id: '2',
      title: 'Wall Ball - Quick Stick',
      description: 'Rapid catch and release against wall. Develop quick hands and stick skills.',
      position: 'All',
      skillType: 'Ball Handling',
      difficulty: 'Intermediate',
      timeEstimate: 15,
      reps: '50 catches',
      sets: 2,
      equipment: ['Lacrosse stick', 'Ball', 'Wall'],
    },
    {
      id: '3',
      title: 'Wall Ball - Reaction Training',
      description: 'Throw ball at different angles and heights, react to unpredictable bounces.',
      position: 'Goalie',
      skillType: 'Reflexes',
      difficulty: 'Advanced',
      timeEstimate: 20,
      reps: '30 throws',
      sets: 4,
      equipment: ['Lacrosse ball', 'Wall'],
    },
    // Other Goalie Drills
    {
      id: '4',
      title: 'Shuffle Steps',
      description: 'Practice lateral movement in goal. Keep stick ready and maintain balance.',
      position: 'Goalie',
      skillType: 'Footwork',
      difficulty: 'Beginner',
      timeEstimate: 8,
      reps: '10 each direction',
      sets: 3,
      equipment: ['Cones'],
    },
    {
      id: '5',
      title: 'High-Low Saves',
      description: 'Alternate between high and low saves. Focus on proper body positioning.',
      position: 'Goalie',
      skillType: 'Reflexes',
      difficulty: 'Intermediate',
      timeEstimate: 12,
      reps: '15 saves',
      sets: 3,
      equipment: ['Balls', 'Goal'],
    },
    // Field Player Drills
    {
      id: '6',
      title: 'Cone Weaving',
      description: 'Weave through cones while maintaining ball control. Improve agility and stick skills.',
      position: 'Field Player',
      skillType: 'Footwork',
      difficulty: 'Beginner',
      timeEstimate: 10,
      reps: '5 runs',
      sets: 3,
      equipment: ['Cones', 'Ball', 'Stick'],
    },
    {
      id: '7',
      title: 'Shooting Accuracy',
      description: 'Target specific corners of the goal. Focus on accuracy over power.',
      position: 'Field Player',
      skillType: 'Shooting',
      difficulty: 'Intermediate',
      timeEstimate: 15,
      reps: '20 shots',
      sets: 2,
      equipment: ['Balls', 'Goal', 'Targets'],
    },
    {
      id: '8',
      title: 'Sprint Conditioning',
      description: 'High-intensity sprints with recovery periods. Build game-speed endurance.',
      position: 'All',
      skillType: 'Conditioning',
      difficulty: 'Advanced',
      timeEstimate: 25,
      reps: '10 sprints',
      sets: 1,
      equipment: ['Cones'],
    },
  ]);

  const [weeklyTargets] = useState<WeeklyTarget[]>([
    {
      id: '1',
      drillId: '1',
      targetCount: 3,
      currentCount: 2,
      drillTitle: 'Wall Ball - Basic Catching',
    },
    {
      id: '2',
      drillId: '2',
      targetCount: 4,
      currentCount: 1,
      drillTitle: 'Wall Ball - Quick Stick',
    },
    {
      id: '3',
      drillId: '4',
      targetCount: 2,
      currentCount: 2,
      drillTitle: 'Shuffle Steps',
    },
  ]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDrillComplete = (drillId: string) => {
    const now = new Date().toISOString();
    setCompletedDrills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(drillId)) {
        newSet.delete(drillId);
      } else {
        newSet.add(drillId);
      }
      return newSet;
    });
    
    // Here you would typically save to Firestore or local storage
    Alert.alert(
      'Drill Completed!',
      'Great work! Keep building those skills.',
      [{ text: 'OK' }]
    );
  };

  const filteredDrills = drills.filter(drill => {
    if (filters.position && drill.position !== filters.position && drill.position !== 'All') {
      return false;
    }
    if (filters.skillType && drill.skillType !== filters.skillType) {
      return false;
    }
    if (filters.difficulty && drill.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.maxTime && drill.timeEstimate > filters.maxTime) {
      return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }} edges={['top']}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: Spacing.lg,
          paddingTop: Spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text style={{
            ...Typography.styles.h1,
            color: Colors.text.primary,
            fontWeight: '700',
            fontSize: 32,
            lineHeight: 38,
            marginBottom: Spacing.sm,
          }}>
            Skills
          </Text>
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            fontSize: 16,
            lineHeight: 22,
            marginBottom: Spacing.xl,
          }}>
            Drill library with filters and progress tracking
          </Text>
        </MotiView>

        {/* Weekly Targets */}
        <WeeklyTargets 
          targets={weeklyTargets}
          onUpdateTarget={() => {}}
        />

        {/* Filters */}
        <FilterChips 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Drill Results */}
        <View style={{ marginBottom: Spacing.lg }}>
          <Text style={{
            ...Typography.styles.h3,
            color: Colors.text.primary,
            fontWeight: '600',
            fontSize: 18,
            marginBottom: Spacing.md,
          }}>
            Drills ({filteredDrills.length})
          </Text>
          
          {filteredDrills.length > 0 ? (
            filteredDrills.map((drill, index) => (
              <MotiView
                key={drill.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: index * 100 }}
              >
                <DrillCard
                  drill={drill}
                  onComplete={handleDrillComplete}
                  isCompleted={completedDrills.has(drill.id)}
                />
              </MotiView>
            ))
          ) : (
            <View style={{
              backgroundColor: Colors.surface.elevated,
              borderRadius: BorderRadius.lg,
              padding: Spacing.xl,
              alignItems: 'center',
              ...Shadows.card,
            }}>
              <Ionicons name="search-outline" size={32} color={Colors.text.secondary} />
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.secondary,
                textAlign: 'center',
                marginTop: Spacing.sm,
              }}>
                No drills match your current filters.{'\n'}Try adjusting your search criteria.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
