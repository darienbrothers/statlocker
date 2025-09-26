import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  ScrollView, 
  Pressable, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

interface GameStats {
  // Common stats
  goals: string;
  assists: string;
  shots: string;
  shotsOnGoal: string;
  groundBalls: string;
  turnovers: string;
  causedTurnovers: string;
  penalties: string;
  
  // Goalie specific
  shotsFaced: string;
  saves: string;
  goalsAgainst: string;
  clears: string;
  clearAttempts: string;
  
  // Midfield specific
  faceoffsWon: string;
  faceoffsTaken: string;
  drawControlsWon: string;
  drawControlsTaken: string;
}

interface GameDetails {
  opponent: string;
  date: string;
  isHome: boolean;
  seasonType: 'school' | 'club';
  result: 'win' | 'loss' | 'tie' | '';
}

interface GameLoggingModalProps {
  visible: boolean;
  onClose: () => void;
  userPosition?: string;
  userGender?: string;
  onSave: (gameData: any) => void;
}

export const GameLoggingModal: React.FC<GameLoggingModalProps> = ({
  visible,
  onClose,
  userPosition = 'attack',
  userGender = 'male',
  onSave,
}) => {
  const [gameDetails, setGameDetails] = useState<GameDetails>({
    opponent: '',
    date: new Date().toISOString().split('T')[0],
    isHome: true,
    seasonType: 'school',
    result: '',
  });

  // Validation state
  const [errors, setErrors] = useState<{
    opponent?: string;
    result?: string;
    stats?: { [key: string]: string };
  }>({});
  const [shakeFields, setShakeFields] = useState<string[]>([]);

  const [stats, setStats] = useState<GameStats>({
    goals: '',
    assists: '',
    shots: '',
    shotsOnGoal: '',
    groundBalls: '',
    turnovers: '',
    causedTurnovers: '',
    penalties: '',
    shotsFaced: '',
    saves: '',
    goalsAgainst: '',
    clears: '',
    clearAttempts: '',
    faceoffsWon: '',
    faceoffsTaken: '',
    drawControlsWon: '',
    drawControlsTaken: '',
  });

  const [calculatedStats, setCalculatedStats] = useState({
    points: 0,
    shootingPercentage: 0,
    shotAccuracy: 0,
    savePercentage: 0,
    faceoffPercentage: 0,
    drawControlPercentage: 0,
    clearPercentage: 0,
  });

  // Calculate derived stats in real-time
  useEffect(() => {
    const goals = parseInt(stats.goals) || 0;
    const assists = parseInt(stats.assists) || 0;
    const shots = parseInt(stats.shots) || 0;
    const shotsOnGoal = parseInt(stats.shotsOnGoal) || 0;
    const saves = parseInt(stats.saves) || 0;
    const shotsFaced = parseInt(stats.shotsFaced) || 0;
    const faceoffsWon = parseInt(stats.faceoffsWon) || 0;
    const faceoffsTaken = parseInt(stats.faceoffsTaken) || 0;
    const drawControlsWon = parseInt(stats.drawControlsWon) || 0;
    const drawControlsTaken = parseInt(stats.drawControlsTaken) || 0;
    const clears = parseInt(stats.clears) || 0;
    const clearAttempts = parseInt(stats.clearAttempts) || 0;

    setCalculatedStats({
      points: goals + assists,
      shootingPercentage: shots > 0 ? (goals / shots) * 100 : 0,
      shotAccuracy: shots > 0 ? (shotsOnGoal / shots) * 100 : 0,
      savePercentage: shotsFaced > 0 ? (saves / shotsFaced) * 100 : 0,
      faceoffPercentage: faceoffsTaken > 0 ? (faceoffsWon / faceoffsTaken) * 100 : 0,
      drawControlPercentage: drawControlsTaken > 0 ? (drawControlsWon / drawControlsTaken) * 100 : 0,
      clearPercentage: clearAttempts > 0 ? (clears / clearAttempts) * 100 : 0,
    });
  }, [stats]);

  const getPositionIcon = () => {
    switch (userPosition?.toLowerCase()) {
      case 'goalie':
      case 'goalkeeper':
        return 'shield-checkmark-outline';
      case 'attack':
        return 'flash-outline';
      case 'defense':
        return 'shield-outline';
      case 'midfield':
      case 'midfielder':
        return 'swap-horizontal-outline';
      default:
        return 'american-football-outline';
    }
  };

  const getStatsFields = () => {
    const position = userPosition?.toLowerCase();
    
    if (position === 'goalie' || position === 'goalkeeper') {
      return [
        { key: 'shotsFaced', label: 'Shots Faced', required: true },
        { key: 'saves', label: 'Saves', required: true },
        { key: 'goalsAgainst', label: 'Goals Against', required: true },
        { key: 'groundBalls', label: 'Ground Balls', required: false },
        { key: 'clears', label: 'Clears', required: false },
        { key: 'clearAttempts', label: 'Clear Attempts', required: false },
      ];
    }
    
    if (position === 'midfield' || position === 'midfielder') {
      const baseFields = [
        { key: 'goals', label: 'Goals', required: false },
        { key: 'assists', label: 'Assists', required: false },
        { key: 'shots', label: 'Shots', required: false },
        { key: 'shotsOnGoal', label: 'Shots on Goal', required: false },
        { key: 'groundBalls', label: 'Ground Balls', required: false },
        { key: 'turnovers', label: 'Turnovers', required: false },
        { key: 'causedTurnovers', label: 'Caused Turnovers', required: false },
      ];
      
      // Add gender-specific fields
      if (userGender === 'male') {
        baseFields.push(
          { key: 'faceoffsWon', label: 'Face-offs Won', required: false },
          { key: 'faceoffsTaken', label: 'Face-offs Taken', required: false }
        );
      } else {
        baseFields.push(
          { key: 'drawControlsWon', label: 'Draw Controls Won', required: false },
          { key: 'drawControlsTaken', label: 'Draw Controls Taken', required: false }
        );
      }
      
      return baseFields;
    }
    
    // Attack and Defense
    return [
      { key: 'goals', label: 'Goals', required: false },
      { key: 'assists', label: 'Assists', required: false },
      { key: 'shots', label: 'Shots', required: false },
      { key: 'shotsOnGoal', label: 'Shots on Goal', required: false },
      { key: 'groundBalls', label: 'Ground Balls', required: false },
      { key: 'turnovers', label: 'Turnovers', required: false },
      { key: 'causedTurnovers', label: 'Caused Turnovers', required: false },
    ];
  };

  const getCalculatedStatsDisplay = () => {
    const position = userPosition?.toLowerCase();
    
    if (position === 'goalie' || position === 'goalkeeper') {
      return [
        { label: 'Save %', value: calculatedStats.savePercentage.toFixed(1) + '%', color: Colors.brand.primary },
        { label: 'Clear %', value: calculatedStats.clearPercentage.toFixed(1) + '%', color: Colors.brand.secondary },
      ];
    }
    
    const baseStats = [
      { label: 'Total Points', value: calculatedStats.points.toString(), color: Colors.brand.primary },
      { label: 'Shooting %', value: calculatedStats.shootingPercentage.toFixed(1) + '%', color: Colors.brand.secondary },
      { label: 'Shot Accuracy %', value: calculatedStats.shotAccuracy.toFixed(1) + '%', color: Colors.brand.accent },
    ];
    
    if (position === 'midfield' || position === 'midfielder') {
      if (userGender === 'male') {
        baseStats.push({ label: 'Face-off %', value: calculatedStats.faceoffPercentage.toFixed(1) + '%', color: Colors.brand.primary });
      } else {
        baseStats.push({ label: 'Draw Control %', value: calculatedStats.drawControlPercentage.toFixed(1) + '%', color: Colors.brand.primary });
      }
    }
    
    return baseStats;
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: {
      opponent?: string;
      result?: string;
      stats?: { [key: string]: string };
    } = {};
    const fieldsToShake: string[] = [];
    
    // Validate opponent
    if (!gameDetails.opponent.trim()) {
      newErrors.opponent = 'Please enter the opponent name';
      fieldsToShake.push('opponent');
    }
    
    // Validate game result
    if (!gameDetails.result) {
      newErrors.result = 'Please select a game result';
      fieldsToShake.push('result');
    }
    
    // Validate required stats based on position
    const statErrors: { [key: string]: string } = {};
    
    if (userPosition?.toLowerCase() === 'goalie' || userPosition?.toLowerCase() === 'goalkeeper') {
      // Goalie validation
      if (!stats.shotsFaced) {
        statErrors.shotsFaced = 'Required';
        fieldsToShake.push('shotsFaced');
      }
      if (!stats.saves) {
        statErrors.saves = 'Required';
        fieldsToShake.push('saves');
      }
    } else {
      // Field player validation
      if (!stats.shots) {
        statErrors.shots = 'Required';
        fieldsToShake.push('shots');
      }
    }
    
    if (Object.keys(statErrors).length > 0) {
      newErrors.stats = statErrors;
    }
    
    // Update error state
    setErrors(newErrors);
    
    // Trigger shake animation for invalid fields
    if (fieldsToShake.length > 0) {
      setShakeFields(fieldsToShake);
      setTimeout(() => setShakeFields([]), 500); // Reset shake after animation
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    const gameData = {
      ...gameDetails,
      stats,
      calculatedStats,
      position: userPosition,
      gender: userGender,
      timestamp: new Date().toISOString(),
    };
    
    onSave(gameData);
    onClose();
  };

  const updateStat = (key: keyof GameStats, value: string) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: Spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: Colors.border.secondary,
            }}
          >
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: Colors.brand.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Spacing.sm,
              }}>
                <Ionicons name="flash" size={24} color={Colors.brand.primary} />
              </View>
              <Text style={{
                fontSize: 24,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                fontWeight: '700',
              }}>
                Log a New Game
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                textAlign: 'center',
                marginTop: Spacing.xs,
              }}>
                Enter your game details and stats to track your performance
              </Text>
            </View>
            
            <Pressable
              onPress={handleClose}
              style={{
                position: 'absolute',
                right: Spacing.lg,
                top: Spacing.lg,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: Colors.surface.elevated2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={Colors.text.secondary} />
            </Pressable>
          </MotiView>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: Spacing.lg }}
            showsVerticalScrollIndicator={false}
          >
            {/* Game Details Section */}
            <MotiView
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 200 }}
              style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: BorderRadius.xl,
                padding: Spacing.lg,
                marginBottom: Spacing.lg,
                ...Shadows.sm,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.lg,
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.brand.primaryTint + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: Spacing.md,
                }}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.brand.primaryTint} />
                </View>
                <View>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    fontWeight: '600',
                  }}>
                    Game Details
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.secondary,
                  }}>
                    Basic information about the game
                  </Text>
                </View>
              </View>

              {/* Opponent */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: errors.opponent ? Colors.status.error : Colors.text.secondary,
                  marginBottom: Spacing.sm,
                }}>
                  Opponent *
                </Text>
                <MotiView
                  animate={{
                    translateX: shakeFields.includes('opponent') ? [-10, 10, -10, 10, -5, 5, -2, 2, 0] : 0
                  }}
                  transition={{
                    type: 'timing',
                    duration: 400,
                  }}
                >
                  <TextInput
                    value={gameDetails.opponent}
                    onChangeText={(text) => {
                      setGameDetails(prev => ({ ...prev, opponent: text }));
                      if (errors.opponent) {
                        setErrors(prev => ({ ...prev, opponent: undefined }));
                      }
                    }}
                    placeholder="Enter opponent name"
                    placeholderTextColor={Colors.text.secondary}
                    style={{
                      backgroundColor: Colors.surface.primary,
                      borderRadius: BorderRadius.lg,
                      padding: Spacing.md,
                      fontSize: 16,
                      fontFamily: Typography.fonts.body,
                      color: Colors.text.primary,
                      borderWidth: 1,
                      borderColor: errors.opponent ? Colors.status.error : Colors.border.secondary,
                    }}
                  />
                </MotiView>
                {errors.opponent && (
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.status.error,
                    marginTop: 4,
                    marginLeft: 4,
                  }}>
                    {errors.opponent}
                  </Text>
                )}
              </View>

              {/* Season Type Toggle */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.secondary,
                  marginBottom: Spacing.sm,
                }}>
                  Season Type
                </Text>
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: Colors.surface.primary,
                  borderRadius: BorderRadius.lg,
                  padding: 4,
                }}>
                  <Pressable
                    onPress={() => setGameDetails(prev => ({ ...prev, seasonType: 'school' }))}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: gameDetails.seasonType === 'school' ? Colors.brand.primary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: gameDetails.seasonType === 'school' ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      School Season
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setGameDetails(prev => ({ ...prev, seasonType: 'club' }))}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: gameDetails.seasonType === 'club' ? Colors.brand.primary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: gameDetails.seasonType === 'club' ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      Club Season
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Game Result */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: errors.result ? Colors.status.error : Colors.text.secondary,
                  marginBottom: Spacing.sm,
                }}>
                  Game Result *
                </Text>
                <MotiView
                  animate={{
                    translateX: shakeFields.includes('result') ? [-10, 10, -10, 10, -5, 5, -2, 2, 0] : 0
                  }}
                  transition={{
                    type: 'timing',
                    duration: 400,
                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.surface.primary,
                    borderRadius: BorderRadius.lg,
                    padding: 4,
                    gap: 4,
                    borderWidth: errors.result ? 1 : 0,
                    borderColor: errors.result ? Colors.status.error : 'transparent',
                  }}>
                    <Pressable
                    onPress={() => setGameDetails(prev => ({ ...prev, result: 'win' }))}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: gameDetails.result === 'win' ? Colors.brand.secondary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: gameDetails.result === 'win' ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      Win
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setGameDetails(prev => ({ ...prev, result: 'loss' }))}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: gameDetails.result === 'loss' ? '#EF4444' : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: gameDetails.result === 'loss' ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      Loss
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setGameDetails(prev => ({ ...prev, result: 'tie' }))}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: gameDetails.result === 'tie' ? Colors.brand.accent : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: gameDetails.result === 'tie' ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      Tie
                    </Text>
                  </Pressable>
                </View>
                </MotiView>
                {errors.result && (
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.status.error,
                    marginTop: 4,
                    marginLeft: 4,
                  }}>
                    {errors.result}
                  </Text>
                )}
              </View>

            {/* Stats Section */}
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 400 }}
              style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: BorderRadius.xl,
                padding: Spacing.lg,
                marginBottom: Spacing.lg,
                ...Shadows.sm,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.lg,
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.brand.secondary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: Spacing.md,
                }}>
                  <Ionicons name={getPositionIcon()} size={18} color={Colors.brand.secondary} />
                </View>
                <View>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    fontWeight: '600',
                  }}>
                    Your Stats ({userPosition})
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.secondary,
                  }}>
                    Enter your performance statistics for this game
                  </Text>
                </View>
              </View>

              {/* Dynamic Stats Fields */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: Spacing.md,
              }}>
                {getStatsFields().map((field, index) => (
                  <MotiView
                    key={field.key}
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 600 + (index * 100) }}
                    style={{
                      width: '48%',
                      marginBottom: Spacing.md,
                    }}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: Colors.text.secondary,
                      marginBottom: Spacing.xs,
                    }}>
                      {field.label} {field.required && '*'}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.surface.primary,
                      borderRadius: BorderRadius.lg,
                      borderWidth: 1,
                      borderColor: Colors.border.secondary,
                      overflow: 'hidden',
                    }}>
                      {/* Decrement Button */}
                      <Pressable
                        onPress={() => {
                          const currentValue = parseInt(stats[field.key as keyof GameStats]) || 0;
                          if (currentValue > 0) {
                            updateStat(field.key as keyof GameStats, (currentValue - 1).toString());
                          }
                        }}
                        style={{
                          width: 36,
                          height: 44,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.surface.elevated2,
                        }}
                      >
                        <Ionicons name="remove" size={16} color={Colors.text.secondary} />
                      </Pressable>

                      {/* Value Input */}
                      <TextInput
                        value={stats[field.key as keyof GameStats]}
                        onChangeText={(text) => updateStat(field.key as keyof GameStats, text)}
                        placeholder="0"
                        placeholderTextColor={Colors.text.secondary}
                        keyboardType="numeric"
                        style={{
                          flex: 1,
                          padding: Spacing.md,
                          fontSize: 16,
                          fontFamily: Typography.fonts.bodyMedium,
                          color: Colors.text.primary,
                          textAlign: 'center',
                          fontWeight: '600',
                        }}
                      />

                      {/* Increment Button */}
                      <Pressable
                        onPress={() => {
                          const currentValue = parseInt(stats[field.key as keyof GameStats]) || 0;
                          updateStat(field.key as keyof GameStats, (currentValue + 1).toString());
                        }}
                        style={{
                          width: 36,
                          height: 44,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.brand.primary,
                        }}
                      >
                        <Ionicons name="add" size={16} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </MotiView>
                ))}
              </View>
            </MotiView>

            {/* Live Calculations */}
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 800 }}
              style={{
                backgroundColor: Colors.surface.elevated,
                borderRadius: BorderRadius.xl,
                padding: Spacing.lg,
                marginBottom: Spacing.xl,
                ...Shadows.sm,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.lg,
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.brand.primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: Spacing.md,
                }}>
                  <Ionicons name="calculator-outline" size={18} color={Colors.brand.primary} />
                </View>
                <View>
                  <Text style={{
                    fontSize: 18,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: Colors.text.primary,
                    fontWeight: '600',
                  }}>
                    Live Calculations
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.secondary,
                  }}>
                    Auto-calculated stats as you type
                  </Text>
                </View>
              </View>

              {getCalculatedStatsDisplay().map((stat, index) => (
                <MotiView
                  key={stat.label}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: 1000 + (index * 100) }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: Spacing.sm,
                    borderBottomWidth: index < getCalculatedStatsDisplay().length - 1 ? 1 : 0,
                    borderBottomColor: Colors.border.secondary,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="trending-up" size={16} color={stat.color} />
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.body,
                      color: Colors.text.secondary,
                      marginLeft: Spacing.sm,
                    }}>
                      {stat.label}
                    </Text>
                  </View>
                  <MotiText
                    from={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    style={{
                      fontSize: 18,
                      fontFamily: Typography.fonts.display,
                      color: stat.color,
                      fontWeight: '700',
                    }}
                  >
                    {stat.value}
                  </MotiText>
                </MotiView>
              ))}
            </MotiView>
          </ScrollView>

          {/* Save Button */}
          <MotiView
            from={{ opacity: 0, translateY: 100 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 1200 }}
            style={{
              padding: Spacing.lg,
              paddingBottom: Spacing.xl,
            }}
          >
            <Pressable
              onPress={handleSave}
              style={{
                borderRadius: BorderRadius.xl,
                overflow: 'hidden',
                ...Shadows.lg,
              }}
            >
              <LinearGradient
                colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
                style={{
                  paddingVertical: Spacing.lg,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={{
                  fontSize: 18,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: '#FFFFFF',
                  fontWeight: '600',
                  marginLeft: Spacing.sm,
                }}>
                  Save Game
                </Text>
              </LinearGradient>
            </Pressable>
          </MotiView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default GameLoggingModal;
