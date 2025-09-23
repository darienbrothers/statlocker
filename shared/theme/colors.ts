// Premium color palette for StatLocker - Light theme
export const Colors = {
  // Brand Colors
  brand: {
    primary: '#6366F1',      // Indigo-500
    primaryTint: '#818CF8',  // Indigo-400
    primaryShade: '#4F46E5', // Indigo-600
    secondary: '#10B981',    // Emerald-500
    accent: '#F59E0B',       // Amber-500
  },

  // Surface Colors - Light theme
  surface: {
    primary: '#FFFFFF',      // White background
    elevated: '#F9FAFB',     // Gray-50 for cards
    elevated2: '#F3F4F6',    // Gray-100 for nested elements
    elevated3: '#E5E7EB',    // Gray-200 for highest elevation
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  },

  // Text Colors - Light theme
  text: {
    primary: '#111827',      // Gray-900 - main text
    secondary: '#6B7280',    // Gray-500 - secondary text
    tertiary: '#9CA3AF',     // Gray-400 - muted text
    disabled: '#D1D5DB',     // Gray-300 - disabled text
    inverse: '#FFFFFF',      // White text on dark backgrounds
  },

  // Semantic Colors
  semantic: {
    success: "#10B981",
    successTint: "#34D399",
    warning: "#C7781F",
    warningTint: "#F59E0B",
    danger: "#DA2E2E",
    dangerTint: "#EF4444",
    info: "#3B82F6",
    infoTint: "#60A5FA",
  },

  // Border & Divider Colors - Light theme
  border: {
    primary: '#E5E7EB',      // Gray-200 - main borders
    secondary: '#F3F4F6',    // Gray-100 - subtle borders
    focus: '#6366F1',        // Brand primary for focus
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    accent: '#6366F1',       // Brand primary
  },

  // Interactive States - Light theme
  interactive: {
    hover: 'rgba(0, 0, 0, 0.05)',     // Light black overlay
    pressed: 'rgba(0, 0, 0, 0.1)',    // Darker black overlay
    selected: 'rgba(99, 102, 241, 0.1)', // Brand overlay
    disabled: 'rgba(0, 0, 0, 0.02)',  // Very light overlay
    focus: 'rgba(99, 102, 241, 0.1)',
  },

  // Status Colors
  status: {
    success: '#10B981',      // Emerald-500
    warning: '#F59E0B',      // Amber-500
    error: '#EF4444',        // Red-500
    info: '#3B82F6',         // Blue-500
  },

  // Gradients
  gradients: {
    primary: ['#6366F1', '#818CF8'],
    surface: ['#FFFFFF', '#F9FAFB'],
    accent: ['#F59E0B', '#FBBF24'],
    success: ['#10B981', '#34D399'],
    danger: ['#EF4444', '#F87171'],
  },
} as const;
