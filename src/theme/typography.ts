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
    // Body text and UI elements - Inter font family
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',

    // Headings and emphasis - Playfair Display
    heading: 'PlayfairDisplay-Bold',
    headingRegular: 'PlayfairDisplay-Regular',

    // Fallback to system fonts
    system: 'System',
  },

  // Font sizes - More dramatic scale for better hierarchy
  sizes: {
    xs: 12,    // Slightly larger for readability
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,
    '5xl': 56,
    '6xl': 72,
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
