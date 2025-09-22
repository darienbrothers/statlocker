import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../../../shared/theme';

export default function SkillsScreen() {
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
              name="fitness" 
              size={48} 
              color={Colors.brand.primary}
              style={{ marginBottom: Spacing.md }}
            />
            <Text style={{
              ...Typography.styles.hero,
              color: Colors.text.primary,
              textAlign: 'center',
            }}>
              Skills
            </Text>
          </View>
          
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            textAlign: 'center',
          }}>
            Drill library with filters and progress tracking.{'\n'}
            Work toward your weekly skill targets.
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}
