import { Platform } from 'react-native';

// Font families
export const FONT_FAMILIES = {
  // Primary fonts (existing)
  heading: Platform.OS === 'ios' ? 'Anton-Regular' : 'Anton-Regular',
  body:
    Platform.OS === 'ios'
      ? 'PlusJakartaSans-Regular'
      : 'PlusJakartaSans-Regular',
  medium:
    Platform.OS === 'ios' ? 'PlusJakartaSans-Medium' : 'PlusJakartaSans-Medium',

  // Semantic aliases
  display: Platform.OS === 'ios' ? 'Anton-Regular' : 'Anton-Regular',
  title:
    Platform.OS === 'ios' ? 'PlusJakartaSans-Medium' : 'PlusJakartaSans-Medium',
  text:
    Platform.OS === 'ios'
      ? 'PlusJakartaSans-Regular'
      : 'PlusJakartaSans-Regular',
  caption:
    Platform.OS === 'ios'
      ? 'PlusJakartaSans-Regular'
      : 'PlusJakartaSans-Regular',
} as const;

// Typography scale with proper line heights
export const TYPOGRAPHY_SCALE = {
  // Display styles (for hero sections, splash screens)
  display: {
    xl: { fontSize: 48, lineHeight: 56, fontFamily: FONT_FAMILIES.display },
    lg: { fontSize: 40, lineHeight: 48, fontFamily: FONT_FAMILIES.display },
    md: { fontSize: 32, lineHeight: 40, fontFamily: FONT_FAMILIES.display },
    sm: { fontSize: 28, lineHeight: 36, fontFamily: FONT_FAMILIES.display },
  },

  // Heading styles (for section titles, card headers)
  heading: {
    xl: { fontSize: 24, lineHeight: 32, fontFamily: FONT_FAMILIES.title },
    lg: { fontSize: 20, lineHeight: 28, fontFamily: FONT_FAMILIES.title },
    md: { fontSize: 18, lineHeight: 24, fontFamily: FONT_FAMILIES.title },
    sm: { fontSize: 16, lineHeight: 24, fontFamily: FONT_FAMILIES.title },
    xs: { fontSize: 14, lineHeight: 20, fontFamily: FONT_FAMILIES.title },
  },

  // Body text styles
  body: {
    xl: { fontSize: 18, lineHeight: 28, fontFamily: FONT_FAMILIES.text },
    lg: { fontSize: 16, lineHeight: 24, fontFamily: FONT_FAMILIES.text },
    md: { fontSize: 14, lineHeight: 20, fontFamily: FONT_FAMILIES.text },
    sm: { fontSize: 12, lineHeight: 16, fontFamily: FONT_FAMILIES.text },
    xs: { fontSize: 10, lineHeight: 14, fontFamily: FONT_FAMILIES.text },
  },

  // Caption styles (for labels, metadata)
  caption: {
    lg: { fontSize: 12, lineHeight: 16, fontFamily: FONT_FAMILIES.caption },
    md: { fontSize: 11, lineHeight: 16, fontFamily: FONT_FAMILIES.caption },
    sm: { fontSize: 10, lineHeight: 14, fontFamily: FONT_FAMILIES.caption },
  },

  // Button text styles
  button: {
    lg: { fontSize: 16, lineHeight: 24, fontFamily: FONT_FAMILIES.medium },
    md: { fontSize: 14, lineHeight: 20, fontFamily: FONT_FAMILIES.medium },
    sm: { fontSize: 12, lineHeight: 16, fontFamily: FONT_FAMILIES.medium },
  },
} as const;

// Semantic typography tokens
export const TYPOGRAPHY_TOKENS = {
  // Page titles
  pageTitle: TYPOGRAPHY_SCALE.display.md,
  sectionTitle: TYPOGRAPHY_SCALE.heading.lg,
  cardTitle: TYPOGRAPHY_SCALE.heading.md,

  // Content
  bodyLarge: TYPOGRAPHY_SCALE.body.xl,
  bodyDefault: TYPOGRAPHY_SCALE.body.lg,
  bodySmall: TYPOGRAPHY_SCALE.body.md,

  // UI elements
  buttonLarge: TYPOGRAPHY_SCALE.button.lg,
  buttonDefault: TYPOGRAPHY_SCALE.button.md,
  buttonSmall: TYPOGRAPHY_SCALE.button.sm,

  // Labels and metadata
  label: TYPOGRAPHY_SCALE.caption.lg,
  metadata: TYPOGRAPHY_SCALE.caption.md,
  overline: TYPOGRAPHY_SCALE.caption.sm,
} as const;

// Font weights
export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// Letter spacing values
export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

// Legacy Typography object for backward compatibility
export const Typography = {
  // Font families (updated to remove SpaceMono)
  fonts: {
    display: FONT_FAMILIES.display,
    body: FONT_FAMILIES.body,
    bodyMedium: FONT_FAMILIES.medium,
    bodySemiBold: FONT_FAMILIES.title,
  },

  // Text styles for common use cases (updated to use new system)
  styles: {
    // Display styles
    hero: TYPOGRAPHY_TOKENS.pageTitle,
    display: TYPOGRAPHY_SCALE.display.sm,

    // Heading styles
    h1: TYPOGRAPHY_SCALE.heading.xl,
    h2: TYPOGRAPHY_SCALE.heading.lg,
    h3: TYPOGRAPHY_SCALE.heading.md,
    h4: TYPOGRAPHY_SCALE.heading.sm,

    // Body styles
    bodyLarge: TYPOGRAPHY_TOKENS.bodyLarge,
    body: TYPOGRAPHY_TOKENS.bodyDefault,
    bodySmall: TYPOGRAPHY_TOKENS.bodySmall,

    // UI styles
    button: TYPOGRAPHY_TOKENS.buttonDefault,
    buttonSmall: TYPOGRAPHY_TOKENS.buttonSmall,
    label: TYPOGRAPHY_TOKENS.label,
    caption: TYPOGRAPHY_TOKENS.metadata,

    // Stats now use PlusJakarta instead of SpaceMono
    stat: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: FONT_FAMILIES.medium,
    },
    statLarge: {
      fontSize: 36,
      lineHeight: 44,
      fontFamily: FONT_FAMILIES.medium,
    },
  },
} as const;
