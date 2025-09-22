import React from 'react';
import { Redirect } from 'expo-router';

export default function MainScreen() {
  // Redirect to tabs since we're using the new tab layout with FAB
  return <Redirect href="/(tabs)/dashboard" />;
}
