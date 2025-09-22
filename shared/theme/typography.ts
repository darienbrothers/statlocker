// Premium typography system - Multi-million dollar app feel
export const Typography = {
  // Font families
  fonts: {
    display: "Anton",                    // Headlines, hero text
    body: "PlusJakartaSans",            // Body text, UI
    bodyMedium: "PlusJakartaSans-Medium", // Medium weight body
    bodySemiBold: "PlusJakartaSans-SemiBold", // Semi-bold body
    mono: "SpaceMono",                  // Code, stats, numbers
  },

  // Font sizes (using type scale)
  sizes: {
    xs: 12,    // 0.75rem - Captions, labels
    sm: 14,    // 0.875rem - Small text
    base: 16,  // 1rem - Body text
    lg: 18,    // 1.125rem - Large body
    xl: 20,    // 1.25rem - Subheadings
    "2xl": 24, // 1.5rem - Headings
    "3xl": 30, // 1.875rem - Large headings
    "4xl": 36, // 2.25rem - Display text
    "5xl": 48, // 3rem - Hero text
    "6xl": 60, // 3.75rem - Large hero
    "7xl": 72, // 4.5rem - Massive display
  },

  // Line heights (relative to font size)
  lineHeights: {
    tight: 1.1,    // Headlines
    snug: 1.2,     // Subheadings
    normal: 1.4,   // Body text
    relaxed: 1.5,  // Large body text
    loose: 1.6,    // Reading text
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.05,  // Display text
    tight: -0.025,   // Headlines
    normal: 0,       // Body text
    wide: 0.025,     // Buttons, labels
    wider: 0.05,     // All caps text
    widest: 0.1,     // Tracking
  },

  // Text styles for common use cases
  styles: {
    // Display styles
    hero: {
      fontFamily: "Anton",
      fontSize: 48,
      lineHeight: 1.1,
      letterSpacing: -0.05,
    },
    
    display: {
      fontFamily: "Anton", 
      fontSize: 36,
      lineHeight: 1.1,
      letterSpacing: -0.025,
    },

    // Heading styles
    h1: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: 30,
      lineHeight: 1.2,
      letterSpacing: -0.025,
    },

    h2: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: 24,
      lineHeight: 1.2,
      letterSpacing: 0,
    },

    h3: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: 20,
      lineHeight: 1.3,
      letterSpacing: 0,
    },

    h4: {
      fontFamily: "PlusJakartaSans-Medium",
      fontSize: 18,
      lineHeight: 1.3,
      letterSpacing: 0,
    },

    // Body styles
    bodyLarge: {
      fontFamily: "PlusJakartaSans",
      fontSize: 18,
      lineHeight: 1.5,
      letterSpacing: 0,
    },

    body: {
      fontFamily: "PlusJakartaSans",
      fontSize: 16,
      lineHeight: 1.4,
      letterSpacing: 0,
    },

    bodySmall: {
      fontFamily: "PlusJakartaSans",
      fontSize: 14,
      lineHeight: 1.4,
      letterSpacing: 0,
    },

    // UI styles
    button: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: 16,
      lineHeight: 1.2,
      letterSpacing: 0.025,
    },

    buttonSmall: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: 14,
      lineHeight: 1.2,
      letterSpacing: 0.025,
    },

    label: {
      fontFamily: "PlusJakartaSans-Medium",
      fontSize: 14,
      lineHeight: 1.2,
      letterSpacing: 0.025,
    },

    caption: {
      fontFamily: "PlusJakartaSans",
      fontSize: 12,
      lineHeight: 1.3,
      letterSpacing: 0.025,
    },

    // Special styles
    stat: {
      fontFamily: "SpaceMono",
      fontSize: 24,
      lineHeight: 1.2,
      letterSpacing: 0,
    },

    statLarge: {
      fontFamily: "SpaceMono",
      fontSize: 36,
      lineHeight: 1.1,
      letterSpacing: -0.025,
    },

    code: {
      fontFamily: "SpaceMono",
      fontSize: 14,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  },
} as const;
