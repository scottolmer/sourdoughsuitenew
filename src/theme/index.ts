/**
 * Theme configuration for SourdoughSuite Mobile
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,

  // Border radius - More modern
  borderRadius: {
    none: 0,
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },

  // Shadows - Enhanced depth
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 12,
    },
  },

  // Animation timing
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
};

export type Theme = typeof theme;
export { colors, typography, spacing };
