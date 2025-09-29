/**
 * StatLocker Typography Guide (Final)
 * 
 * 🅰 Montserrat (Headings & Big Stats) - sporty, bold, geometric
 * 🅱 Urbanist (Body & UI Text) - clean, modern, character
 * 🅲 Roboto Condensed (Captions / Stat Labels) - tight, sharp, stat tables
 */

import { Platform } from 'react-native';

// Font family definitions with platform-aware fallbacks
export const FONT_FAMILIES = {
  // 🅰 Montserrat - Headings & Big Stats (sporty, bold, geometric)
  heading: Platform.select({
    ios: 'Montserrat-SemiBold',
    android: 'Montserrat-SemiBold',
    default: 'Montserrat-SemiBold',
  }),
  
  headingBold: Platform.select({
    ios: 'Montserrat-Bold',
    android: 'Montserrat-Bold',
    default: 'Montserrat-Bold',
  }),
  
  // 🅱 Urbanist - Body & UI Text (clean, modern, character)
  body: Platform.select({
    ios: 'Urbanist-Regular',
    android: 'Urbanist-Regular',
    default: 'Urbanist-Regular',
  }),
  
  bodyMedium: Platform.select({
    ios: 'Urbanist-Medium',
    android: 'Urbanist-Medium',
    default: 'Urbanist-Medium',
  }),
  
  bodySemiBold: Platform.select({
    ios: 'Urbanist-SemiBold',
    android: 'Urbanist-SemiBold',
    default: 'Urbanist-SemiBold',
  }),
  
  // 🅲 Roboto Condensed - Captions/Labels (tight, sharp, stat tables)
  caption: Platform.select({
    ios: 'RobotoCondensed-Regular',
    android: 'RobotoCondensed-Regular',
    default: 'RobotoCondensed-Regular',
  }),
  
  captionBold: Platform.select({
    ios: 'RobotoCondensed-Bold',
    android: 'RobotoCondensed-Bold',
    default: 'RobotoCondensed-Bold',
  }),
} as const;

// Font weights
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

// Letter spacing values
export const LETTER_SPACING = {
  tight: -0.5,      // For large Teko headings (-1% to -2%)
  tightMd: -0.25,   // For medium Teko headings
  normal: 0,
  wide: 0.5,
  overline: 4,      // For overline text (+4%)
} as const;

// Semantic typography tokens based on StatLocker Typography Guide
export const TYPOGRAPHY_TOKENS = {
  // 🅰 MONTSERRAT - Headings & Big Stats
  
  // H1 – Hero Names / Big Stats (Montserrat Bold 32-40pt)
  h1: {
    fontFamily: FONT_FAMILIES.headingBold,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // H2 – Section Titles (Montserrat SemiBold 24pt)
  h2: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // H3 – Subheaders / Card Titles (Montserrat SemiBold 18-20pt)
  h3: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Stat Numbers (cards, trends) - Montserrat Bold 28-36pt
  statNumber: {
    fontFamily: FONT_FAMILIES.headingBold,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Large Stat Numbers - Montserrat Bold 36pt+
  statNumberLarge: {
    fontFamily: FONT_FAMILIES.headingBold,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // 🅱 URBANIST - Body & UI Text
  
  // Body Large (Urbanist Medium 16pt) - "Class of 2027 • Goalie"
  bodyLarge: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Body Default (Urbanist Regular 14-16pt) - Onboarding copy, descriptions
  body: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Body Small (Urbanist Regular 14pt) - Smaller descriptions
  bodySmall: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Button Labels (Urbanist SemiBold 16-18pt) - "Log Game", "Build Profile"
  button: {
    fontFamily: FONT_FAMILIES.bodySemiBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Helper / Trust Text (Urbanist Regular 12pt) - "Your photo is private..."
  helperText: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // 🅲 ROBOTO CONDENSED - Captions / Stat Labels
  
  // Captions / Labels / Tables (Roboto Condensed Regular 12-14pt) - "Save %", "HT", "Club"
  caption: {
    fontFamily: FONT_FAMILIES.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Strong Labels / Badges (Roboto Condensed Bold 12pt) - "WIN", "LOSS", GPA, Team tags
  captionStrong: {
    fontFamily: FONT_FAMILIES.captionBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Table Data (Roboto Condensed Regular 14pt) - Stat table cells
  tableData: {
    fontFamily: FONT_FAMILIES.caption,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
  },
  
  // Overline – Tiny over-headers / chip text
  overline: {
    fontFamily: FONT_FAMILIES.captionBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.overline,
    textTransform: 'uppercase' as const,
  },
} as const;

// Typography scale with proper line heights (legacy support)
export const TYPOGRAPHY_SCALE = {
  // Heading styles (Montserrat)
  heading: {
    xl: { fontSize: 40, lineHeight: 48, fontFamily: FONT_FAMILIES.headingBold },
    lg: { fontSize: 32, lineHeight: 38, fontFamily: FONT_FAMILIES.headingBold },
    md: { fontSize: 24, lineHeight: 32, fontFamily: FONT_FAMILIES.heading },
    sm: { fontSize: 20, lineHeight: 26, fontFamily: FONT_FAMILIES.heading },
    xs: { fontSize: 18, lineHeight: 24, fontFamily: FONT_FAMILIES.heading },
  },

  // Body text styles (Urbanist)
  body: {
    xl: { fontSize: 18, lineHeight: 26, fontFamily: FONT_FAMILIES.bodyMedium },
    lg: { fontSize: 16, lineHeight: 24, fontFamily: FONT_FAMILIES.bodyMedium },
    md: { fontSize: 16, lineHeight: 22, fontFamily: FONT_FAMILIES.body },
    sm: { fontSize: 14, lineHeight: 20, fontFamily: FONT_FAMILIES.body },
    xs: { fontSize: 12, lineHeight: 16, fontFamily: FONT_FAMILIES.body },
  },

  // Caption styles (Roboto Condensed)
  caption: {
    lg: { fontSize: 14, lineHeight: 18, fontFamily: FONT_FAMILIES.caption },
    md: { fontSize: 12, lineHeight: 16, fontFamily: FONT_FAMILIES.caption },
    sm: { fontSize: 11, lineHeight: 14, fontFamily: FONT_FAMILIES.caption },
  },

  // Button text styles (Urbanist SemiBold)
  button: {
    lg: { fontSize: 18, lineHeight: 24, fontFamily: FONT_FAMILIES.bodySemiBold },
    md: { fontSize: 16, lineHeight: 22, fontFamily: FONT_FAMILIES.bodySemiBold },
    sm: { fontSize: 14, lineHeight: 18, fontFamily: FONT_FAMILIES.bodySemiBold },
  },
} as const;

// Legacy Typography object for backward compatibility
export const Typography = {
  // Font families
  fonts: {
    heading: FONT_FAMILIES.headingBold,
    body: FONT_FAMILIES.body,
    bodyMedium: FONT_FAMILIES.bodyMedium,
    bodySemiBold: FONT_FAMILIES.bodySemiBold,
    caption: FONT_FAMILIES.caption,
  },

  // Text styles for common use cases (mapped to new system)
  styles: {
    // Display styles (mapped to new system)
    hero: TYPOGRAPHY_TOKENS.h1,
    title: TYPOGRAPHY_TOKENS.h1,
    display: TYPOGRAPHY_TOKENS.h1,
    
    // Heading styles  
    heading: TYPOGRAPHY_TOKENS.h2,
    subheading: TYPOGRAPHY_TOKENS.h3,
    h1: TYPOGRAPHY_TOKENS.h1,
    h2: TYPOGRAPHY_TOKENS.h2,
    h3: TYPOGRAPHY_TOKENS.h3,
    
    // Body styles
    body: TYPOGRAPHY_TOKENS.bodySmall, // Most common usage is 14px
    bodyLarge: TYPOGRAPHY_TOKENS.bodyLarge,
    bodyEmphasis: TYPOGRAPHY_TOKENS.bodyLarge,
    bodyMedium: TYPOGRAPHY_TOKENS.bodyLarge,
    
    // UI element styles
    button: TYPOGRAPHY_TOKENS.button,
    caption: TYPOGRAPHY_TOKENS.caption,
    label: TYPOGRAPHY_TOKENS.captionStrong,
    
    // Stat display
    statNumber: TYPOGRAPHY_TOKENS.statNumber,
    statNumberLarge: TYPOGRAPHY_TOKENS.statNumberLarge,
    
    // Legacy stat styles (updated to use new fonts)
    stat: TYPOGRAPHY_TOKENS.statNumber,
    statLarge: TYPOGRAPHY_TOKENS.statNumberLarge,
    
    // New semantic styles
    overline: TYPOGRAPHY_TOKENS.overline,
    tableData: TYPOGRAPHY_TOKENS.tableData,
    helperText: TYPOGRAPHY_TOKENS.helperText,
    
    // Utility styles
    small: TYPOGRAPHY_TOKENS.caption,
    large: TYPOGRAPHY_TOKENS.body,
  },
  
  // Direct access to tokens
  tokens: TYPOGRAPHY_TOKENS,
  weights: FONT_WEIGHTS,
  letterSpacing: LETTER_SPACING,
} as const;

// Specific usage guidelines for components
export const USAGE_GUIDELINES = {
  dashboard: {
    athleteName: 'h1',           // "Darien Brothers" → Montserrat Bold 36px
    scoreboard: 'statNumberLarge', // Big numbers → Montserrat Bold 40px
    sectionTitles: 'h2',         // "Performance Stats" → Montserrat SemiBold 24px
    metricLabels: 'h3',          // "Save Percentage" → Montserrat SemiBold 20px
    statNumbers: 'statNumber',   // 82.1%, 0.0 → Montserrat Bold 32px
    descriptions: 'body',        // Helper text → Urbanist Regular 16px
    buttons: 'button',           // "Log Game" → Urbanist SemiBold 16px
    smallLabels: 'caption',      // "SAVE%" → Roboto Condensed Regular 12px
    badges: 'captionStrong',     // "WIN/LOSS" → Roboto Condensed Bold 12px
  },
  
  stats: {
    sectionTitles: 'h2',         // "Game by Game" → Montserrat SemiBold 24px
    tableHeaders: 'captionStrong', // Column headers → Roboto Condensed Bold 12px
    tableCells: 'tableData',     // Data cells → Roboto Condensed Regular 14px
    trendChips: 'captionStrong', // Status badges → Roboto Condensed Bold 12px
  },
  
  recruiting: {
    cardTitles: 'h3',            // Card titles → Montserrat SemiBold 20px
    descriptions: 'body',        // Goal text → Urbanist Regular 16px
    helperText: 'caption',       // "Equipment: ..." → Roboto Condensed Regular 12px
  },
  
  onboarding: {
    headlines: 'h1',             // Main headlines → Montserrat Bold 36px
    subtext: 'body',             // Body copy → Urbanist Regular 16px
    trustCopy: 'helperText',     // Helper text → Urbanist Regular 12px
    buttons: 'button',           // CTAs → Urbanist SemiBold 16px
  },
} as const;

// Type definitions
export type FontFamily = keyof typeof FONT_FAMILIES;
export type TypographyTokens = typeof TYPOGRAPHY_TOKENS;
export type FontWeight = keyof typeof FONT_WEIGHTS;
export type LetterSpacing = keyof typeof LETTER_SPACING;
export type UsageGuidelines = typeof USAGE_GUIDELINES;
