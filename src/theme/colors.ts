/**
 * Color palette for SourdoughSuite
 * Modern, cohesive color scheme with gradients
 */

export const colors = {
  // Primary brand colors - Enhanced warm bread tones
  primary: {
    50: '#fef8ed',
    100: '#fdefd5',
    200: '#fbd9a0',
    300: '#f9c470',
    400: '#f7a73f',
    500: '#e8942a', // Main bread color - warmer
    600: '#d17d1e',
    700: '#a85f17',
    800: '#7f4712',
    900: '#56300c',
  },

  // Secondary colors - Modern grays with warmth
  secondary: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },

  // Success - Vibrant green for healthy starters
  success: {
    light: '#a3e635',
    main: '#65a30d',
    dark: '#4d7c0f',
  },

  // Warning - Eye-catching amber
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
  },

  // Error - Bold red
  error: {
    light: '#f87171',
    main: '#dc2626',
    dark: '#991b1b',
  },

  // Info - Modern blue
  info: {
    light: '#60a5fa',
    main: '#2563eb',
    dark: '#1e40af',
  },

  // Background - Subtle warmth
  background: {
    default: '#ffffff',
    paper: '#fafaf9',
    subtle: '#f5f5f4',
    dark: '#1c1917',
  },

  // Text - Better contrast
  text: {
    primary: '#0c0a09',
    secondary: '#57534e',
    tertiary: '#78716c',
    disabled: '#a8a29e',
    inverse: '#ffffff',
  },

  // Borders - Refined
  border: {
    light: '#e7e5e4',
    main: '#d6d3d1',
    dark: '#a8a29e',
  },

  // Gradients
  gradients: {
    primary: ['#f7a73f', '#e8942a'],
    secondary: ['#868e96', '#495057'],
    success: ['#a3e635', '#65a30d'],
    warm: ['#fef8ed', '#fdefd5'],
    sunset: ['#f7a73f', '#dc2626'],
  },

  // Special colors
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export type ColorPalette = typeof colors;
