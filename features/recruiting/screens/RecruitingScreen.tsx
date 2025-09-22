import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../../../shared/theme';

export default function RecruitingScreen() {
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
              name="school" 
              size={48} 
              color={Colors.brand.primary}
              style={{ marginBottom: Spacing.md }}
            />
            <Text style={{
              ...Typography.styles.hero,
              color: Colors.text.primary,
              textAlign: 'center',
            }}>
              Recruiting
            </Text>
          </View>
          
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            textAlign: 'center',
          }}>
            Organize schools into Reach, Realistic, and Safe categories.{'\n'}
            Track your recruiting tasks and progress.
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}
