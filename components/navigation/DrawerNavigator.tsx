import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../shared/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DrawerItem {
  id: string;
  title: string;
  icon: string;
  badge?: number;
  onPress: () => void;
  disabled?: boolean;
}

interface DrawerNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ isOpen, onClose, children }) => {
  const overlayOpacity = useSharedValue(0);
  const drawerTranslateX = useSharedValue(-screenWidth * 0.85);

  React.useEffect(() => {
    if (isOpen) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      drawerTranslateX.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 300 });
      drawerTranslateX.value = withTiming(-screenWidth * 0.85, { duration: 300 });
    }
  }, [isOpen]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerTranslateX.value }],
  }));

  const handleOverlayPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const drawerItems: DrawerItem[] = [
    // Main navigation items
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'home',
      onPress: () => {
        console.log('Navigate to Dashboard');
        onClose();
      },
    },
    {
      id: 'stats',
      title: 'Stats & Analytics',
      icon: 'bar-chart',
      onPress: () => {
        console.log('Navigate to Stats');
        onClose();
      },
    },
    {
      id: 'recruiting',
      title: 'Recruiting',
      icon: 'school',
      onPress: () => {
        console.log('Navigate to Recruiting');
        onClose();
      },
    },
    {
      id: 'skills',
      title: 'Skills Training',
      icon: 'fitness',
      onPress: () => {
        console.log('Navigate to Skills');
        onClose();
      },
    },
    // Additional features
    {
      id: 'ai-insights',
      title: 'AI Insights',
      icon: 'bulb',
      badge: 3,
      onPress: () => {
        console.log('Navigate to AI Insights');
        onClose();
      },
      disabled: true, // Unlocked after 3+ games
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: 'calendar',
      onPress: () => {
        console.log('Navigate to Schedule');
        onClose();
      },
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: 'chatbubbles',
      badge: 3,
      onPress: () => {
        console.log('Navigate to Messages');
        onClose();
      },
      disabled: true, // Stubbed for MVP
    },
    // Account section
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person',
      onPress: () => {
        console.log('Navigate to Profile');
        onClose();
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => {
        console.log('Navigate to Settings');
        onClose();
      },
    },
  ];

  const renderDrawerItem = (item: DrawerItem, index: number) => (
    <MotiView
      key={item.id}
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: 'timing',
        duration: 300,
        delay: isOpen ? index * 50 : 0,
      }}
    >
      <Pressable
        onPress={async () => {
          if (!item.disabled) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            item.onPress();
          }
        }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          marginHorizontal: Spacing.md,
          borderRadius: BorderRadius.lg,
          backgroundColor: pressed && !item.disabled 
            ? Colors.interactive.pressed 
            : 'transparent',
          opacity: item.disabled ? 0.5 : 1,
        })}
      >
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: item.disabled 
            ? Colors.surface.elevated2 
            : Colors.brand.primary + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: Spacing.lg,
        }}>
          <Ionicons
            name={item.icon as any}
            size={20}
            color={item.disabled ? Colors.text.disabled : Colors.brand.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{
            ...Typography.styles.body,
            color: item.disabled ? Colors.text.disabled : Colors.text.primary,
            fontWeight: '500',
          }}>
            {item.title}
          </Text>
        </View>

        {item.badge && item.badge > 0 && (
          <View style={{
            backgroundColor: Colors.semantic.danger,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 6,
          }}>
            <Text style={{
              ...Typography.styles.caption,
              color: Colors.text.inverse,
              fontSize: 11,
              fontWeight: '600',
            }}>
              {item.badge > 99 ? '99+' : item.badge}
            </Text>
          </View>
        )}

        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.text.tertiary}
          style={{ marginLeft: Spacing.sm }}
        />
      </Pressable>
    </MotiView>
  );

  return (
    <View style={{ flex: 1 }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <Animated.View style={[
              overlayStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: Colors.surface.overlay,
                zIndex: 998,
              }
            ]}>
              <Pressable
                style={{ flex: 1 }}
                onPress={handleOverlayPress}
              />
            </Animated.View>

            {/* Drawer */}
            <Animated.View style={[
              drawerStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: screenWidth * 0.85,
                zIndex: 999,
              }
            ]}>
              <LinearGradient
                colors={[Colors.surface.elevated, Colors.surface.elevated2]}
                style={{ flex: 1 }}
              >
                <SafeAreaView style={{ flex: 1 }}>
                  {/* Header */}
                  <View style={{
                    paddingHorizontal: Spacing.xl,
                    paddingVertical: Spacing['2xl'],
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.border.secondary,
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <View>
                        <Text style={{
                          ...Typography.styles.h2,
                          color: Colors.text.primary,
                        }}>
                          StatLocker
                        </Text>
                        <Text style={{
                          ...Typography.styles.bodySmall,
                          color: Colors.text.secondary,
                          marginTop: 2,
                        }}>
                          Athlete Dashboard
                        </Text>
                      </View>

                      <Pressable
                        onPress={handleOverlayPress}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: Colors.surface.elevated2,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color={Colors.text.secondary}
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* Menu Items */}
                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                      paddingVertical: Spacing.xl,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {drawerItems.map((item, index) => renderDrawerItem(item, index))}
                  </ScrollView>

                  {/* Footer */}
                  <View style={{
                    paddingHorizontal: Spacing.xl,
                    paddingVertical: Spacing.lg,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border.secondary,
                  }}>
                    <Text style={{
                      ...Typography.styles.caption,
                      color: Colors.text.tertiary,
                      textAlign: 'center',
                    }}>
                      StatLocker v1.0.0
                    </Text>
                  </View>
                </SafeAreaView>
              </LinearGradient>
            </Animated.View>
          </>
        )}
      </AnimatePresence>
    </View>
  );
};

export default DrawerNavigator;
