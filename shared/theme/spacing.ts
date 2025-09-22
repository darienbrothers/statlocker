// Premium spacing system - 8pt grid with golden ratio influences
export const Spacing = {
  // Base spacing units (8pt grid)
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem  
  md: 12,   // 0.75rem
  lg: 16,   // 1rem
  xl: 20,   // 1.25rem
  "2xl": 24,  // 1.5rem
  "3xl": 32,  // 2rem
  "4xl": 40,  // 2.5rem
  "5xl": 48,  // 3rem
  "6xl": 64,  // 4rem
  "7xl": 80,  // 5rem
  "8xl": 96,  // 6rem

  // Component-specific spacing
  component: {
    // Padding
    cardPadding: 20,
    screenPadding: 24,
    sectionPadding: 32,
    buttonPadding: 16,
    inputPadding: 16,

    // Margins
    cardMargin: 16,
    sectionMargin: 24,
    elementMargin: 12,

    // Gaps
    stackGap: 16,
    gridGap: 12,
    listGap: 8,

    // Touch targets
    minTouchTarget: 48,
    fabSize: 64,
    iconSize: 24,
    avatarSize: 40,
  },

  // Layout spacing
  layout: {
    headerHeight: 64,
    tabBarHeight: 80,
    fabOffset: 32,
    safeAreaPadding: 16,
    modalPadding: 24,
    sheetPadding: 20,
  },

  // Animation spacing
  animation: {
    slideDistance: 300,
    parallaxOffset: 50,
    bounceDistance: 8,
  },
} as const;

// Responsive spacing helpers
export const ResponsiveSpacing = {
  // Screen size breakpoints
  breakpoints: {
    sm: 375,  // iPhone SE
    md: 414,  // iPhone Pro
    lg: 768,  // iPad
    xl: 1024, // iPad Pro
  },

  // Responsive padding function
  getResponsivePadding: (screenWidth: number) => {
    if (screenWidth >= 768) return Spacing["4xl"]; // iPad+
    if (screenWidth >= 414) return Spacing["3xl"]; // Large phones
    return Spacing["2xl"]; // Small phones
  },
} as const;
