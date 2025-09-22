import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../../shared/theme';

export default function CongratsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg }}>
        <Text style={{ ...Typography.styles.h1, color: Colors.text.primary, textAlign: 'center' }}>
          Congratulations! 🎉
        </Text>
        <Text style={{ ...Typography.styles.body, color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.md }}>
          Celebration and navigation to dashboard
        </Text>
      </View>
    </SafeAreaView>
  );
}
