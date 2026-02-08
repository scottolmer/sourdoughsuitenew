/**
 * Color palette for SourdoughSuite
 * Premium Artisan Theme - Warm, organic, and elegant
 */

export const colors = {
  // Primary - Rich Amber / Bronzed Crust
  primary: {
    50: '#fffbf0',
    100: '#fef2d6',
    200: '#fce3ad',
    300: '#fad280',
    400: '#f7b955',
    500: '#f59e0b', // Base Primary
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Secondary - Warm Neutrals / Stone
  secondary: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },

  // Functional Colors - Earthy but distinctive
  success: {
    light: '#dcfce7',
    main: '#4ade80', // Fresh Starter Green
    dark: '#15803d',
  },

  warning: {
    light: '#fef3c7',
    main: '#f59e0b', // Golden Wheat
    dark: '#b45309',
  },

  error: {
    light: '#fee2e2',
    main: '#ef4444', // Scorched Red
    dark: '#991b1b',
  },

  info: {
    light: '#e0f2fe',
    main: '#3b82f6', // Clean Water
    dark: '#1e40af',
  },

  // Backgrounds - Warm & Organic
  background: {
    default: '#FDFBF7',   // Floral White / Warm Flour
    paper: '#FFFFFF',     // Pure White
    subtle: '#FAF6F0',    // Very light beige
    dark: '#2A2826',      // Dark Loaf
  },

  // Card Backgrounds
  cardBg: {
    warm: '#FDFBF7',
    cream: '#FFF9F0',
    wheat: '#FEF3E6',
    neutral: '#F5F5F4',
  },

  // Text - High Contrast but Softer
  text: {
    primary: '#2A2826',   // Soft Black / Dark Crust
    secondary: '#57534e', // Warm Gray
    tertiary: '#888481',  // Light Gray
    disabled: '#d6d3d1',
    inverse: '#FFFFFF',
  },

  // Borders
  border: {
    light: '#F0EBE6',
    main: '#E5E0DC',
    dark: '#D6D3D1',
  },

  // Special Effects
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  overlay: 'rgba(42, 40, 38, 0.4)',

  // Gradients
  gradients: {
    primary: ['#f59e0b', '#d97706'],
    secondary: ['#78716c', '#57534e'],
    warmResult: ['#fffbf0', '#fef2d6'],
    golden: ['#fcd34d', '#f59e0b'],
  },

  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
};

export type ColorPalette = typeof colors;
