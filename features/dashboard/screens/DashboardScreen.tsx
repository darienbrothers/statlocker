import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { Colors, Typography, Spacing } from '../../../shared/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.lg }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text style={{
            ...Typography.styles.hero,
            color: Colors.text.primary,
            textAlign: 'center',
            marginBottom: Spacing.xl,
          }}>
            Dashboard
          </Text>
          
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            textAlign: 'center',
          }}>
            Your performance overview will appear here.{'\n'}
            Track stats, view insights, and monitor progress.
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}
