import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius } from '../../../shared/theme';

export default function StatsScreen() {
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
          <View style={{
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}>
            <Ionicons 
              name="bar-chart" 
              size={48} 
              color={Colors.brand.primary}
              style={{ marginBottom: Spacing.md }}
            />
            <Text style={{
              ...Typography.styles.hero,
              color: Colors.text.primary,
              textAlign: 'center',
            }}>
              Stats
            </Text>
          </View>
          
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            textAlign: 'center',
          }}>
            Performance analytics with filters and charts.{'\n'}
            Track your progress over time.
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}
