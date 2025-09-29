import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.completedCircle,
                  isCurrent && styles.currentCircle,
                  isUpcoming && styles.upcomingCircle,
                ]}
              >
                {isCompleted && (
                  <View style={styles.checkmark} />
                )}
              </View>

              {/* Connecting Line (except for last step) */}
              {index < totalSteps - 1 && (
                <View
                  style={[
                    styles.connectingLine,
                    isCompleted && styles.completedLine,
                    step === currentStep - 1 && styles.currentLine,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  stepCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  completedCircle: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  currentCircle: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  upcomingCircle: {
    backgroundColor: 'transparent',
    borderColor: Colors.text.tertiary,
  },
  checkmark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text.inverse,
  },
  connectingLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.text.tertiary,
    marginHorizontal: 8,
  },
  completedLine: {
    backgroundColor: Colors.brand.primary,
  },
  currentLine: {
    backgroundColor: Colors.brand.primary,
  },
});
