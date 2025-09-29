/**
 * Turf & Steel Theme Colors for Themed Components
 * 
 * This provides the basic color mapping for the legacy Themed.tsx components.
 * For the full theme system, use @/shared/theme/colors.ts
 */

// Turf Green - Primary brand color
const tintColorLight = '#16A34A';
// Near-white for dark theme
const tintColorDark = '#F8FAFC';

export default {
  light: {
    // Light theme (not primary focus, but maintained for compatibility)
    text: '#111827',           // Dark text on light background
    background: '#FFFFFF',     // White background
    tint: tintColorLight,      // Turf green tint
    tabIconDefault: '#9CA3AF', // Steel silver for inactive
    tabIconSelected: tintColorLight, // Turf green for active
  },
  dark: {
    // DARK THEME - Primary Turf & Steel theme
    text: '#F8FAFC',           // Near-white text (PRIMARY TEXT)
    background: '#111827',     // Charcoal background (APP BASE)
    tint: '#16A34A',          // Turf green tint (PRIMARY)
    tabIconDefault: '#9CA3AF', // Steel silver for inactive tabs (SECONDARY)
    tabIconSelected: '#16A34A', // Turf green for active tabs (PRIMARY)
  },
};
