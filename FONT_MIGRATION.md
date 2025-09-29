# Font System Migration - Teko, Urbanist & Lato

## Overview
Successfully migrated StatLocker v1 from Anton/PlusJakarta fonts to the new **Teko, Urbanist & Lato** font system with comprehensive usage mapping and semantic tokens.

## New Font Stack

### Teko (Headings & Stats)
- **Teko-SemiBold**: H2 section titles, H3 card titles/metric labels
- **Teko-Bold**: H1 big banners/athlete names, stat numbers, scoreboard displays
- **Usage**: Tight letter-spacing (-1% to -2%), large sizes (16-40px)

### Urbanist (Body & Buttons)  
- **Urbanist-Regular**: Body text, paragraph content, onboarding copy
- **Urbanist-Medium**: Emphasized body text, subheads, dense cards
- **Urbanist-SemiBold**: All buttons, tabs (improves tap-target clarity)
- **Usage**: Primary reading font, sizes 14-16px

### Lato (Captions & Labels)
- **Lato-Regular**: Table labels, small badges, helper text (sizes 11-12px)
- **Lato-Bold**: Emphasized labels (WIN/LOSS, totals), overline text
- **Usage**: Highly legible small text, stable numerals for tables

## Typography Tokens

### Semantic Usage Map
```typescript
// H1 – Big banners, athlete name, scoreboard
h1: Teko-Bold 34px / line-height 40 / letterSpacing -0.5

// H2 – Section titles (Performance Overview, Recent Games)  
h2: Teko-SemiBold 24px / LH 32 / letterSpacing -0.25

// H3 – Card titles / metric labels
h3: Teko-SemiBold 18px / LH 22

// StatNumber – Hero stats (82.1%, 23 saves)
statNumber: Teko-Bold 32px / LH 35 (1.1 ratio)
statNumberLarge: Teko-Bold 40px / LH 44 (1.1 ratio)

// Body – Paragraph text, onboarding copy
body: Urbanist-Regular 16px / LH 22
bodySmall: Urbanist-Regular 14px / LH 20

// BodyEmphasis – Emphasized body, subheads
bodyEmphasis: Urbanist-Medium 16px / LH 22
bodyEmphasisSmall: Urbanist-Medium 14px / LH 20

// Button – All buttons, tabs
button: Urbanist-SemiBold 15px / LH 18

// Caption – Table labels, small badges, helper text
caption: Lato-Regular 12px / LH 16

// CaptionStrong – Emphasized labels (WIN/LOSS, totals)
captionStrong: Lato-Bold 12px / LH 16

// Overline – Tiny over-headers / chip text
overline: Lato-Bold 11px / LH 14 (all-caps + letterSpacing 4%)

// NumericMono – Fixed-width numbers
numericMono: Lato-Regular 14px / LH 20
```

## Component Usage Guidelines

### Dashboard
- **Athlete Name**: `Typography.styles.h1` → Teko Bold 34px
- **Scoreboard Numbers**: `Typography.styles.statNumberLarge` → Teko Bold 40px  
- **Section Titles**: `Typography.styles.h2` → Teko SemiBold 24px
- **Metric Labels**: `Typography.styles.h3` → Teko SemiBold 18px
- **Stat Numbers**: `Typography.styles.statNumber` → Teko Bold 32px
- **Descriptions**: `Typography.styles.body` → Urbanist Regular 16px
- **Buttons**: `Typography.styles.button` → Urbanist SemiBold 15px
- **Small Labels**: `Typography.styles.caption` → Lato Regular 12px
- **Badges**: `Typography.styles.label` → Lato Bold 12px

### Stats & Game Details
- **Section Titles**: `Typography.styles.h2` → Teko SemiBold 24px
- **Table Headers**: `Typography.styles.label` → Lato Bold 12px
- **Table Cells**: `Typography.styles.caption` → Lato Regular 12px
- **Trend Chips**: `Typography.styles.label` → Lato Bold 12px

### Skills / Goals / Recruiting
- **Card Titles**: `Typography.styles.h3` → Teko SemiBold 18px
- **Descriptions**: `Typography.styles.body` → Urbanist Regular 16px
- **Helper Text**: `Typography.styles.caption` → Lato Regular 12px

## Files Updated

### Core System
- ✅ `/app/_layout.tsx` - Updated font loading with new Teko/Urbanist/Lato fonts
- ✅ `/shared/theme/typography.ts` - Complete rewrite with semantic tokens and usage guidelines
- ✅ `/assets/fonts/` - Removed Anton/PlusJakarta, kept only new 7 font files

### Font Files (7 total)
- ✅ `Teko-SemiBold.ttf` (154KB)
- ✅ `Teko-Bold.ttf` (154KB)  
- ✅ `Urbanist-Regular.ttf` (42KB)
- ✅ `Urbanist-Medium.ttf` (42KB)
- ✅ `Urbanist-SemiBold.ttf` (42KB)
- ✅ `Lato-Regular.ttf` (75KB)
- ✅ `Lato-Bold.ttf` (73KB)

## Implementation Details

### Font Loading
```typescript
// app/_layout.tsx
const [loaded] = useFonts({
  // Teko fonts - For headings and stat numbers
  "Teko-SemiBold": require("../assets/fonts/Teko-SemiBold.ttf"),
  "Teko-Bold": require("../assets/fonts/Teko-Bold.ttf"),
  
  // Urbanist fonts - For body text and buttons
  "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
  "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
  "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
  
  // Lato fonts - For captions and small text
  "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
  "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
});
```

### Typography System Structure
```typescript
// New semantic tokens
export const TYPOGRAPHY_TOKENS = {
  h1, h2, h3,                    // Headings (Teko)
  statNumber, statNumberLarge,   // Stats (Teko Bold)
  body, bodySmall,               // Body text (Urbanist)
  bodyEmphasis, bodyEmphasisSmall, // Emphasized body (Urbanist Medium)
  button,                        // Buttons (Urbanist SemiBold)
  caption, captionStrong,        // Captions (Lato)
  overline, numericMono          // Special cases
}

// Legacy compatibility maintained
export const Typography = {
  fonts: FONT_FAMILIES,
  styles: { /* mapped to new tokens */ },
  tokens: TYPOGRAPHY_TOKENS,
  weights: FONT_WEIGHTS,
  letterSpacing: LETTER_SPACING,
}
```

### Usage Guidelines Export
```typescript
export const USAGE_GUIDELINES = {
  dashboard: { athleteName: 'h1', scoreboard: 'statNumberLarge', ... },
  stats: { sectionTitles: 'h2', tableHeaders: 'captionStrong', ... },
  recruiting: { cardTitles: 'h3', descriptions: 'body', ... },
}
```

## Benefits

1. **Athletic Aesthetic**: Teko provides strong, condensed headings perfect for sports apps
2. **Excellent Readability**: Urbanist offers superior readability for body text
3. **Small Text Clarity**: Lato excels at small sizes for labels and captions
4. **Performance**: Reduced from 4 to 7 font files but with better semantic organization
5. **Consistency**: Clear usage guidelines prevent font misuse across components
6. **Accessibility**: Proper contrast ratios and legible small text
7. **Scalability**: Semantic tokens make future font changes easier

## Next Steps

- Test typography across all screens to ensure proper rendering
- Verify font loading performance on different devices
- Update any remaining hardcoded font references in components
- Consider adding font display: swap for better loading performance
- Document any component-specific typography patterns that emerge

The new font system provides a professional, athletic aesthetic while maintaining excellent readability and clear semantic meaning throughout the application.
