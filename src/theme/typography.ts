/**
 * Typography system for SourdoughSuite
 * Enhanced readability and hierarchy
 */

export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    heading: 'System',
  },

  // Font sizes - Refined scale
  sizes: {
    xs: 11,
    sm: 13,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
    '5xl': 52,
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
