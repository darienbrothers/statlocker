// Premium color palette for StatLocker - Multi-million dollar app feel
export const Colors = {
  // Brand Colors
  brand: {
    primary: "#6E57FF",
    primaryTint: "#9B8BFF",
    primaryShade: "#5A47E6",
    accent: "#00E08A",
    accentTint: "#33E6A3",
    accentShade: "#00C777",
  },

  // Surface Colors - Premium dark theme
  surface: {
    primary: "#0F0F12",      // Main background
    elevated: "#16161A",     // Cards, modals
    elevated2: "#1C1C21",    // Higher elevation
    elevated3: "#222228",    // Highest elevation
    overlay: "#0F0F12CC",    // 80% opacity overlay
  },

  // Text Colors
  text: {
    primary: "#E8E8EA",      // Primary text
    secondary: "#B5B5BB",    // Secondary text
    tertiary: "#8A8A90",     // Tertiary text
    disabled: "#5A5A60",     // Disabled text
    inverse: "#0F0F12",      // Text on light backgrounds
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

  // Border & Divider Colors
  border: {
    primary: "#25252A",      // Main borders
    secondary: "#1C1C21",    // Subtle borders
    focus: "#6E57FF",        // Focus states
    success: "#10B981",
    warning: "#C7781F",
    danger: "#DA2E2E",
  },

  // Interactive States
  interactive: {
    hover: "#FFFFFF0A",      // 4% white overlay
    pressed: "#FFFFFF14",    // 8% white overlay
    selected: "#6E57FF1A",   // 10% brand overlay
    disabled: "#FFFFFF05",   // 2% white overlay
  },

  // Gradients
  gradients: {
    brand: ["#6E57FF", "#9B8BFF"],
    accent: ["#00E08A", "#33E6A3"],
    surface: ["#0F0F12", "#16161A"],
    success: ["#10B981", "#34D399"],
    danger: ["#DA2E2E", "#EF4444"],
  },
} as const;
