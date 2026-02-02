/**
 * Typography system for SourdoughSuite
 * Enhanced readability and hierarchy with custom fonts
 *
 * Fonts:
 * - Inter: Modern, clean sans-serif for UI and body text
 * - Playfair Display: Elegant serif for headings and emphasis
 */

export const typography = {
  // Font families - Custom fonts for premium feel
  fonts: {
    // Body text and UI elements
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',

    // Headings and emphasis
    heading: 'PlayfairDisplay_700Bold',
    headingRegular: 'PlayfairDisplay_400Regular',

    // Fallback to system fonts if custom fonts fail to load
    system: 'System',
  },

  // Font sizes - More dramatic scale for better hierarchy
  sizes: {
    xs: 11,
    sm: 13,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,    // Increased from 26
    '3xl': 36,    // Increased from 32
    '4xl': 48,    // Increased from 40
    '5xl': 64,    // Increased from 52
    '6xl': 80,    // New larger size
  },

  // Line heights - Improved readability
  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Font weights
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
  },
};

export type Typography = typeof typography;
