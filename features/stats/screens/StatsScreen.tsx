import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Text as SvgText, Line as SvgLine, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import { gameDataService, SeasonStats } from '../../../shared/services/GameDataService';
import GameStatsSummary from '../components/GameStatsSummary';

const { width: screenWidth } = Dimensions.get('window');

// Filters Bar Component
const FiltersBar = ({ 
  selectedRange, 
  onRangeChange 
}: { 
  selectedRange: string;
  onRangeChange: (range: string) => void;
}) => {
  const ranges = [
    { id: 'season', label: 'Season' },
    { id: 'last10', label: 'Last 10' },
    { id: 'last5', label: 'Last 5' },
  ];

  const handleRangePress = async (range: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRangeChange(range);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      <Text style={{
        ...Typography.styles.h3,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
        fontWeight: '600',
        lineHeight: 24,
      }}>
        Time Range
      </Text>
      
      <View style={{
        flexDirection: 'row',
        gap: Spacing.sm,
      }}>
        {ranges.map((range) => (
          <Pressable
            key={range.id}
            onPress={() => handleRangePress(range.id)}
            style={{
              flex: 1,
              backgroundColor: selectedRange === range.id ? Colors.brand.primary : Colors.surface.elevated2,
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.sm,
              borderRadius: BorderRadius.lg,
              alignItems: 'center',
            }}
          >
            <Text style={{
              ...Typography.styles.body,
              color: selectedRange === range.id ? '#FFFFFF' : Colors.text.secondary,
              fontWeight: selectedRange === range.id ? '600' : '500',
              fontSize: 14,
              lineHeight: 18,
            }}>
              {range.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </MotiView>
  );
};

// Performance Chart Component
const PerformanceChart = ({ selectedRange }: { selectedRange: string }) => {
  // Mock data based on selected range
  const getChartData = () => {
    const baseData = [
      { x: 1, y: 65.2, game: 'vs. Elite LC' },
      { x: 2, y: 71.8, game: 'at Thunder Bay' },
      { x: 3, y: 68.4, game: 'vs. Metro LC' },
      { x: 4, y: 75.6, game: 'vs. North Shore' },
      { x: 5, y: 78.9, game: 'at Central Valley' },
      { x: 6, y: 82.1, game: 'vs. Brookfield' },
      { x: 7, y: 79.3, game: 'vs. Elite LC' },
      { x: 8, y: 83.7, game: 'at State Prep' },
      { x: 9, y: 81.2, game: 'vs. Academy' },
      { x: 10, y: 85.4, game: 'vs. Thunder Bay' },
    ];

    switch (selectedRange) {
      case 'last5':
        return baseData.slice(-5);
      case 'last10':
        return baseData;
      case 'season':
      default:
        return baseData;
    }
  };

  const data = getChartData();
  const chartWidth = screenWidth - (Spacing.lg * 4);
  const chartHeight = 200;
  const padding = { left: 50, top: 20, right: 20, bottom: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate chart coordinates
  const minY = Math.min(...data.map(d => d.y)) - 5;
  const maxY = Math.max(...data.map(d => d.y)) + 5;
  const yRange = maxY - minY;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * innerWidth;
  const getY = (value: number) => padding.top + ((maxY - value) / yRange) * innerHeight;

  // Create path for area chart
  const pathData = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.y);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Add bottom line to close the area
  const areaPath = `${pathData} L ${getX(data.length - 1)} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500, delay: 200 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      <Text style={{
        fontSize: 28,
        fontFamily: Typography.fonts.display,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        fontWeight: '600',
        lineHeight: 34,
      }}>
        Save Percentage Trend
      </Text>
      
      <Text style={{
        ...Typography.styles.caption,
        color: Colors.text.secondary,
        marginBottom: Spacing.lg,
        fontSize: 14,
        lineHeight: 18,
      }}>
        {selectedRange === 'season' ? 'Full Season' : selectedRange === 'last10' ? 'Last 10 Games' : 'Last 5 Games'}
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={Colors.brand.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={Colors.brand.primary} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          
          {/* Grid lines */}
          {[60, 70, 80, 90].map((value) => {
            const y = getY(value);
            return (
              <SvgLine
                key={value}
                x1={padding.left}
                y1={y}
                x2={padding.left + innerWidth}
                y2={y}
                stroke={Colors.border.secondary}
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Y-axis labels */}
          {[60, 70, 80, 90].map((value) => {
            const y = getY(value);
            return (
              <SvgText
                key={value}
                x={padding.left - 10}
                y={y + 4}
                fontSize="12"
                fill={Colors.text.secondary}
                textAnchor="end"
              >
                {value}%
              </SvgText>
            );
          })}
          
          {/* Area fill */}
          <Path
            d={areaPath}
            fill="url(#areaGradient)"
          />
          
          {/* Line */}
          <Path
            d={pathData}
            fill="none"
            stroke={Colors.brand.primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => (
            <Circle
              key={index}
              cx={getX(index)}
              cy={getY(point.y)}
              r="4"
              fill={Colors.brand.primary}
            />
          ))}
        </Svg>
      </View>
    </MotiView>
  );
};

// Stats Overview Component
const StatsOverview = ({ selectedRange }: { selectedRange: string }) => {
  const getStats = () => {
    const seasonStats = {
      savePercentage: 78.2,
      totalSaves: 142,
      shotsFaced: 181,
      goalsAgainst: 39,
      gamesPlayed: 10,
      avgSavesPerGame: 14.2,
    };

    const last10Stats = seasonStats;
    
    const last5Stats = {
      savePercentage: 82.1,
      totalSaves: 73,
      shotsFaced: 89,
      goalsAgainst: 16,
      gamesPlayed: 5,
      avgSavesPerGame: 14.6,
    };

    switch (selectedRange) {
      case 'last5': return last5Stats;
      case 'last10': return last10Stats;
      case 'season':
      default: return seasonStats;
    }
  };

  const stats = getStats();
  
  const statCards = [
    { label: 'Save %', value: stats.savePercentage.toFixed(1), suffix: '%', trend: '+3.9%' },
    { label: 'Total Saves', value: stats.totalSaves.toString(), suffix: '', trend: '+12' },
    { label: 'Shots Faced', value: stats.shotsFaced.toString(), suffix: '', trend: '+15' },
    { label: 'Goals Against', value: stats.goalsAgainst.toString(), suffix: '', trend: '-3' },
    { label: 'Games Played', value: stats.gamesPlayed.toString(), suffix: '', trend: '' },
    { label: 'Avg Saves/Game', value: stats.avgSavesPerGame.toFixed(1), suffix: '', trend: '+0.4' },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 400 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
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
        Performance Overview
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
              delay: 500 + (index * 100) 
            }}
            style={{
              flex: 1,
              minWidth: '45%',
              backgroundColor: Colors.surface.elevated2,
              padding: Spacing.lg,
              borderRadius: BorderRadius.lg,
              alignItems: 'center',
            }}
          >
            <Text style={{
              ...Typography.styles.h1,
              color: Colors.text.primary,
              fontWeight: '700',
              fontSize: 28,
              lineHeight: 34,
              marginBottom: Spacing.xs,
            }}>
              {stat.value}{stat.suffix}
            </Text>
            
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.secondary,
              fontSize: 12,
              lineHeight: 16,
              textAlign: 'center',
              marginBottom: Spacing.xs,
            }}>
              {stat.label}
            </Text>

            {stat.trend && (
              <Text style={{
                ...Typography.styles.caption,
                color: stat.trend.startsWith('+') ? Colors.status.success : Colors.status.error,
                fontSize: 11,
                fontWeight: '600',
                lineHeight: 14,
              }}>
                {stat.trend}
              </Text>
            )}
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Per Game Breakdown Component
const PerGameBreakdown = ({ selectedRange }: { selectedRange: string }) => {
  const getGameData = () => {
    const allGames = [
      { id: 1, opponent: 'vs. Elite LC', date: 'Mar 1', saves: 12, shotsFaced: 18, goalsAgainst: 6, savePercentage: 66.7, result: 'L' },
      { id: 2, opponent: 'at Thunder Bay', date: 'Mar 3', saves: 15, shotsFaced: 21, goalsAgainst: 6, savePercentage: 71.4, result: 'W' },
      { id: 3, opponent: 'vs. Metro LC', date: 'Mar 5', saves: 13, shotsFaced: 19, goalsAgainst: 6, savePercentage: 68.4, result: 'L' },
      { id: 4, opponent: 'vs. North Shore', date: 'Mar 8', saves: 14, shotsFaced: 18, goalsAgainst: 4, savePercentage: 77.8, result: 'W' },
      { id: 5, opponent: 'at Central Valley', date: 'Mar 10', saves: 15, shotsFaced: 19, goalsAgainst: 4, savePercentage: 78.9, result: 'W' },
      { id: 6, opponent: 'vs. Brookfield', date: 'Mar 12', saves: 18, shotsFaced: 22, goalsAgainst: 4, savePercentage: 81.8, result: 'W' },
      { id: 7, opponent: 'vs. Elite LC', date: 'Mar 15', saves: 16, shotsFaced: 20, goalsAgainst: 4, savePercentage: 80.0, result: 'W' },
      { id: 8, opponent: 'at State Prep', date: 'Mar 17', saves: 19, shotsFaced: 23, goalsAgainst: 4, savePercentage: 82.6, result: 'W' },
      { id: 9, opponent: 'vs. Academy', date: 'Mar 19', saves: 17, shotsFaced: 21, goalsAgainst: 4, savePercentage: 81.0, result: 'W' },
      { id: 10, opponent: 'vs. Thunder Bay', date: 'Mar 22', saves: 23, shotsFaced: 27, goalsAgainst: 4, savePercentage: 85.2, result: 'W' },
    ];

    switch (selectedRange) {
      case 'last5':
        return allGames.slice(-5);
      case 'last10':
        return allGames;
      case 'season':
      default:
        return allGames;
    }
  };

  const games = getGameData();
  
  // Find best and worst performances
  const bestSave = Math.max(...games.map(g => g.savePercentage));
  const worstSave = Math.min(...games.map(g => g.savePercentage));
  const mostSaves = Math.max(...games.map(g => g.saves));
  const mostShots = Math.max(...games.map(g => g.shotsFaced));

  const isHighlight = (game: any, metric: string) => {
    switch (metric) {
      case 'savePercentage':
        return game.savePercentage === bestSave || game.savePercentage === worstSave;
      case 'saves':
        return game.saves === mostSaves;
      case 'shotsFaced':
        return game.shotsFaced === mostShots;
      default:
        return false;
    }
  };

  const getHighlightColor = (game: any, metric: string) => {
    if (metric === 'savePercentage') {
      return game.savePercentage === bestSave ? Colors.status.success : Colors.status.error;
    }
    return Colors.brand.primary;
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 800 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
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
        Game by Game
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
          flex: 2,
        }}>
          OPPONENT
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
          SAVE%
        </Text>
      </View>

      {/* Table Rows */}
      <View style={{ gap: Spacing.xs }}>
        {games.map((game, index) => (
          <MotiView
            key={game.id}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ 
              type: 'timing', 
              duration: 300, 
              delay: 900 + (index * 100) 
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
            {/* Opponent & Date */}
            <View style={{ flex: 2 }}>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '500',
                fontSize: 14,
                lineHeight: 18,
                marginBottom: 2,
              }}>
                {game.opponent}
              </Text>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 11,
                lineHeight: 14,
              }}>
                {game.date} • {game.result}
              </Text>
            </View>

            {/* Saves */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                ...Typography.styles.body,
                color: isHighlight(game, 'saves') ? getHighlightColor(game, 'saves') : Colors.text.primary,
                fontWeight: isHighlight(game, 'saves') ? '700' : '600',
                fontSize: 16,
                lineHeight: 20,
              }}>
                {game.saves}
              </Text>
            </View>

            {/* Shots Faced */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                ...Typography.styles.body,
                color: isHighlight(game, 'shotsFaced') ? getHighlightColor(game, 'shotsFaced') : Colors.text.primary,
                fontWeight: isHighlight(game, 'shotsFaced') ? '700' : '600',
                fontSize: 16,
                lineHeight: 20,
              }}>
                {game.shotsFaced}
              </Text>
            </View>

            {/* Save Percentage */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                ...Typography.styles.body,
                color: isHighlight(game, 'savePercentage') ? getHighlightColor(game, 'savePercentage') : Colors.text.primary,
                fontWeight: isHighlight(game, 'savePercentage') ? '700' : '600',
                fontSize: 16,
                lineHeight: 20,
              }}>
                {game.savePercentage.toFixed(1)}%
              </Text>
            </View>
          </MotiView>
        ))}
      </View>

      {/* Legend */}
      <View style={{
        marginTop: Spacing.lg,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border.secondary,
      }}>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          fontSize: 11,
          lineHeight: 14,
          textAlign: 'center',
        }}>
          Highlighted values show best/worst performances
        </Text>
      </View>
    </MotiView>
  );
};

// Simple Insights Component
const SimpleInsights = ({ selectedRange }: { selectedRange: string }) => {
  const insights = [
    {
      icon: 'trending-up',
      title: 'Save% Trending Up',
      description: `Save% last ${selectedRange === 'last5' ? '5' : selectedRange === 'last10' ? '10' : 'season'} games ↑ 6% vs season avg`,
      color: Colors.status.success,
    },
    {
      icon: 'analytics',
      title: 'Shot Pattern Analysis',
      description: 'High shots against correlates with lower save% - focus on positioning',
      color: Colors.brand.primary,
    },
    {
      icon: 'trophy',
      title: 'Best Performance',
      description: 'Highest save% (85.4%) in last game vs Thunder Bay LC',
      color: Colors.brand.accent,
    },
  ];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 600 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
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
        Insights
      </Text>

      <View style={{ gap: Spacing.md }}>
        {insights.map((insight, index) => (
          <MotiView
            key={insight.title}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ 
              type: 'timing', 
              duration: 400, 
              delay: 700 + (index * 150) 
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              backgroundColor: Colors.surface.elevated2,
              padding: Spacing.md,
              borderRadius: BorderRadius.lg,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: `${insight.color}20`,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: Spacing.md,
            }}>
              <Ionicons 
                name={insight.icon as any} 
                size={20} 
                color={insight.color} 
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 16,
                lineHeight: 20,
                marginBottom: 4,
              }}>
                {insight.title}
              </Text>
              
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 14,
                lineHeight: 18,
              }}>
                {insight.description}
              </Text>
            </View>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
        marginTop: Spacing.xl,
        ...Shadows.card,
      }}
    >
      <Ionicons name="bar-chart-outline" size={64} color={Colors.text.secondary} />
      <Text style={{
        ...Typography.styles.h2,
        color: Colors.text.primary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
        fontWeight: '600',
        textAlign: 'center',
      }}>
        No games logged yet
      </Text>
      <Text style={{
        ...Typography.styles.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
      }}>
        Tap Log Game to get started and see your performance analytics.
      </Text>
    </MotiView>
  );
};

// Main Stats Screen Component
export default function StatsScreen() {
  const [selectedRange, setSelectedRange] = React.useState('season');
  const [hasGames, setHasGames] = React.useState(false);
  const [seasonStats, setSeasonStats] = React.useState<SeasonStats | null>(null);
  
  // Load game data
  React.useEffect(() => {
    const loadGameData = async () => {
      try {
        const stats = await gameDataService.getSeasonStats();
        setSeasonStats(stats);
        setHasGames(stats.totalGames > 0);
      } catch (error) {
        console.error('Failed to load game data:', error);
      }
    };
    
    loadGameData();
    
    // Set up an interval to refresh stats
    const intervalId = setInterval(loadGameData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (!hasGames) {
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
          <EmptyState />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        {/* Filters Bar */}
        <FiltersBar 
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
        
        {/* Game Stats Summary with real data */}
        <GameStatsSummary teamType={selectedRange === 'season' ? 'highschool' : 'club'} />
        
        {hasGames && (
          <>
            {/* Performance Chart */}
            <PerformanceChart selectedRange={selectedRange} />
            
            {/* Stats Overview */}
            <StatsOverview selectedRange={selectedRange} />
            
            {/* Per Game Breakdown */}
            <PerGameBreakdown selectedRange={selectedRange} />
            
            {/* Simple Insights */}
            <SimpleInsights selectedRange={selectedRange} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
