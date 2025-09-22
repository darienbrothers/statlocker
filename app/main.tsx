import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Redirect } from 'expo-router';

import { Colors, Spacing, BorderRadius } from '../shared/theme';
import DrawerNavigator from '../components/navigation/DrawerNavigator';

// Header component with hamburger menu
const AppHeader = ({ onMenuPress }: { onMenuPress: () => void }) => {
  return (
    <SafeAreaView edges={['top']} style={{
      backgroundColor: Colors.surface.primary,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border.primary,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        height: 56,
      }}>
        {/* Hamburger Menu Button */}
        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onMenuPress();
          }}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: BorderRadius.lg,
            backgroundColor: pressed ? Colors.interactive.pressed : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          })}
        >
          <Ionicons
            name="menu"
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>

        {/* Logo/Title - could be replaced with actual logo */}
        <View style={{
          flex: 1,
          alignItems: 'center',
        }}>
          <Ionicons
            name="fitness"
            size={28}
            color={Colors.brand.primary}
          />
        </View>

        {/* Right side - could add notifications, profile, etc. */}
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
};

export default function MainScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuPress = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <DrawerNavigator
      isOpen={isDrawerOpen}
      onClose={handleDrawerClose}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: Colors.surface.primary 
      }}>
        <AppHeader onMenuPress={handleMenuPress} />
        {/* Redirect to tabs since we're using Expo Router */}
        <Redirect href="/(tabs)" />
      </View>
    </DrawerNavigator>
  );
}
