import React from 'react';
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { SavedGame } from '../services/GameDataService';

interface GameDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  game: SavedGame | null;
  onEdit?: (game: SavedGame) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  visible,
  onClose,
  game,
  onEdit,
}) => {
  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (game && onEdit) {
      onEdit(game);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get color based on game result
  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return Colors.brand.secondary;
      case 'loss': return '#EF4444'; // Red
      case 'tie': return Colors.brand.accent;
      default: return Colors.text.secondary;
    }
  };

  // Get background color based on game result
  const getResultBgColor = (result: string) => {
    switch (result) {
      case 'win': return `${Colors.brand.secondary}15`;
      case 'loss': return '#EF444415';
      case 'tie': return `${Colors.brand.accent}15`;
      default: return Colors.surface.elevated2;
    }
  };

  if (!game) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.modalContent}
        >
          {/* Header with Close Button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Game Details</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Game Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.gameInfoRow}>
                <View>
                  <Text style={styles.opponent}>
                    {game.isHome ? 'vs. ' : 'at '}{game.opponent}
                  </Text>
                  <Text style={styles.date}>{formatDate(game.date)}</Text>
                </View>
                <View style={[
                  styles.resultBadge, 
                  { backgroundColor: getResultBgColor(game.result) }
                ]}>
                  <Text style={[
                    styles.resultText, 
                    { color: getResultColor(game.result) }
                  ]}>
                    {game.result.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Game Stats</Text>
              
              <View style={styles.statsGrid}>
                {/* Position-specific stats */}
                {game.position?.toLowerCase() === 'goalie' || game.position?.toLowerCase() === 'goalkeeper' ? (
                  <>
                    <StatItem 
                      label="Saves" 
                      value={game.stats.saves.toString()} 
                      icon="shield-checkmark-outline"
                    />
                    <StatItem 
                      label="Shots Faced" 
                      value={game.stats.shotsFaced.toString()} 
                      icon="flash-outline"
                    />
                    <StatItem 
                      label="Goals Against" 
                      value={game.stats.goalsAgainst.toString()} 
                      icon="shield-outline"
                    />
                    <StatItem 
                      label="Save %" 
                      value={
                        game.stats.shotsFaced > 0 
                          ? ((game.stats.saves / game.stats.shotsFaced) * 100).toFixed(1) + '%'
                          : '0.0%'
                      }
                      icon="stats-chart-outline"
                    />
                    <StatItem 
                      label="Clears" 
                      value={game.stats.clears.toString()} 
                      icon="swap-horizontal-outline"
                    />
                    <StatItem 
                      label="Clear %" 
                      value={
                        game.stats.clearAttempts > 0 
                          ? ((game.stats.clears / game.stats.clearAttempts) * 100).toFixed(1) + '%'
                          : '0.0%'
                      }
                      icon="arrow-forward-outline"
                    />
                  </>
                ) : (
                  <>
                    <StatItem 
                      label="Goals" 
                      value={game.stats.goals.toString()} 
                      icon="football-outline"
                    />
                    <StatItem 
                      label="Assists" 
                      value={game.stats.assists.toString()} 
                      icon="hand-right-outline"
                    />
                    <StatItem 
                      label="Points" 
                      value={(game.stats.goals + game.stats.assists).toString()} 
                      icon="trophy-outline"
                    />
                    <StatItem 
                      label="Shots" 
                      value={game.stats.shots.toString()} 
                      icon="flash-outline"
                    />
                    <StatItem 
                      label="Shooting %" 
                      value={
                        game.stats.shots > 0 
                          ? ((game.stats.goals / game.stats.shots) * 100).toFixed(1) + '%'
                          : '0.0%'
                      }
                      icon="stats-chart-outline"
                    />
                    <StatItem 
                      label="Shot Accuracy" 
                      value={
                        game.stats.shots > 0 
                          ? ((game.stats.shotsOnGoal / game.stats.shots) * 100).toFixed(1) + '%'
                          : '0.0%'
                      }
                      icon="target-outline"
                    />
                    <StatItem 
                      label="Ground Balls" 
                      value={game.stats.groundBalls.toString()} 
                      icon="ellipse-outline"
                    />
                    <StatItem 
                      label="Turnovers" 
                      value={game.stats.turnovers.toString()} 
                      icon="arrow-undo-outline"
                    />
                    
                    {/* Midfield specific stats */}
                    {(game.position?.toLowerCase() === 'midfield' || game.position?.toLowerCase() === 'midfielder') && (
                      game.gender === 'male' ? (
                        <>
                          <StatItem 
                            label="Faceoffs Won" 
                            value={game.stats.faceoffsWon.toString()} 
                            icon="checkmark-circle-outline"
                          />
                          <StatItem 
                            label="Faceoff %" 
                            value={
                              game.stats.faceoffsTaken > 0 
                                ? ((game.stats.faceoffsWon / game.stats.faceoffsTaken) * 100).toFixed(1) + '%'
                                : '0.0%'
                            }
                            icon="pie-chart-outline"
                          />
                        </>
                      ) : (
                        <>
                          <StatItem 
                            label="Draw Controls" 
                            value={game.stats.drawControlsWon.toString()} 
                            icon="checkmark-circle-outline"
                          />
                          <StatItem 
                            label="Draw Control %" 
                            value={
                              game.stats.drawControlsTaken > 0 
                                ? ((game.stats.drawControlsWon / game.stats.drawControlsTaken) * 100).toFixed(1) + '%'
                                : '0.0%'
                            }
                            icon="pie-chart-outline"
                          />
                        </>
                      )
                    )}
                  </>
                )}
              </View>
            </View>

            {/* Game Info Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Game Info</Text>
              
              <View style={styles.infoList}>
                <InfoItem 
                  label="Season Type" 
                  value={game.seasonType === 'school' ? 'High School' : 'Club'} 
                  icon="school-outline"
                />
                <InfoItem 
                  label="Location" 
                  value={game.isHome ? 'Home' : 'Away'} 
                  icon={game.isHome ? 'home-outline' : 'airplane-outline'} 
                />
                <InfoItem 
                  label="Position" 
                  value={game.position || 'Not specified'} 
                  icon="person-outline" 
                />
                <InfoItem 
                  label="Date Logged" 
                  value={new Date(game.timestamp).toLocaleDateString()} 
                  icon="calendar-outline" 
                />
              </View>
            </View>
          </ScrollView>

          {/* Edit Button */}
          {onEdit && (
            <Pressable 
              style={styles.editButton}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Game</Text>
            </Pressable>
          )}
        </MotiView>
      </View>
    </Modal>
  );
};

// Stat Item Component
const StatItem = ({ label, value, icon }: { label: string; value: string; icon: any }) => (
  <View style={styles.statItem}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon} size={18} color={Colors.brand.primary} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Info Item Component
const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: any }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconContainer}>
      <Ionicons name={icon} size={18} color={Colors.text.secondary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.modal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Typography.fonts.display,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    maxHeight: '80%',
  },
  summaryCard: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    margin: Spacing.lg,
    ...Shadows.sm,
  },
  gameInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  opponent: {
    fontSize: 18,
    fontFamily: Typography.fonts.display,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: 14,
    fontFamily: Typography.fonts.body,
    color: Colors.text.secondary,
  },
  resultBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    fontFamily: Typography.fonts.bodyMedium,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Typography.fonts.display,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.brand.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontFamily: Typography.fonts.display,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Typography.fonts.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  infoList: {
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Typography.fonts.body,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Typography.fonts.bodyMedium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    margin: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: Typography.fonts.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});

export default GameDetailsModal;
