/**
 * Color palette for SourdoughSuite
 * Premium Artisan Theme - Warm, organic, and elegant
 */

export const colors = {
  // Modernist Formula Cards - paper, ink, technical rules
  modernist: {
    paper: '#FFFDF8',
    paperWarm: '#F7F4EE',
    porcelain: '#FFFFFF',
    ink: '#111111',
    graphite: '#2B2B2B',
    graphiteMuted: '#66615B',
    hairline: '#D8D3CB',
    hairlineDark: '#A9A49B',
    ruleTeal: '#2E7474',
    tealSoft: '#E6F0EF',
    copper: '#B46F2B',
    copperSoft: '#F2E1D0',
    starterGreen: '#4D6F3A',
    waterBlue: '#356F8C',
    heatRed: '#9B3F2F',
    warningAmber: '#B87A1D',
  },

  // Primary - Rich Amber / Bronzed Crust
  primary: {
    50: '#E6F0EF',
    100: '#CFE2E0',
    200: '#9FC6C4',
    300: '#6FAAA7',
    400: '#4D8E8B',
    500: '#2E7474', // Modernist rule teal
    600: '#245E5F',
    700: '#1D4B4C',
    800: '#16393A',
    900: '#102B2C',
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
    default: '#4ade80',
    medium: '#4ade80',
    dark: '#15803d',
  },

  warning: {
    light: '#fef3c7',
    main: '#f59e0b', // Golden Wheat
    default: '#f59e0b',
    medium: '#f59e0b',
    dark: '#b45309',
  },

  error: {
    light: '#fee2e2',
    main: '#ef4444', // Scorched Red
    default: '#ef4444',
    medium: '#ef4444',
    dark: '#991b1b',
  },

  info: {
    light: '#e0f2fe',
    main: '#3b82f6', // Clean Water
    dark: '#1e40af',
  },

  // Backgrounds - Warm & Organic
  background: {
    default: '#FFFDF8',
    paper: '#FFFDF8',
    subtle: '#F7F4EE',
    dark: '#111111',
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
    primary: '#111111',
    secondary: '#2B2B2B',
    tertiary: '#66615B',
    disabled: '#d6d3d1',
    inverse: '#FFFFFF',
  },

  // Borders
  border: {
    light: '#E7E2DA',
    main: '#D8D3CB',
    default: '#D8D3CB',
    medium: '#D8D3CB',
    dark: '#A9A49B',
  },

  // Special Effects
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  overlay: 'rgba(42, 40, 38, 0.4)',

  // Gradients
  gradients: {
    primary: ['#2E7474', '#245E5F'],
    secondary: ['#78716c', '#57534e'],
    warmResult: ['#fffbf0', '#fef2d6'],
    golden: ['#fcd34d', '#f59e0b'],
  },

  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
};

export type ColorPalette = typeof colors;
