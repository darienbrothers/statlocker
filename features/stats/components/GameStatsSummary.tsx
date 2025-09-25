import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { gameDataService, SeasonStats } from '../../../shared/services/GameDataService';

interface GameStatsSummaryProps {
  teamType: 'highschool' | 'club';
}

export const GameStatsSummary: React.FC<GameStatsSummaryProps> = ({ teamType }) => {
  const [seasonStats, setSeasonStats] = useState<SeasonStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const stats = await gameDataService.getSeasonStats();
        setSeasonStats(stats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
    
    // Set up an interval to refresh stats
    const intervalId = setInterval(loadStats, 5000);
    return () => clearInterval(intervalId);
  }, [teamType]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading stats...</Text>
      </View>
    );
  }

  if (!seasonStats || seasonStats.totalGames === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="stats-chart" size={48} color={Colors.text.secondary} />
        <Text style={styles.emptyTitle}>No Games Yet</Text>
        <Text style={styles.emptyText}>
          Log your first game using the + button to see your stats here.
        </Text>
      </View>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600 }}
      style={styles.container}
    >
      {/* Games Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="trophy-outline" size={20} color={Colors.brand.primary} />
          <Text style={styles.sectionTitle}>Games Summary</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.totalGames}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.ties}</Text>
            <Text style={styles.statLabel}>Ties</Text>
          </View>
        </View>
      </View>

      {/* Offensive Stats */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flash-outline" size={20} color={Colors.brand.primary} />
          <Text style={styles.sectionTitle}>Offensive Stats</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.totalGoals}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.totalAssists}</Text>
            <Text style={styles.statLabel}>Assists</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(seasonStats.totalGoals + seasonStats.totalAssists)}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.overallShootingPercentage.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Shooting %</Text>
          </View>
        </View>
      </View>

      {/* Defensive Stats */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-outline" size={20} color={Colors.brand.primary} />
          <Text style={styles.sectionTitle}>Defensive Stats</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.totalSaves}</Text>
            <Text style={styles.statLabel}>Saves</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.overallSavePercentage.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Save %</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seasonStats.totalGoalsAgainst}</Text>
            <Text style={styles.statLabel}>GA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(seasonStats.totalGoalsAgainst / seasonStats.totalGames).toFixed(1)}</Text>
            <Text style={styles.statLabel}>GAA</Text>
          </View>
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  loadingContainer: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Typography.fonts.bodyMedium,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Typography.fonts.display,
    color: Colors.text.primary,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Typography.fonts.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Typography.fonts.bodyMedium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '22%',
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontFamily: Typography.fonts.display,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Typography.fonts.body,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
});

export default GameStatsSummary;
