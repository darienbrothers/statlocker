import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';

// Game Header Component
const GameHeader = ({ gameData }: { gameData: any }) => {
  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  const getResultColor = (result: string) => {
    return result === 'W' ? Colors.status.success : Colors.status.error;
  };

  const getResultBgColor = (result: string) => {
    return result === 'W' ? `${Colors.status.success}20` : `${Colors.status.error}20`;
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      {/* Back Button */}
      <Pressable
        onPress={handleBackPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.lg,
        }}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.brand.primary} />
        <Text style={{
          ...Typography.styles.body,
          color: Colors.brand.primary,
          fontWeight: '600',
          marginLeft: Spacing.xs,
          fontSize: 16,
          lineHeight: 20,
        }}>
          Back to Recent Games
        </Text>
      </Pressable>

      {/* Game Info */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.styles.h1,
            color: Colors.text.primary,
            fontWeight: '700',
            fontSize: 32,
            lineHeight: 38,
            marginBottom: Spacing.xs,
          }}>
            {gameData.opponent}
          </Text>
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            fontSize: 16,
            lineHeight: 20,
          }}>
            {gameData.date} • {gameData.location || 'Home Field'}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            ...Typography.styles.h1,
            color: Colors.text.primary,
            fontWeight: '700',
            fontSize: 28,
            lineHeight: 34,
            marginBottom: Spacing.xs,
          }}>
            {gameData.score}
          </Text>
          
          <View style={{
            backgroundColor: getResultBgColor(gameData.result),
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.lg,
          }}>
            <Text style={{
              ...Typography.styles.body,
              color: getResultColor(gameData.result),
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 20,
            }}>
              {gameData.result === 'W' ? 'WIN' : 'LOSS'}
            </Text>
          </View>
        </View>
      </View>
    </MotiView>
  );
};

// Performance Summary Component
const PerformanceSummary = ({ gameData }: { gameData: any }) => {
  const performanceCards = [
    {
      label: 'Save Percentage',
      value: gameData.savePercentage?.toFixed(1) || '0.0',
      suffix: '%',
      icon: 'shield-checkmark',
      color: Colors.status.success,
      bgColor: `${Colors.status.success}15`,
    },
    {
      label: 'Total Saves',
      value: gameData.saves?.toString() || '0',
      suffix: '',
      icon: 'hand-left',
      color: Colors.brand.primary,
      bgColor: `${Colors.brand.primary}15`,
    },
    {
      label: 'Shots Faced',
      value: gameData.shotsFaced?.toString() || '0',
      suffix: '',
      icon: 'radio-button-on',
      color: Colors.brand.accent,
      bgColor: `${Colors.brand.accent}15`,
    },
    {
      label: 'Goals Against',
      value: gameData.goalsAgainst?.toString() || '0',
      suffix: '',
      icon: 'alert-circle',
      color: Colors.status.error,
      bgColor: `${Colors.status.error}15`,
    },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 200 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      <Text style={{
        ...Typography.styles.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
      }}>
        Performance Summary
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
      }}>
        {performanceCards.map((card, index) => (
          <MotiView
            key={card.label}
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
              backgroundColor: card.bgColor,
              padding: Spacing.lg,
              borderRadius: BorderRadius.lg,
              alignItems: 'center',
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: card.color,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Spacing.sm,
            }}>
              <Ionicons name={card.icon as any} size={20} color="#FFFFFF" />
            </View>

            <Text style={{
              ...Typography.styles.h1,
              color: card.color,
              fontWeight: '700',
              fontSize: 28,
              lineHeight: 34,
              marginBottom: Spacing.xs,
            }}>
              {card.value}{card.suffix}
            </Text>
            
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.secondary,
              fontSize: 12,
              lineHeight: 16,
              textAlign: 'center',
            }}>
              {card.label}
            </Text>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Quarter Breakdown Component
const QuarterBreakdown = ({ gameData }: { gameData: any }) => {
  const quarters = gameData.quarterBreakdown || [
    { quarter: 'Q1', saves: 4, shotsFaced: 6, goalsAgainst: 2 },
    { quarter: 'Q2', saves: 3, shotsFaced: 4, goalsAgainst: 1 },
    { quarter: 'Q3', saves: 5, shotsFaced: 7, goalsAgainst: 2 },
    { quarter: 'Q4', saves: 6, shotsFaced: 8, goalsAgainst: 2 },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 400 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      <Text style={{
        ...Typography.styles.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
      }}>
        Quarter by Quarter
      </Text>

      {/* Table Header */}
      <View style={{
        flexDirection: 'row',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.secondary,
        marginBottom: Spacing.sm,
      }}>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          fontWeight: '600',
          fontSize: 12,
          flex: 1,
        }}>
          QUARTER
        </Text>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          fontWeight: '600',
          fontSize: 12,
          flex: 1,
          textAlign: 'center',
        }}>
          SAVES
        </Text>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          fontWeight: '600',
          fontSize: 12,
          flex: 1,
          textAlign: 'center',
        }}>
          SHOTS
        </Text>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          fontWeight: '600',
          fontSize: 12,
          flex: 1,
          textAlign: 'center',
        }}>
          GA
        </Text>
      </View>

      {/* Quarter Rows */}
      <View style={{ gap: Spacing.xs }}>
        {quarters.map((quarter, index) => (
          <MotiView
            key={quarter.quarter}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ 
              type: 'timing', 
              duration: 300, 
              delay: 500 + (index * 100) 
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: Spacing.sm,
              paddingHorizontal: Spacing.sm,
              backgroundColor: Colors.surface.elevated2,
              borderRadius: BorderRadius.md,
            }}
          >
            <Text style={{
              ...Typography.styles.body,
              color: Colors.text.primary,
              fontWeight: '600',
              fontSize: 16,
              flex: 1,
            }}>
              {quarter.quarter}
            </Text>
            <Text style={{
              ...Typography.styles.body,
              color: Colors.text.primary,
              fontWeight: '600',
              fontSize: 16,
              flex: 1,
              textAlign: 'center',
            }}>
              {quarter.saves}
            </Text>
            <Text style={{
              ...Typography.styles.body,
              color: Colors.text.primary,
              fontWeight: '600',
              fontSize: 16,
              flex: 1,
              textAlign: 'center',
            }}>
              {quarter.shotsFaced}
            </Text>
            <Text style={{
              ...Typography.styles.body,
              color: Colors.text.primary,
              fontWeight: '600',
              fontSize: 16,
              flex: 1,
              textAlign: 'center',
            }}>
              {quarter.goalsAgainst}
            </Text>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Season Comparison Component
const SeasonComparison = ({ gameData, seasonAverage }: { gameData: any; seasonAverage: any }) => {
  const comparisons = [
    {
      label: 'Save %',
      gameValue: gameData.savePercentage || 0,
      seasonValue: seasonAverage.savePercentage || 0,
      suffix: '%',
    },
    {
      label: 'Saves',
      gameValue: gameData.saves || 0,
      seasonValue: seasonAverage.saves || 0,
      suffix: '',
    },
    {
      label: 'Shots Faced',
      gameValue: gameData.shotsFaced || 0,
      seasonValue: seasonAverage.shotsFaced || 0,
      suffix: '',
    },
  ];

  const getDifference = (gameValue: number, seasonValue: number) => {
    const diff = gameValue - seasonValue;
    return {
      value: Math.abs(diff),
      isPositive: diff >= 0,
      percentage: seasonValue > 0 ? (diff / seasonValue) * 100 : 0,
    };
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 600 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      <Text style={{
        ...Typography.styles.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
      }}>
        vs Season Average
      </Text>

      <View style={{ gap: Spacing.md }}>
        {comparisons.map((comp, index) => {
          const diff = getDifference(comp.gameValue, comp.seasonValue);
          
          return (
            <MotiView
              key={comp.label}
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ 
                type: 'timing', 
                duration: 300, 
                delay: 700 + (index * 100) 
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: Colors.surface.elevated2,
                padding: Spacing.lg,
                borderRadius: BorderRadius.lg,
              }}
            >
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 16,
                lineHeight: 20,
              }}>
                {comp.label}
              </Text>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  ...Typography.styles.body,
                  color: Colors.text.primary,
                  fontWeight: '700',
                  fontSize: 18,
                  lineHeight: 22,
                  marginBottom: 2,
                }}>
                  {comp.gameValue.toFixed(1)}{comp.suffix}
                </Text>
                
                <Text style={{
                  ...Typography.styles.caption,
                  color: diff.isPositive ? Colors.status.success : Colors.status.error,
                  fontSize: 12,
                  fontWeight: '600',
                  lineHeight: 16,
                }}>
                  {diff.isPositive ? '+' : '-'}{diff.value.toFixed(1)}{comp.suffix} vs avg
                </Text>
              </View>
            </MotiView>
          );
        })}
      </View>
    </MotiView>
  );
};

// Main Game Details Screen
export default function GameDetailsScreen() {
  const { gameId } = useLocalSearchParams();
  
  // Mock game data - in real app, fetch based on gameId
  const gameData = {
    id: gameId,
    opponent: 'vs. Brookfield Academy',
    date: 'March 10, 2024',
    location: 'Home Field',
    score: '12-8',
    result: 'W',
    saves: 15,
    shotsFaced: 19,
    goalsAgainst: 4,
    savePercentage: 78.9,
    quarterBreakdown: [
      { quarter: 'Q1', saves: 4, shotsFaced: 6, goalsAgainst: 2 },
      { quarter: 'Q2', saves: 3, shotsFaced: 4, goalsAgainst: 1 },
      { quarter: 'Q3', saves: 5, shotsFaced: 7, goalsAgainst: 2 },
      { quarter: 'Q4', saves: 3, shotsFaced: 2, goalsAgainst: -1 }, // Adjusted to match totals
    ],
  };

  const seasonAverage = {
    savePercentage: 75.2,
    saves: 12.8,
    shotsFaced: 17.1,
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
        {/* Game Header */}
        <GameHeader gameData={gameData} />
        
        {/* Performance Summary */}
        <PerformanceSummary gameData={gameData} />
        
        {/* Quarter Breakdown */}
        <QuarterBreakdown gameData={gameData} />
        
        {/* Season Comparison */}
        <SeasonComparison gameData={gameData} seasonAverage={seasonAverage} />
      </ScrollView>
    </SafeAreaView>
  );
}
