import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { HeroCard } from '../../../shared/components/HeroCard';
import { gameDataService, SeasonStats, SavedGame } from '../../../shared/services/GameDataService';
import GameDetailsModal from '../../../shared/components/GameDetailsModal';

// Hero Section Component
const HeroSection = ({ 
  onTeamTypeChange, 
  selectedTeamType,
  userProfile
}: { 
  onTeamTypeChange: (type: 'highschool' | 'club') => void;
  selectedTeamType: 'highschool' | 'club';
  userProfile: any;
}) => {
  const handleLogGamePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Navigate to log game');
  };

  const handleTeamTypeToggle = async (type: 'highschool' | 'club') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTeamTypeChange(type);
    console.log('Team type changed to:', type);
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 600 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      {/* Header with Name and Sport Tag */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 32,
            fontFamily: Typography.fonts.display,
            color: Colors.text.primary,
            fontWeight: '700',
            marginBottom: Spacing.xs,
            lineHeight: 38,
          }}>
            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Loading...'}
          </Text>
        </View>
        
        <View style={{
          backgroundColor: Colors.brand.primary,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.lg,
        }}>
          <Text style={{
            ...Typography.styles.caption,
            color: '#FFFFFF',
            fontWeight: '600',
          }}>
            {userProfile?.gender && userProfile?.sport ? `${userProfile.gender} ${userProfile.sport}` : 'Lacrosse'}
          </Text>
        </View>
      </View>

      {/* Class and Position */}
      <Text style={{
        ...Typography.styles.body,
        color: Colors.text.secondary,
        marginBottom: Spacing.lg,
        lineHeight: 20,
      }}>
        {userProfile?.graduationYear ? `Class of ${userProfile.graduationYear}` : 'Class of 2027'} • {userProfile?.position || 'Position'}
      </Text>

      {/* Profile Image and Stats Row */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
      }}>
        {/* Profile Image */}
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: Colors.surface.elevated2,
          marginRight: Spacing.lg,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          {userProfile?.profileImage ? (
            <Image 
              source={{ uri: userProfile.profileImage }} 
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Text style={{
              ...Typography.styles.h2,
              color: Colors.text.primary,
              fontWeight: '600',
            }}>
              {userProfile?.firstName?.charAt(0) || 'A'}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              ...Typography.styles.h2,
              color: Colors.text.primary,
              fontWeight: '700',
              lineHeight: 28,
            }}>
              6'3
            </Text>
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.secondary,
              marginTop: 4,
              lineHeight: 16,
            }}>
              HT
            </Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              ...Typography.styles.h2,
              color: Colors.text.primary,
              fontWeight: '700',
              lineHeight: 28,
            }}>
              N/A
            </Text>
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.secondary,
              marginTop: 4,
              lineHeight: 16,
            }}>
              GPA
            </Text>
          </View>
        </View>
      </View>

      {/* Team Info Row */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.styles.h3,
            color: Colors.text.primary,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            {selectedTeamType === 'highschool' 
              ? (userProfile?.schoolName || '--')
              : (userProfile?.clubEnabled && userProfile?.clubOrg ? userProfile.clubOrg : '--')
            }
          </Text>
          <Text style={{
            ...Typography.styles.caption,
            color: Colors.text.secondary,
            marginTop: 4,
            lineHeight: 16,
          }}>
            {selectedTeamType === 'highschool' ? 'HIGH SCHOOL' : 'CLUB'}
          </Text>
        </View>
        
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{
            ...Typography.styles.h3,
            color: Colors.text.primary,
            fontWeight: '600',
            lineHeight: 24,
          }}>
            {selectedTeamType === 'highschool' 
              ? (userProfile?.schoolCity && userProfile?.schoolState 
                  ? `${userProfile.schoolCity}, ${userProfile.schoolState}` 
                  : '--')
              : (userProfile?.clubCity && userProfile?.clubState 
                  ? `${userProfile.clubCity}, ${userProfile.clubState}` 
                  : '--')
            }
          </Text>
          <Text style={{
            ...Typography.styles.caption,
            color: Colors.text.secondary,
            marginTop: 4,
            lineHeight: 16,
          }}>
            HOMETOWN
          </Text>
        </View>
      </View>

      {/* Team Type Buttons - Only show if user has club team */}
      {userProfile?.clubEnabled && (
        <View style={{
          flexDirection: 'row',
          gap: Spacing.md,
        }}>
          <Pressable
            onPress={() => handleTeamTypeToggle('highschool')}
            style={{
              flex: 1,
              backgroundColor: selectedTeamType === 'highschool' ? Colors.brand.primary : Colors.surface.elevated2,
              paddingVertical: Spacing.md,
              borderRadius: BorderRadius.lg,
              alignItems: 'center',
            }}
          >
            <Text style={{
              ...Typography.styles.body,
              color: selectedTeamType === 'highschool' ? '#FFFFFF' : Colors.text.secondary,
              fontWeight: selectedTeamType === 'highschool' ? '600' : '500',
              lineHeight: 20,
            }}>
              High School
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => handleTeamTypeToggle('club')}
            style={{
              flex: 1,
              backgroundColor: selectedTeamType === 'club' ? Colors.brand.primary : Colors.surface.elevated2,
              paddingVertical: Spacing.md,
              borderRadius: BorderRadius.lg,
              alignItems: 'center',
            }}
          >
            <Text style={{
              ...Typography.styles.body,
              color: selectedTeamType === 'club' ? '#FFFFFF' : Colors.text.secondary,
              fontWeight: selectedTeamType === 'club' ? '600' : '500',
              lineHeight: 20,
            }}>
              Club
            </Text>
          </Pressable>
        </View>
      )}
    </MotiView>
  );
};

// Performance Stats Component (wrapped in card)
const PerformanceStats = ({ teamType, seasonStats }: { teamType: 'highschool' | 'club', seasonStats: SeasonStats | null }) => {
  // Use real data from seasonStats or default to zeros if not available
  const stats = seasonStats || {
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    totalGoals: 0,
    totalAssists: 0,
    totalShots: 0,
    totalShotsOnGoal: 0,
    totalSaves: 0,
    totalShotsFaced: 0,
    totalGoalsAgainst: 0,
    avgGoalsPerGame: 0,
    avgAssistsPerGame: 0,
    overallShootingPercentage: 0,
    overallSavePercentage: 0
  };
  
  const statCards = [
    { 
      label: 'Save Percentage', 
      value: stats.overallSavePercentage.toFixed(1), 
      suffix: '%', 
      trend: stats.overallSavePercentage > 0 ? 1 : 0, 
      trendValue: stats.totalGames > 1 ? '+' + (stats.overallSavePercentage / stats.totalGames).toFixed(1) + '%' : '0%'
    },
    { 
      label: 'Total Saves', 
      value: stats.totalSaves.toString(), 
      suffix: '', 
      trend: stats.totalSaves > 0 ? 1 : 0,
      trendValue: stats.totalGames > 0 ? '+' + (stats.totalSaves / stats.totalGames).toFixed(0) : '0'
    },
    { 
      label: 'Shots Faced', 
      value: stats.totalShotsFaced.toString(), 
      suffix: '', 
      trend: stats.totalShotsFaced > 0 ? 1 : 0,
      trendValue: stats.totalGames > 0 ? '+' + (stats.totalShotsFaced / stats.totalGames).toFixed(0) : '0'
    },
    { 
      label: 'Goals Against', 
      value: stats.totalGoalsAgainst.toString(), 
      suffix: '', 
      trend: stats.totalGoalsAgainst > 0 ? -1 : 0,
      trendValue: stats.totalGames > 0 ? '+' + (stats.totalGoalsAgainst / stats.totalGames).toFixed(0) : '0'
    },
  ];

  const getTrendColor = (trend: number) => {
    if (trend > 0) return Colors.status.success;
    if (trend < 0) return Colors.status.error;
    return Colors.text.tertiary;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '↗';
    if (trend < 0) return '↘';
    return '→';
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 200 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      <Text style={{
        fontSize: 28,
        fontFamily: Typography.fonts.display,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
        fontWeight: '600',
        lineHeight: 34,
      }}>
        Performance Stats
      </Text>
      
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
      }}>
        {statCards.map((stat, index) => (
          <MotiView
            key={stat.label}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: 'timing', 
              duration: 400, 
              delay: 300 + (index * 100) 
            }}
            style={{
              flex: 1,
              minWidth: '45%',
              backgroundColor: Colors.surface.elevated2,
              padding: Spacing.lg,
              borderRadius: BorderRadius.lg,
              ...Shadows.card,
            }}
          >
            {/* Trend Indicator */}
            <View style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Spacing.sm,
            }}>
              <Text style={{
                fontSize: 12,
                color: getTrendColor(stat.trend),
                fontWeight: '600',
                marginRight: 2,
                lineHeight: 16,
              }}>
                {getTrendIcon(stat.trend)}
              </Text>
              <Text style={{
                fontSize: 12,
                color: getTrendColor(stat.trend),
                fontWeight: '600',
                lineHeight: 16,
              }}>
                {stat.trendValue}
              </Text>
            </View>

            {/* Main Stat Value */}
            <View style={{ alignItems: 'flex-start', width: '100%' }}>
              <Text style={{
                ...Typography.styles.h1,
                color: Colors.text.primary,
                fontWeight: '700',
                fontSize: 36,
                lineHeight: 44,
                marginBottom: Spacing.sm,
              }}>
                {stat.value}{stat.suffix}
              </Text>
              
              {/* Stat Label */}
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.secondary,
                fontWeight: '500',
                fontSize: 14,
                lineHeight: 18,
              }}>
                {stat.label}
              </Text>
            </View>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Per Game Averages Component
const PerGameAverages = ({ teamType, seasonStats }: { teamType: 'highschool' | 'club', seasonStats: SeasonStats | null }) => {
  // Use real data from seasonStats or default to zeros if not available
  const stats = seasonStats || {
    totalGames: 0,
    totalSaves: 0,
    totalShotsFaced: 0,
    totalGoalsAgainst: 0
  };
  
  // Calculate per game averages
  const savesPerGame = stats.totalGames > 0 ? (stats.totalSaves / stats.totalGames).toFixed(1) : '0.0';
  const shotsFacedPerGame = stats.totalGames > 0 ? (stats.totalShotsFaced / stats.totalGames).toFixed(1) : '0.0';
  const goalsAgainstPerGame = stats.totalGames > 0 ? (stats.totalGoalsAgainst / stats.totalGames).toFixed(1) : '0.0';
  
  const perGameStats = [
    { label: 'Saves', value: savesPerGame },
    { label: 'Shots Faced', value: shotsFacedPerGame },
    { label: 'Goals Against', value: goalsAgainstPerGame },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 400 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      <Text style={{
        fontSize: 28,
        fontFamily: Typography.fonts.display,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
        fontWeight: '600',
        lineHeight: 34,
      }}>
        Per Game Averages
      </Text>
      
      <Text style={{
        ...Typography.styles.body,
        color: Colors.text.secondary,
        marginBottom: Spacing.xl,
        fontSize: 16,
        lineHeight: 20,
      }}>
        (0 Games)
      </Text>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {perGameStats.map((stat, index) => (
          <MotiView
            key={stat.label}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: 'timing', 
              duration: 400, 
              delay: 500 + (index * 100) 
            }}
            style={{
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Text style={{
              ...Typography.styles.h1,
              color: Colors.text.primary,
              fontWeight: '700',
              fontSize: 40,
              lineHeight: 48,
              marginBottom: Spacing.sm,
            }}>
              {stat.value}
            </Text>
            
            <Text style={{
              ...Typography.styles.body,
              color: Colors.text.secondary,
              fontWeight: '500',
              fontSize: 14,
              lineHeight: 18,
              textAlign: 'center',
            }}>
              {stat.label}
            </Text>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Season Goals Component
const SeasonGoals = ({ teamType, userProfile }: { teamType: 'highschool' | 'club'; userProfile: any }) => {
  // Use user's actual goals if available, otherwise show default goals
  const userGoals = userProfile?.selectedGoals || [];
  
  const seasonGoals = userGoals.length > 0 
    ? userGoals.map((goal: any, index: number) => ({
        label: goal.title,
        current: 0,
        target: goal.target,
        progress: 0,
        progressText: `0 / ${goal.target}`,
        statusText: `${goal.target} ${goal.unit} to goal`,
        isGood: index % 2 === 0, // Alternate colors for visual variety
      }))
    : [
        {
          label: 'Save % Goal',
          current: 0,
          target: 75,
          progress: 0,
          progressText: '0% / 75%',
          statusText: '+75% improvement needed',
          isGood: false,
        },
        {
          label: 'Total Saves Goal', 
          current: 0,
          target: 200,
          progress: 0,
          progressText: '0 / 200',
          statusText: '+200 saves to goal',
          isGood: true,
        },
        {
          label: 'Goals Against Goal',
          current: 0,
          target: 60,
          progress: 0,
          progressText: '0 / 60',
          statusText: '60 goals under target',
          isGood: false,
        },
      ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 600 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      <Text style={{
        fontSize: 28,
        fontFamily: Typography.fonts.display,
        color: Colors.text.primary,
        marginBottom: Spacing.xl,
        fontWeight: '600',
        lineHeight: 34,
      }}>
        Season Goals
      </Text>
      
      {seasonGoals.map((goal: any, index: number) => (
        <MotiView
          key={goal.label}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ 
            type: 'timing', 
            duration: 400, 
            delay: 700 + (index * 150) 
          }}
          style={{
            marginBottom: index < seasonGoals.length - 1 ? Spacing.xl : 0,
          }}
        >
          {/* Goal Header */}
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
              fontSize: 16,
              lineHeight: 20,
            }}>
              {goal.label}
            </Text>
            
            <Text style={{
              ...Typography.styles.body,
              color: Colors.text.secondary,
              fontWeight: '500',
              fontSize: 16,
              lineHeight: 20,
            }}>
              {goal.progressText}
            </Text>
          </View>
          
          {/* Progress Bar */}
          <View style={{
            height: 8,
            backgroundColor: Colors.surface.elevated2,
            borderRadius: 4,
            marginBottom: Spacing.sm,
            overflow: 'hidden',
          }}>
            <MotiView
              from={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ 
                type: 'timing', 
                duration: 800, 
                delay: 800 + (index * 150) 
              }}
              style={{
                height: '100%',
                backgroundColor: goal.isGood ? Colors.brand.primary : Colors.status.error,
                borderRadius: 4,
              }}
            />
          </View>
          
          {/* Status Text */}
          <Text style={{
            ...Typography.styles.caption,
            color: Colors.text.secondary,
            fontSize: 14,
            lineHeight: 18,
          }}>
            {goal.statusText}
          </Text>
        </MotiView>
      ))}
    </MotiView>
  );
};

// AI Insights Component with Hybrid Strategy
const AIInsights = ({ teamType }: { teamType: 'highschool' | 'club' }) => {
  // Mock user state - in real app, this would come from user context/store
  const gamesLogged = 0; // 0, 1-2, 3+ for different states
  const isPremium = false;
  const isFamily = false;

  const getInsightState = () => {
    if (gamesLogged === 0) return 'preparation';
    if (gamesLogged < 3) return 'basic';
    if (gamesLogged >= 3 && !isPremium) return 'free';
    if (isPremium && !isFamily) return 'premium';
    return 'family';
  };

  const state = getInsightState();

  const handleUpgradePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Navigate to upgrade flow');
  };

  const handleLogGamePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Navigate to log game');
  };

  const renderPreparationState = () => (
    <>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
      }}>
        <Text style={{
          ...Typography.styles.h2,
          color: Colors.text.primary,
          fontWeight: '600',
          fontSize: 24,
          lineHeight: 32,
        }}>
          AI Preparation Hub
        </Text>
      </View>

      <View style={{
        backgroundColor: Colors.surface.elevated2,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
      }}>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.primary,
          fontWeight: '600',
          marginBottom: Spacing.sm,
          lineHeight: 20,
        }}>
          Goalie Preparation Tips
        </Text>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.secondary,
          lineHeight: 20,
          marginBottom: Spacing.md,
        }}>
          • Focus on stance and positioning fundamentals{'\n'}
          • Practice tracking shots from different angles{'\n'}
          • Set realistic season goals for improvement
        </Text>
      </View>

      <Pressable
        onPress={handleLogGamePress}
        style={{
          backgroundColor: Colors.brand.primary,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          borderRadius: BorderRadius.lg,
          alignItems: 'center',
        }}
      >
        <Text style={{
          ...Typography.styles.body,
          color: '#FFFFFF',
          fontWeight: '600',
          lineHeight: 20,
        }}>
          Log Your First Game to Unlock Performance Insights
        </Text>
      </Pressable>
    </>
  );

  const renderBasicState = () => (
    <>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="analytics" size={24} color={Colors.brand.primary} />
          <Text style={{
            ...Typography.styles.h2,
            color: Colors.text.primary,
            marginLeft: Spacing.md,
            fontWeight: '600',
            fontSize: 24,
            lineHeight: 32,
          }}>
            AI Insights
          </Text>
        </View>
        <View style={{
          backgroundColor: Colors.brand.primary,
          paddingHorizontal: Spacing.sm,
          paddingVertical: 2,
          borderRadius: BorderRadius.sm,
        }}>
          <Text style={{
            ...Typography.styles.caption,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '600',
          }}>
            BASIC
          </Text>
        </View>
      </View>

      <View style={{
        backgroundColor: Colors.surface.elevated2,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
      }}>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.primary,
          fontWeight: '600',
          marginBottom: Spacing.sm,
          lineHeight: 20,
        }}>
          Early Performance Summary
        </Text>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.secondary,
          lineHeight: 20,
        }}>
          Great start! Keep logging games to unlock trend analysis and personalized recommendations.
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        gap: Spacing.md,
      }}>
        <Pressable
          onPress={handleLogGamePress}
          style={{
            flex: 1,
            backgroundColor: Colors.brand.primary,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            alignItems: 'center',
          }}
        >
          <Text style={{
            ...Typography.styles.body,
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 18,
          }}>
            Log Game
          </Text>
        </Pressable>
        
        <Pressable
          onPress={handleUpgradePress}
          style={{
            flex: 1,
            backgroundColor: Colors.surface.elevated2,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            alignItems: 'center',
          }}
        >
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.primary,
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 18,
          }}>
            Upgrade
          </Text>
        </Pressable>
      </View>
    </>
  );

  const renderFreeState = () => (
    <>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="bulb" size={24} color={Colors.brand.primary} />
          <Text style={{
            ...Typography.styles.h2,
            color: Colors.text.primary,
            marginLeft: Spacing.md,
            fontWeight: '600',
            fontSize: 24,
            lineHeight: 32,
          }}>
            AI Insights
          </Text>
        </View>
        <View style={{
          backgroundColor: Colors.status.success,
          paddingHorizontal: Spacing.sm,
          paddingVertical: 2,
          borderRadius: BorderRadius.sm,
        }}>
          <Text style={{
            ...Typography.styles.caption,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '600',
          }}>
            UNLOCKED
          </Text>
        </View>
      </View>

      <View style={{
        backgroundColor: Colors.surface.elevated2,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
      }}>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.primary,
          fontWeight: '600',
          marginBottom: Spacing.sm,
          lineHeight: 20,
        }}>
          Performance Trends
        </Text>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.secondary,
          lineHeight: 20,
        }}>
          Your save percentage is trending upward. Focus on low shots to improve further.
        </Text>
      </View>

      <View style={{
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.2)',
      }}>
        <Text style={{
          ...Typography.styles.body,
          color: Colors.brand.primary,
          fontWeight: '600',
          marginBottom: Spacing.sm,
          lineHeight: 20,
        }}>
          Upgrade for Advanced Analytics
        </Text>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          lineHeight: 16,
          marginBottom: Spacing.md,
        }}>
          • Shot heat maps & pattern analysis{'\n'}
          • College-level performance comparisons{'\n'}
          • Predictive season projections
        </Text>
        
        <Pressable
          onPress={handleUpgradePress}
          style={{
            backgroundColor: Colors.brand.primary,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: BorderRadius.md,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{
            ...Typography.styles.caption,
            color: '#FFFFFF',
            fontWeight: '600',
            lineHeight: 16,
          }}>
            Try Premium Free
          </Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 800 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      {state === 'preparation' && renderPreparationState()}
      {state === 'basic' && renderBasicState()}
      {state === 'free' && renderFreeState()}
    </MotiView>
  );
};

// Recent Games Component - ESPN Style
const RecentGames = ({ teamType }: { teamType: 'highschool' | 'club' }) => {
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent games from GameDataService
  useEffect(() => {
    const loadRecentGames = async () => {
      setIsLoading(true);
      try {
        // Get all games
        const allGames = await gameDataService.getAllGames();
        
        // Filter by season type and sort by date (newest first)
        const filteredGames = allGames
          .filter(game => game.seasonType === teamType)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3); // Take only the 3 most recent games
        
        // Transform to the format needed for display
        const formattedGames = filteredGames.map(game => {
          // Format date to be more readable
          const gameDate = new Date(game.date);
          const formattedDate = gameDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          // Calculate top stats based on position
          let topStats = [];
          
          if (game.position?.toLowerCase() === 'goalie' || game.position?.toLowerCase() === 'goalkeeper') {
            // Goalie stats
            const savePercentage = game.stats.shotsFaced > 0 
              ? ((game.stats.saves / game.stats.shotsFaced) * 100).toFixed(1) + '%'
              : '0.0%';
              
            topStats = [
              { label: 'Saves', value: game.stats.saves.toString() },
              { label: 'Save %', value: savePercentage },
              { label: 'Goals Against', value: game.stats.goalsAgainst.toString() },
            ];
          } else {
            // Field player stats
            topStats = [
              { label: 'Goals', value: game.stats.goals.toString() },
              { label: 'Assists', value: game.stats.assists.toString() },
              { label: 'Points', value: (game.stats.goals + game.stats.assists).toString() },
            ];
          }
          
          // Format opponent with home/away indicator
          const opponentPrefix = game.isHome ? 'vs. ' : 'at ';
          
          return {
            id: game.id,
            opponent: opponentPrefix + game.opponent,
            date: formattedDate,
            result: game.result.toUpperCase().charAt(0), // Just take first letter: W, L, T
            score: 'N/A', // We don't track opponent score yet
            topStats: topStats,
          };
        });
        
        setRecentGames(formattedGames);
      } catch (error) {
        console.error('Failed to load recent games:', error);
        setRecentGames([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentGames();
    
    // Set up an interval to refresh games
    const intervalId = setInterval(() => loadRecentGames(), 5000);
    return () => clearInterval(intervalId);
  }, [teamType]);

  const getResultColor = (result: string) => {
    return result === 'W' ? Colors.status.success : Colors.status.error;
  };

  const getResultBgColor = (result: string) => {
    return result === 'W' ? `${Colors.status.success}20` : `${Colors.status.error}20`;
  };

  const handleViewAllGames = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/stats');
  };

  const handleGamePress = async (gameId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const game = await gameDataService.getGameById(gameId);
      if (game) {
        setSelectedGame(game);
        setGameDetailsVisible(true);
      }
    } catch (error) {
      console.error('Failed to load game details:', error);
    }
  };
  
  const handleCloseGameDetails = () => {
    setGameDetailsVisible(false);
  };
  
  const handleEditGame = (game: SavedGame) => {
    console.log('Edit game:', game.id);
    // TODO: Implement game editing functionality
    setGameDetailsVisible(false);
  };

  // Show empty state if no games
  if (recentGames.length === 0) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 1200 }}
        style={{
          backgroundColor: Colors.surface.elevated,
          borderRadius: BorderRadius.xl,
          padding: Spacing.xl,
          marginBottom: Spacing.xl,
          ...Shadows.card,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.lg,
        }}>
          <Text style={{
            ...Typography.styles.h2,
            color: Colors.text.primary,
            fontWeight: '600',
            fontSize: 24,
            lineHeight: 32,
          }}>
            Recent Games
          </Text>
        </View>
        
        <EmptyState
          title="No games logged yet"
          message="Tap Log Game to get started and see your performance analytics."
          icon="game-controller-outline"
        />
      </MotiView>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 1200 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            ...Typography.styles.h2,
            color: Colors.text.primary,
            fontWeight: '600',
            fontSize: 24,
            lineHeight: 32,
          }}>
            Recent Games
          </Text>
        </View>
        
        <Pressable onPress={handleViewAllGames}>
          <Text style={{
            ...Typography.styles.body,
            color: Colors.brand.primary,
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 18,
          }}>
            View All
          </Text>
        </Pressable>
      </View>

      {/* Games List */}
      <View style={{ gap: Spacing.lg }}>
        {recentGames.map((game, index) => (
          <MotiView
            key={game.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ 
              type: 'timing', 
              duration: 400, 
              delay: 1300 + (index * 150) 
            }}
          >
            <Pressable
              onPress={() => handleGamePress(game.id)}
              style={{
                backgroundColor: Colors.surface.elevated2,
                borderRadius: BorderRadius.lg,
                padding: Spacing.lg,
              }}
            >
              {/* Game Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Spacing.md,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    ...Typography.styles.body,
                    color: Colors.text.primary,
                    fontWeight: '600',
                    fontSize: 16,
                    lineHeight: 20,
                    marginBottom: 2,
                  }}>
                    {game.opponent}
                  </Text>
                  <Text style={{
                    ...Typography.styles.caption,
                    color: Colors.text.secondary,
                    fontSize: 14,
                    lineHeight: 18,
                  }}>
                    {game.date}
                  </Text>
                </View>
                
                {/* Result Badge */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.sm,
                }}>
                  <Text style={{
                    ...Typography.styles.body,
                    color: Colors.text.primary,
                    fontWeight: '600',
                    fontSize: 16,
                    lineHeight: 20,
                  }}>
                    {game.score}
                  </Text>
                  
                  <View style={{
                    backgroundColor: getResultBgColor(game.result),
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 4,
                    borderRadius: BorderRadius.sm,
                    minWidth: 24,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      ...Typography.styles.caption,
                      color: getResultColor(game.result),
                      fontSize: 12,
                      fontWeight: '700',
                      lineHeight: 16,
                    }}>
                      {game.result}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Top 3 Stats */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: Spacing.md,
                borderTopWidth: 1,
                borderTopColor: Colors.border.secondary,
                marginBottom: Spacing.md,
              }}>
                {game.topStats.map((stat: { label: string; value: string }, statIndex: number) => (
                  <View key={statIndex} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{
                      ...Typography.styles.body,
                      color: Colors.text.primary,
                      fontWeight: '700',
                      fontSize: 18,
                      lineHeight: 22,
                      marginBottom: 2,
                    }}>
                      {stat.value}
                    </Text>
                    <Text style={{
                      ...Typography.styles.caption,
                      color: Colors.text.secondary,
                      fontSize: 12,
                      lineHeight: 16,
                      textAlign: 'center',
                    }}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* View Full Stats Button */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/stats/game/${game.id}`);
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: Colors.brand.primary,
                  borderRadius: BorderRadius.lg,
                  paddingVertical: Spacing.sm,
                  paddingHorizontal: Spacing.md,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  ...Typography.styles.body,
                  color: Colors.brand.primary,
                  fontWeight: '600',
                  fontSize: 14,
                  lineHeight: 18,
                }}>
                  View Full Stats
                </Text>
              </Pressable>
            </Pressable>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Upcoming Events Component
const UpcomingEvents = ({ teamType }: { teamType: 'highschool' | 'club' }) => {
  const upcomingEvents = teamType === 'highschool' ? [
    {
      id: '1',
      type: 'game',
      title: 'vs. Westfield High School',
      date: 'Thu, Mar 14',
      time: '4:00 PM',
      location: 'Home Field',
      status: 'confirmed',
      icon: 'trophy',
    },
    {
      id: '2', 
      type: 'tournament',
      title: 'State Championship Qualifier',
      date: 'Thu, Mar 21',
      time: '9:00 AM',
      location: 'Regional Sports Complex',
      status: 'registered',
      icon: 'medal',
    },
    {
      id: '3',
      type: 'practice',
      title: 'Team Practice',
      date: 'Sun, Mar 17',
      time: '3:30 PM', 
      location: 'School Field',
      status: 'scheduled',
      icon: 'fitness',
    },
  ] : [
    {
      id: '1',
      type: 'game',
      title: 'vs. Elite Lacrosse Club',
      date: 'Thu, Mar 14',
      time: '6:00 PM',
      location: 'Metro Sports Complex',
      status: 'confirmed',
      icon: 'trophy',
    },
    {
      id: '2', 
      type: 'tournament',
      title: 'College Showcase Tournament',
      date: 'Thu, Mar 21',
      time: '9:00 AM',
      location: 'University Sports Center',
      status: 'registered',
      icon: 'medal',
    },
    {
      id: '3',
      type: 'practice',
      title: 'Club Training Session',
      date: 'Sun, Mar 17',
      time: '4:00 PM', 
      location: 'Training Facility',
      status: 'scheduled',
      icon: 'fitness',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return Colors.status.success;
      case 'registered': return Colors.brand.primary;
      case 'scheduled': return Colors.brand.accent;
      default: return Colors.text.tertiary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'registered': return 'Registered';
      case 'scheduled': return 'Scheduled';
      default: return 'Pending';
    }
  };

  const handleViewCalendar = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/schedule');
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay: 1000 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
        ...Shadows.card,
      }}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            ...Typography.styles.h2,
            color: Colors.text.primary,
            fontWeight: '600',
            fontSize: 24,
            lineHeight: 32,
          }}>
            Upcoming Events
          </Text>
        </View>
        
        <Pressable onPress={handleViewCalendar}>
          <Text style={{
            ...Typography.styles.body,
            color: Colors.brand.primary,
            fontWeight: '600',
            fontSize: 14,
            lineHeight: 18,
          }}>
            View Calendar
          </Text>
        </Pressable>
      </View>

      {/* Events List */}
      <View style={{ gap: Spacing.md }}>
        {upcomingEvents.map((event, index) => (
          <MotiView
            key={event.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ 
              type: 'timing', 
              duration: 400, 
              delay: 1100 + (index * 150) 
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            {/* Status Bar */}
            <View style={{
              width: 4,
              height: '100%',
              backgroundColor: getStatusColor(event.status),
              borderRadius: 2,
              marginRight: Spacing.md,
              minHeight: 60,
            }} />
            
            {/* Event Icon */}
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: Colors.surface.elevated2,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: Spacing.md,
            }}>
              <Ionicons 
                name={event.icon as any} 
                size={20} 
                color={Colors.text.secondary} 
              />
            </View>
            
            {/* Event Details */}
            <View style={{ flex: 1 }}>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 16,
                lineHeight: 20,
                marginBottom: 4,
              }}>
                {event.title}
              </Text>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 2,
              }}>
                <Ionicons name="time" size={14} color={Colors.text.secondary} />
                <Text style={{
                  ...Typography.styles.caption,
                  color: Colors.text.secondary,
                  marginLeft: 4,
                  fontSize: 14,
                  lineHeight: 18,
                }}>
                  {event.date} at {event.time}
                </Text>
              </View>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.sm,
              }}>
                <Ionicons name="location" size={14} color={Colors.text.secondary} />
                <Text style={{
                  ...Typography.styles.caption,
                  color: Colors.text.secondary,
                  marginLeft: 4,
                  fontSize: 14,
                  lineHeight: 18,
                }}>
                  {event.location}
                </Text>
              </View>
              
              <View style={{
                backgroundColor: `${getStatusColor(event.status)}20`,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 2,
                borderRadius: BorderRadius.sm,
                alignSelf: 'flex-start',
              }}>
                <Text style={{
                  ...Typography.styles.caption,
                  color: getStatusColor(event.status),
                  fontSize: 12,
                  fontWeight: '600',
                  lineHeight: 16,
                }}>
                  {getStatusText(event.status)}
                </Text>
              </View>
            </View>
            
            {/* Options Menu */}
            <Pressable
              style={{
                padding: Spacing.sm,
                marginLeft: Spacing.sm,
              }}
            >
              <Ionicons 
                name="ellipsis-vertical" 
                size={16} 
                color={Colors.text.tertiary} 
              />
            </Pressable>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Empty State Component
const EmptyState = ({ title, message, icon }: { title: string; message: string; icon: string }) => {
  return (
    <View style={{
      backgroundColor: Colors.surface.elevated,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.xl,
    }}>
      <Ionicons name={icon as any} size={48} color={Colors.text.secondary} />
      <Text style={{
        ...Typography.styles.h3,
        color: Colors.text.primary,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
        fontWeight: '600',
      }}>
        {title}
      </Text>
      <Text style={{
        ...Typography.styles.body,
        color: Colors.text.secondary,
        textAlign: 'center',
      }}>
        {message}
      </Text>
    </View>
  );
};

export default function DashboardScreen() {
  const [selectedTeamType, setSelectedTeamType] = React.useState<'highschool' | 'club'>('highschool');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [seasonStats, setSeasonStats] = useState<SeasonStats | null>(null);
  const [selectedGame, setSelectedGame] = useState<SavedGame | null>(null);
  const [gameDetailsVisible, setGameDetailsVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile
        const profile = await AsyncStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setUserProfile(parsedProfile);
          
          // Set default team type based on user's club status
          if (parsedProfile.clubEnabled) {
            setSelectedTeamType('club');
          } else {
            setSelectedTeamType('highschool');
          }
        }

        // Load season stats
        const stats = await gameDataService.getSeasonStats();
        setSeasonStats(stats);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, []);

  // Refresh stats when component mounts and after navigation
  React.useEffect(() => {
    const refreshStats = async () => {
      try {
        const stats = await gameDataService.getSeasonStats();
        setSeasonStats(stats);
      } catch (error) {
        console.error('Failed to refresh stats:', error);
      }
    };

    // Initial load
    refreshStats();

    // Set up an interval to check for updates (simulating focus events)
    const intervalId = setInterval(refreshStats, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleProfileEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Navigate to profile edit');
    // TODO: Navigate to profile editing
  };


  // Get position-specific stats for hero card
  const getHeroStats = () => {
    const position = userProfile?.position?.toLowerCase();
    const stats = seasonStats || { totalGames: 0, wins: 0, losses: 0, ties: 0 };
    const wlRecord = `${stats.wins}-${stats.losses}${stats.ties > 0 ? `-${stats.ties}` : ''}`;
    
    // For goalies, show only Games and W-L since detailed stats are in Performance section
    if (position === 'goalie' || position === 'goalkeeper') {
      return [
        { icon: 'trophy-outline', value: stats.totalGames.toString(), label: 'Games', onPress: () => router.push('/(tabs)/stats') },
        { icon: 'ribbon-outline', value: wlRecord, label: 'W-L', onPress: () => router.push('/(tabs)/stats') },
      ];
    }
    
    // For field players, could show Games, W-L, Goals, Assists
    // But for now, keeping it simple with just Games and W-L for all positions
    return [
      { icon: 'trophy-outline', value: stats.totalGames.toString(), label: 'Games', onPress: () => router.push('/(tabs)/stats') },
      { icon: 'ribbon-outline', value: wlRecord, label: 'W-L', onPress: () => router.push('/(tabs)/stats') },
    ];
  };

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
        {/* Hero Card */}
        <HeroCard
          firstName={userProfile?.firstName}
          lastName={userProfile?.lastName}
          avatarUrl={userProfile?.profileImage}
          classYear={userProfile?.graduationYear}
          position={userProfile?.position}
          sport={userProfile?.sport}
          gender={userProfile?.gender}
          teamType={selectedTeamType}
          highSchool={{
            name: userProfile?.schoolName,
            location: userProfile?.schoolCity && userProfile?.schoolState 
              ? `${userProfile.schoolCity}, ${userProfile.schoolState}` 
              : undefined,
            jerseyNumber: userProfile?.jerseyNumber,
          }}
          club={{
            name: userProfile?.clubOrg,
            location: userProfile?.clubCity && userProfile?.clubState 
              ? `${userProfile.clubCity}, ${userProfile.clubState}` 
              : undefined,
            jerseyNumber: userProfile?.clubJerseyNumber,
          }}
          stats={getHeroStats()}
          onTeamToggle={userProfile?.clubEnabled ? setSelectedTeamType : undefined}
          onProfileEdit={handleProfileEdit}
        />
        
        {/* AI Insights */}
        <AIInsights teamType={selectedTeamType} />
        
        {/* Performance Stats */}
        <PerformanceStats teamType={selectedTeamType} seasonStats={seasonStats} />
        
        {/* Per Game Averages */}
        <PerGameAverages teamType={selectedTeamType} seasonStats={seasonStats} />
        
        {/* Upcoming Events */}
        <UpcomingEvents teamType={selectedTeamType} />
        
        {/* Recent Games */}
        <RecentGames teamType={selectedTeamType} />
      </ScrollView>
      
      {/* Game Details Modal */}
      <GameDetailsModal
        visible={gameDetailsVisible}
        onClose={handleCloseGameDetails}
        game={selectedGame}
        onEdit={handleEditGame}
      />
    </SafeAreaView>
  );
}
