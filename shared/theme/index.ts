// Main theme export - Premium design system for StatLocker
import { Colors } from './colors';
import { Typography } from './typography';
import { Spacing, ResponsiveSpacing } from './spacing';
import { Shadows } from './shadows';

// Border radius system
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
} as const;

// Animation timing
export const Animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  
  easing: {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    spring: [0.68, -0.55, 0.265, 1.55],
  },
} as const;

// Z-index system
export const ZIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
  max: 999,
} as const;

// Complete theme object
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  responsiveSpacing: ResponsiveSpacing,
  shadows: Shadows,
  borderRadius: BorderRadius,
  animation: Animation,
  zIndex: ZIndex,
} as const;

// Export individual modules
export { Colors, Typography, Spacing, ResponsiveSpacing, Shadows };

// Type definitions
export type ThemeColors = typeof Colors;
export type ThemeTypography = typeof Typography;
export type ThemeSpacing = typeof Spacing;
export type ThemeShadows = typeof Shadows;
export type ThemeBorderRadius = typeof BorderRadius;
export type ThemeAnimation = typeof Animation;
export type ThemeZIndex = typeof ZIndex;
export type Theme = typeof Theme;

export default Theme;
