import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../../shared/theme';

interface OnboardingProgressBarProps {
  currentSection: number; // 0 = About You, 1 = Your Game, 2 = Recruiting, 3 = Finish
}

export default function OnboardingProgressBar({ currentSection }: OnboardingProgressBarProps) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {/* Section 1: About You */}
        <View style={[
          styles.progressSegment, 
          currentSection >= 0 ? styles.progressSegmentActive : styles.progressSegmentInactive
        ]} />
        
        {/* Section 2: Your Game */}
        <View style={[
          styles.progressSegment, 
          currentSection >= 1 ? styles.progressSegmentActive : styles.progressSegmentInactive
        ]} />
        
        {/* Section 3: Recruiting */}
        <View style={[
          styles.progressSegment, 
          currentSection >= 2 ? styles.progressSegmentActive : styles.progressSegmentInactive
        ]} />
        
        {/* Section 4: Finish */}
        <View style={[
          styles.progressSegment, 
          currentSection >= 3 ? styles.progressSegmentActive : styles.progressSegmentInactive
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8, // Space between segments
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: Colors.brand.primary, // Green for active/completed sections
  },
  progressSegmentInactive: {
    backgroundColor: '#E5E5E5', // Light gray for inactive sections on white background
  },
});
