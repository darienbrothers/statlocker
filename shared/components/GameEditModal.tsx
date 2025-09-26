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
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { SavedGame } from '../services/GameDataService';
import { GameLoggingModal } from './GameLoggingModal';

interface GameEditModalProps {
  visible: boolean;
  onClose: () => void;
  game: SavedGame | null;
  onSave: (gameData: SavedGame) => void;
}

export const GameEditModal: React.FC<GameEditModalProps> = ({
  visible,
  onClose,
  game,
  onSave,
}) => {
  const [editedGame, setEditedGame] = useState<SavedGame | null>(null);
  const [errors, setErrors] = useState<{
    opponent?: string;
    result?: string;
  }>({});
  const [shakeFields, setShakeFields] = useState<string[]>([]);

  // Initialize form with game data when it changes
  useEffect(() => {
    if (game) {
      setEditedGame({...game});
    }
  }, [game]);

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: {
      opponent?: string;
      result?: string;
    } = {};
    const fieldsToShake: string[] = [];
    
    // Validate opponent
    if (!editedGame?.opponent.trim()) {
      newErrors.opponent = 'Please enter the opponent name';
      fieldsToShake.push('opponent');
    }
    
    // Validate game result
    if (!editedGame?.result) {
      newErrors.result = 'Please select a game result';
      fieldsToShake.push('result');
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
    if (!editedGame || !validateForm()) {
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onSave(editedGame);
    onClose();
  };

  if (!editedGame) return null;

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
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            style={{
              padding: Spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: Colors.border.primary,
            }}
          >
            <View style={{ alignItems: 'flex-start', flex: 1 }}>
              <Text style={{
                fontSize: 24,
                fontFamily: Typography.fonts.display,
                color: Colors.text.primary,
                fontWeight: '700',
              }}>
                Edit Game
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: Typography.fonts.body,
                color: Colors.text.secondary,
                marginTop: Spacing.xs,
              }}>
                Update your game details
              </Text>
            </View>
            
            <Pressable
              onPress={handleClose}
              style={{
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
                    value={editedGame.opponent}
                    onChangeText={(text) => {
                      setEditedGame(prev => prev ? {...prev, opponent: text} : null);
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
                    onPress={() => setEditedGame(prev => prev ? {...prev, seasonType: 'school'} : null)}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: editedGame.seasonType === 'school' ? Colors.brand.primary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: editedGame.seasonType === 'school' ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      School Season
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setEditedGame(prev => prev ? {...prev, seasonType: 'club'} : null)}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: editedGame.seasonType === 'club' ? Colors.brand.primary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: editedGame.seasonType === 'club' ? '#FFFFFF' : Colors.text.secondary,
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
                      onPress={() => setEditedGame(prev => prev ? {...prev, result: 'win'} : null)}
                      style={{
                        flex: 1,
                        paddingVertical: Spacing.md,
                        borderRadius: BorderRadius.md,
                        backgroundColor: editedGame.result === 'win' ? Colors.brand.secondary : 'transparent',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: Typography.fonts.bodyMedium,
                        color: editedGame.result === 'win' ? '#FFFFFF' : Colors.text.secondary,
                        fontWeight: '600',
                      }}>
                        Win
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setEditedGame(prev => prev ? {...prev, result: 'loss'} : null)}
                      style={{
                        flex: 1,
                        paddingVertical: Spacing.md,
                        borderRadius: BorderRadius.md,
                        backgroundColor: editedGame.result === 'loss' ? '#EF4444' : 'transparent',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: Typography.fonts.bodyMedium,
                        color: editedGame.result === 'loss' ? '#FFFFFF' : Colors.text.secondary,
                        fontWeight: '600',
                      }}>
                        Loss
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setEditedGame(prev => prev ? {...prev, result: 'tie'} : null)}
                      style={{
                        flex: 1,
                        paddingVertical: Spacing.md,
                        borderRadius: BorderRadius.md,
                        backgroundColor: editedGame.result === 'tie' ? Colors.brand.accent : 'transparent',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: Typography.fonts.bodyMedium,
                        color: editedGame.result === 'tie' ? '#FFFFFF' : Colors.text.secondary,
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

              {/* Home/Away Toggle */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.secondary,
                  marginBottom: Spacing.sm,
                }}>
                  Location
                </Text>
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: Colors.surface.primary,
                  borderRadius: BorderRadius.lg,
                  padding: 4,
                }}>
                  <Pressable
                    onPress={() => setEditedGame(prev => prev ? {...prev, isHome: true} : null)}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: editedGame.isHome ? Colors.brand.primary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: editedGame.isHome ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      Home
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setEditedGame(prev => prev ? {...prev, isHome: false} : null)}
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.md,
                      backgroundColor: !editedGame.isHome ? Colors.brand.primary : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: Typography.fonts.bodyMedium,
                      color: !editedGame.isHome ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                    }}>
                      Away
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Date Picker */}
              <View style={{ marginBottom: Spacing.lg }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: Colors.text.secondary,
                  marginBottom: Spacing.sm,
                }}>
                  Game Date
                </Text>
                <TextInput
                  value={editedGame.date}
                  onChangeText={(text) => setEditedGame(prev => prev ? {...prev, date: text} : null)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.text.secondary}
                  style={{
                    backgroundColor: Colors.surface.primary,
                    borderRadius: BorderRadius.lg,
                    padding: Spacing.md,
                    fontSize: 16,
                    fontFamily: Typography.fonts.body,
                    color: Colors.text.primary,
                    borderWidth: 1,
                    borderColor: Colors.border.secondary,
                  }}
                />
              </View>
            </MotiView>
          </ScrollView>

          {/* Save Button */}
          <View style={{ padding: Spacing.lg }}>
            <Pressable
              onPress={handleSave}
              style={{
                backgroundColor: Colors.brand.primary,
                borderRadius: BorderRadius.lg,
                padding: Spacing.md,
                alignItems: 'center',
                ...Shadows.sm,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: Typography.fonts.bodyMedium,
                color: '#FFFFFF',
                fontWeight: '600',
              }}>
                Save Changes
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default GameEditModal;
