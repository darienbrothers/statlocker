/**
 * Turf & Steel Theme - Dark theme color palette for StatLocker
 * 
 * This theme uses a dark foundation with green accents to create a modern,
 * sports-focused aesthetic that's easy on the eyes during extended use.
 */
export const Colors = {
  // Brand Colors - Turf & Steel Theme
  brand: {
    // PRIMARY: Updated Green (#11b981) - Main brand color
    // Usage: Primary buttons, FAB (Log Game), active highlights, progress bars, selected states
    primary: '#11b981',
    primaryTint: '#22C55E',    // Lighter green for hover states
    primaryShade: '#0f9f73',   // Darker green for pressed states
    
    // SECONDARY: Steel Silver (#9CA3AF) - Secondary brand color  
    // Usage: Secondary UI elements, dividers, muted badges, inactive tab states
    secondary: '#9CA3AF',
    secondaryTint: '#D1D5DB',  // Lighter for subtle highlights
    secondaryShade: '#6B7280', // Darker for pressed secondary elements
    
    // ACCENT: Keep success green as accent for consistency
    accent: '#22C55E',
  },

  // Surface Colors - Dark Theme Foundation
  surface: {
    // BACKGROUND: Updated Dark (#111827) - Main app background
    // Usage: Root app background, screen backgrounds
    primary: '#111827',
    
    // SURFACE: Asphalt (#1F2937) - Elevated card backgrounds
    // Usage: Dashboard cards, Stats sections, modal backgrounds, bottom sheets
    elevated: '#1F2937',
    
    // SURFACE ALT: Lighter surface (#273549) - Nested/hover surfaces
    // Usage: Hover states, nested surfaces inside Stats/Game Details, pressed cards
    elevated2: '#273549',
    
    // HIGHEST ELEVATION: Even lighter for stacked elements
    elevated3: '#374151',
    
    // Modal/overlay backgrounds with opacity
    overlay: 'rgba(17, 24, 39, 0.8)', // Dark overlay with transparency
  },

  // Text Colors - Dark Theme Optimized
  text: {
    // PRIMARY TEXT: Near-white (#F8FAFC) - High contrast text
    // Usage: Titles, headings, stat numbers, primary content
    primary: '#F8FAFC',
    
    // SECONDARY TEXT: Slate gray (#94A3B8) - Readable secondary text
    // Usage: Body text, captions, descriptions, secondary information
    secondary: '#94A3B8',
    
    // TERTIARY: Muted text for less important content
    tertiary: '#64748B',
    
    // DISABLED: Very muted for disabled states
    disabled: '#475569',
    
    // INVERSE: White text for dark backgrounds (buttons, badges on primary colors)
    inverse: '#FFFFFF',
  },

  // Semantic Colors - Status & Feedback
  semantic: {
    // SUCCESS: Bright green (#22C55E) - Positive feedback
    // Usage: Positive trends, "WIN" badges, upward arrows, success messages
    success: '#22C55E',
    successTint: '#4ADE80',    // Lighter for backgrounds
    
    // WARNING: Amber for caution states
    warning: '#F59E0B',
    warningTint: '#FBBF24',
    
    // DANGER/ERROR: Red (#EF4444) - Negative feedback
    // Usage: Negative trends, "LOSS" badges, error states, downward arrows
    danger: '#EF4444',
    dangerTint: '#F87171',     // Lighter for backgrounds
    
    // INFO: Blue for informational content
    info: '#3B82F6',
    infoTint: '#60A5FA',
  },

  // Border & Divider Colors - Dark Theme
  border: {
    // PRIMARY BORDER: (#334155) - Main borders and separators
    // Usage: Card borders, table borders, input borders, section dividers
    primary: '#334155',
    
    // SECONDARY: Subtle borders for nested elements
    secondary: '#1E293B',
    
    // FOCUS: Updated green for focused elements
    focus: '#11b981',
    
    // STATUS BORDERS: Match semantic colors
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    accent: '#11b981',
  },

  // Interactive States - Dark Theme Optimized
  interactive: {
    // HOVER: Light overlay for hover states
    hover: 'rgba(255, 255, 255, 0.05)',
    
    // PRESSED: Stronger overlay for pressed states
    pressed: 'rgba(255, 255, 255, 0.1)',
    
    // SELECTED: Updated green overlay for selected states
    selected: 'rgba(17, 185, 129, 0.15)',
    
    // DISABLED: Very subtle overlay for disabled states
    disabled: 'rgba(255, 255, 255, 0.02)',
    
    // FOCUS: Updated green focus ring
    focus: 'rgba(17, 185, 129, 0.2)',
  },

  // Status Colors - Simplified semantic mapping
  status: {
    // SUCCESS: Bright green for wins, positive trends
    success: '#22C55E',
    
    // WARNING: Amber for neutral/caution states
    warning: '#F59E0B',
    
    // ERROR: Red for losses, negative trends
    error: '#EF4444',
    
    // INFO: Blue for informational content
    info: '#3B82F6',
  },

  // Gradients - Dark theme compatible
  gradients: {
    // PRIMARY: Updated green gradient for hero elements
    primary: ['#11b981', '#22C55E'],
    
    // SURFACE: Subtle dark gradients for depth
    surface: ['#111827', '#1F2937'],
    
    // ACCENT: Success green gradient
    accent: ['#22C55E', '#4ADE80'],
    
    // SUCCESS: Green gradient for positive elements
    success: ['#22C55E', '#4ADE80'],
    
    // DANGER: Red gradient for negative elements
    danger: ['#EF4444', '#F87171'],
  },
} as const;
