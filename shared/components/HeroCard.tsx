import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

type StatCard = {
  icon: string;
  value: string;
  label: string;
  onPress?: () => void;
};

type HeroCardProps = {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  classYear?: string;
  position?: string;
  sport?: string;
  gender?: string;
  teamType?: 'highschool' | 'club';
  highSchool?: {
    name?: string;
    location?: string;
    jerseyNumber?: string;
  };
  club?: {
    name?: string;
    location?: string;
    jerseyNumber?: string;
  };
  stats?: StatCard[];
  onTeamToggle?: (type: 'highschool' | 'club') => void;
  onProfileEdit?: () => void;
};

export const HeroCard: React.FC<HeroCardProps> = ({
  firstName,
  lastName,
  avatarUrl,
  classYear,
  position,
  sport,
  gender,
  teamType = 'highschool',
  highSchool,
  club,
  stats = [],
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

  const currentTeam = teamType === 'highschool' ? highSchool : club;
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
      {/* Welcome Message */}
      <Text style={{
        fontSize: 24,
        fontFamily: Typography.fonts.display,
        color: Colors.brand.primary,
        fontWeight: '600',
        marginBottom: Spacing.xl,
      }}>
        Welcome Back, {firstName}!
      </Text>

      {/* Profile Section */}
      <View style={{ alignItems: 'center', marginBottom: Spacing.xl }}>
        {/* Avatar */}
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: avatarUrl ? 'transparent' : Colors.brand.primary,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          marginBottom: Spacing.md,
        }}>
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <Text style={{
              fontSize: 36,
              fontFamily: Typography.fonts.display,
              color: '#FFFFFF',
              fontWeight: '600',
            }}>
              {firstName?.charAt(0) || 'N'}
            </Text>
          )}
        </View>

        {/* Full Name */}
        <Text style={{
          fontSize: 32,
          fontFamily: Typography.fonts.display,
          color: Colors.text.primary,
          fontWeight: '700',
          marginBottom: Spacing.sm,
        }}>
          {firstName} {lastName}
        </Text>

        {/* Class Year */}
        <Text style={{
          fontSize: 16,
          fontFamily: Typography.fonts.body,
          color: Colors.text.secondary,
          marginBottom: Spacing.lg,
        }}>
          Class of {classYear}
        </Text>

        {/* Position Pill and Team Toggle */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          marginBottom: Spacing.xl,
        }}>
          {/* Position Pill */}
          {position && (
            <View style={{
              backgroundColor: Colors.brand.primary,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              borderRadius: BorderRadius.lg,
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: Typography.fonts.bodyMedium,
                color: '#FFFFFF',
                fontWeight: '600',
              }}>
                {position}
              </Text>
            </View>
          )}

          {/* Divider */}
          <Text style={{
            fontSize: 16,
            color: Colors.text.secondary,
            fontWeight: '300',
          }}>
            |
          </Text>

          {/* Team Toggle */}
          {onTeamToggle && (
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
          )}
        </View>
      </View>

      {/* Team Info */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl,
        marginBottom: Spacing.xl,
      }}>
        {/* High School Info */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
        }}>
          <Ionicons name="school-outline" size={20} color={Colors.text.secondary} />
          <Text style={{
            fontSize: 14,
            fontFamily: Typography.fonts.bodyMedium,
            color: Colors.text.primary,
            fontWeight: '600',
          }}>
            {currentTeam?.name || 'Team Name'}
          </Text>
        </View>

        {/* Club Info */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
        }}>
          <Ionicons name="people-outline" size={20} color={Colors.text.secondary} />
          <Text style={{
            fontSize: 14,
            fontFamily: Typography.fonts.bodyMedium,
            color: Colors.text.primary,
            fontWeight: '600',
          }}>
            {currentTeam?.location || 'Location'}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{
        flexDirection: 'row',
        gap: Spacing.md,
        justifyContent: 'center',
      }}>
        {stats.map((stat, index) => (
          <Pressable
            key={index}
            onPress={() => stat.onPress && handlePress(stat.onPress)}
            style={{
              flex: 1,
              maxWidth: 120,
              backgroundColor: Colors.surface.elevated,
              borderRadius: BorderRadius.lg,
              padding: Spacing.lg,
              alignItems: 'center',
              ...Shadows.sm,
              minHeight: 90,
            }}
          >
            <Ionicons name={stat.icon as any} size={24} color={Colors.brand.primary} />
            <Text style={{
              fontSize: 24,
              fontFamily: Typography.fonts.display,
              color: Colors.text.primary,
              fontWeight: '700',
              marginTop: Spacing.sm,
              marginBottom: Spacing.xs,
            }}>
              {stat.value}
            </Text>
            <Text style={{
              fontSize: 12,
              fontFamily: Typography.fonts.body,
              color: Colors.text.secondary,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              {stat.label}
            </Text>
          </Pressable>
        ))}
      </View>

    </MotiView>
  );
};

export default HeroCard;
