import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../../shared/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg }}>
        <Text style={{ ...Typography.styles.h1, color: Colors.text.primary, textAlign: 'center' }}>
          Welcome to StatLocker
        </Text>
        <Text style={{ ...Typography.styles.body, color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.md }}>
          First onboarding step with app introduction
        </Text>
      </View>
    </SafeAreaView>
  );
}
