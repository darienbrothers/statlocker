import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

type MicroStat = {
  label: string;
  value: string;
  onPress?: () => void;
};

type HeroCardProps = {
  mode: 'expanded' | 'collapsed';
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  classYear?: string;
  position?: string;
  sport?: string;
  gender?: string;
  teamType?: 'highschool' | 'club';
  teamName?: string;
  teamLocation?: string;
  trialDaysLeft?: number;
  seasonGoalsTotal?: number;
  seasonGoalsCompleted?: number;
  microStats?: MicroStat[];
  onLogGame: () => void;
  onSecondaryAction?: () => void;
  onTeamToggle?: (type: 'highschool' | 'club') => void;
  onProfileEdit?: () => void;
};

export const HeroCard: React.FC<HeroCardProps> = ({
  mode = 'expanded',
  firstName,
  lastName,
  avatarUrl,
  classYear,
  position,
  sport,
  gender,
  teamType = 'highschool',
  teamName,
  teamLocation,
  trialDaysLeft,
  seasonGoalsTotal = 0,
  seasonGoalsCompleted = 0,
  microStats = [],
  onLogGame,
  onSecondaryAction,
  onTeamToggle,
  onProfileEdit,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async (callback: () => void) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Micro-interaction animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    callback();
  };

  const handleTeamToggle = async (type: 'highschool' | 'club') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTeamToggle?.(type);
  };

  if (mode === 'collapsed') {
    return (
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={{
          backgroundColor: Colors.surface.primary,
          borderRadius: BorderRadius.xl,
          padding: Spacing.lg,
          marginBottom: Spacing.lg,
          ...Shadows.lg,
          overflow: 'hidden',
        }}
      >
        {/* Gradient Wash */}
        <LinearGradient
          colors={[`${Colors.brand.primary}15`, 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
          }}
        />

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Avatar + Team Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            {/* Avatar with Ring */}
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: avatarUrl ? 'transparent' : Colors.surface.elevated2,
              borderWidth: avatarUrl ? 2 : 0,
              borderColor: Colors.brand.primary,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
              {avatarUrl ? (
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
              ) : (
                <Text style={{
                  fontSize: 18,
                  fontFamily: Typography.fonts.display,
                  color: Colors.text.primary,
                  fontWeight: '600',
                }}>
                  {firstName?.charAt(0) || 'A'}
                </Text>
              )}
            </View>

            {/* Team Toggle */}
            {onTeamToggle && (
              <View style={{
                flexDirection: 'row',
                backgroundColor: Colors.surface.elevated2,
                borderRadius: BorderRadius.lg,
                padding: 2,
              }}>
                <Pressable
                  onPress={() => handleTeamToggle('highschool')}
                  style={{
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                    borderRadius: BorderRadius.md,
                    backgroundColor: teamType === 'highschool' ? Colors.brand.primary : 'transparent',
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: teamType === 'highschool' ? '#FFFFFF' : Colors.text.secondary,
                    fontWeight: '600',
                  }}>
                    HS
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleTeamToggle('club')}
                  style={{
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                    borderRadius: BorderRadius.md,
                    backgroundColor: teamType === 'club' ? Colors.brand.primary : 'transparent',
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontFamily: Typography.fonts.bodyMedium,
                    color: teamType === 'club' ? '#FFFFFF' : Colors.text.secondary,
                    fontWeight: '600',
                  }}>
                    Club
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Center: Status Line */}
          <View style={{ flex: 1, paddingHorizontal: Spacing.md }}>
            <Text style={{
              fontSize: 14,
              fontFamily: Typography.fonts.bodyMedium,
              color: Colors.text.primary,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Season goals: {seasonGoalsCompleted}/{seasonGoalsTotal} complete
            </Text>
          </View>

          {/* Right: Log Game Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPress={() => handlePress(onLogGame)}
              style={{
                borderRadius: BorderRadius.lg,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
                style={{
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.xs,
                }}
              >
                <Ionicons name="flash" size={16} color="#FFFFFF" />
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}>
                  Log Game
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </MotiView>
    );
  }

  // Expanded Mode
  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600 }}
      style={{
        backgroundColor: Colors.surface.primary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        ...Shadows.lg,
        overflow: 'hidden',
      }}
    >
      {/* Gradient Wash */}
      <LinearGradient
        colors={[`${Colors.brand.primary}15`, 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
        }}
      />

      {/* Eyebrow Chips */}
      <View style={{
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
        flexWrap: 'wrap',
      }}>
        {classYear && (
          <Pressable
            onPress={() => handlePress(onProfileEdit || (() => {}))}
            style={{
              backgroundColor: Colors.surface.elevated2,
              paddingHorizontal: Spacing.sm,
              paddingVertical: Spacing.xs,
              borderRadius: BorderRadius.md,
            }}
          >
            <Text style={{
              fontSize: 12,
              fontFamily: Typography.fonts.body,
              color: Colors.text.secondary,
              fontWeight: '500',
            }}>
              Class of {classYear}
            </Text>
          </Pressable>
        )}
        {position && (
          <Pressable
            onPress={() => handlePress(onProfileEdit || (() => {}))}
            style={{
              backgroundColor: Colors.surface.elevated2,
              paddingHorizontal: Spacing.sm,
              paddingVertical: Spacing.xs,
              borderRadius: BorderRadius.md,
            }}
          >
            <Text style={{
              fontSize: 12,
              fontFamily: Typography.fonts.body,
              color: Colors.text.secondary,
              fontWeight: '500',
            }}>
              {position}
            </Text>
          </Pressable>
        )}
        {gender && sport && (
          <View style={{
            backgroundColor: Colors.brand.primary,
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.md,
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: Typography.fonts.body,
              color: '#FFFFFF',
              fontWeight: '600',
            }}>
              {gender} {sport}
            </Text>
          </View>
        )}
      </View>

      {/* Main Content Lanes */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.xl,
        marginBottom: Spacing.xl,
      }}>
        {/* Left Lane: Avatar + Badges */}
        <View style={{ alignItems: 'center', gap: Spacing.md }}>
          {/* Avatar with Ring */}
          <View style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: avatarUrl ? 'transparent' : Colors.surface.elevated2,
            borderWidth: avatarUrl ? 3 : 0,
            borderColor: Colors.brand.primary,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            marginBottom: Spacing.sm,
          }}>
            {avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                style={{ width: 84, height: 84, borderRadius: 42 }}
              />
            ) : (
              <Text style={{
                fontSize: 32,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                fontWeight: '600',
              }}>
                {firstName?.charAt(0) || 'A'}
              </Text>
            )}
          </View>

          {/* Trial Badge */}
          {trialDaysLeft && trialDaysLeft > 0 && (
            <View style={{
              backgroundColor: Colors.surface.elevated2,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              borderRadius: BorderRadius.lg,
              borderWidth: 1,
              borderColor: trialDaysLeft <= 5 ? Colors.brand.primary : Colors.border.secondary,
              minWidth: 100,
            }}>
              <Text style={{
                fontSize: 12,
                fontFamily: Typography.fonts.body,
                color: trialDaysLeft <= 5 ? Colors.brand.primary : Colors.text.secondary,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Trial: {trialDaysLeft} days left
              </Text>
            </View>
          )}
        </View>

        {/* Center Lane: Name + Progress */}
        <View style={{ flex: 1, paddingRight: Spacing.md }}>
          {/* Greeting Title */}
          <Text style={{
            fontSize: 28,
            fontFamily: Typography.fonts.display,
            color: Colors.text.primary,
            fontWeight: '700',
            lineHeight: 34,
            marginBottom: Spacing.sm,
          }}>
            Welcome back, {firstName || 'Athlete'} 👋
          </Text>

          {/* Class/Position Line */}
          <Text style={{
            fontSize: 16,
            fontFamily: Typography.fonts.bodyMedium,
            color: Colors.text.secondary,
            marginBottom: Spacing.md,
            lineHeight: 22,
          }}>
            {classYear ? `Class of ${classYear}` : ''}{classYear && position ? ' • ' : ''}{position || ''}
          </Text>

          {/* Micro-Progress Summary */}
          <Text style={{
            fontSize: 14,
            fontFamily: Typography.fonts.body,
            color: Colors.text.secondary,
            lineHeight: 20,
          }}>
            {seasonGoalsTotal} season goals • {seasonGoalsCompleted} completed
          </Text>
        </View>

        {/* Right Lane: Action Buttons */}
        <View style={{ gap: Spacing.md, minWidth: 140 }}>
          {/* Log Game Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPress={() => handlePress(onLogGame)}
              style={{
                borderRadius: BorderRadius.xl,
                overflow: 'hidden',
                ...Shadows.sm,
              }}
            >
              <LinearGradient
                colors={[Colors.brand.primary, `${Colors.brand.primary}DD`]}
                style={{
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.sm,
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="flash" size={20} color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: '#FFFFFF',
                  fontWeight: '600',
                }}>
                  Log Game
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Secondary Action Button */}
          {onSecondaryAction && (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPress={() => handlePress(onSecondaryAction)}
                style={{
                  borderRadius: BorderRadius.xl,
                  borderWidth: 2,
                  borderColor: Colors.brand.primary,
                  backgroundColor: Colors.surface.primary,
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.sm,
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="add-circle-outline" size={18} color={Colors.brand.primary} />
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.brand.primary,
                  fontWeight: '600',
                }}>
                  Add Drill
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Micro Stats Pills */}
      {microStats.length > 0 && (
        <View style={{
          flexDirection: 'row',
          gap: Spacing.md,
          marginBottom: Spacing.xl,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {microStats.map((stat, index) => (
            <Pressable
              key={index}
              onPress={() => stat.onPress && handlePress(stat.onPress)}
              style={{
                backgroundColor: Colors.surface.elevated2,
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.md,
                borderRadius: BorderRadius.xl,
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
                minWidth: 80,
                justifyContent: 'center',
                ...Shadows.xs,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.bodyMedium,
                color: Colors.text.primary,
                fontWeight: '700',
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontSize: 12,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                fontWeight: '500',
              }}>
                {stat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Team Toggle Footer */}
      {onTeamToggle && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: Spacing.xl,
          borderTopWidth: 1,
          borderTopColor: Colors.border.secondary,
          marginTop: Spacing.md,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontFamily: Typography.fonts.bodyMedium,
              color: Colors.text.primary,
              fontWeight: '600',
              marginBottom: Spacing.xs,
            }}>
              {teamName || '--'}
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: Typography.fonts.body,
              color: Colors.text.secondary,
              lineHeight: 18,
            }}>
              {teamLocation || '--'}
            </Text>
          </View>

          {/* Segmented Control */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: Colors.surface.elevated2,
            borderRadius: BorderRadius.xl,
            padding: 4,
            ...Shadows.xs,
          }}>
            <Pressable
              onPress={() => handleTeamToggle('highschool')}
              style={{
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.md,
                borderRadius: BorderRadius.lg,
                backgroundColor: teamType === 'highschool' ? Colors.brand.primary : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: Typography.fonts.bodyMedium,
                color: teamType === 'highschool' ? '#FFFFFF' : Colors.text.secondary,
                fontWeight: '600',
              }}>
                High School
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTeamToggle('club')}
              style={{
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.md,
                borderRadius: BorderRadius.lg,
                backgroundColor: teamType === 'club' ? Colors.brand.primary : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: Typography.fonts.bodyMedium,
                color: teamType === 'club' ? '#FFFFFF' : Colors.text.secondary,
                fontWeight: '600',
              }}>
                Club
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </MotiView>
  );
};

export default HeroCard;
