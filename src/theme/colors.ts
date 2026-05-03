/**
 * Color palette for SourdoughSuite
 * Premium Modernist Theme — Clean, editorial, teal-accented
 */

export const colors = {
  // Primary - Teal
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Base Primary
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
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
    main: '#f59e0b', // Golden Wheat — semantic status colour, unchanged
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

  // Backgrounds - aligned to Modernist paper tokens
  background: {
    default: '#FDFEFE',   // Modernist paper — cool-neutral white
    paper: '#FDFEFE',     // Modernist paper — cool-neutral white
    subtle: '#F2F7F7',    // Modernist paperCool — teal-tinted light gray
    dark: '#2A1A10',      // Dark Crust
  },

  // Card Backgrounds
  cardBg: {
    warm: '#F9FCFC',      // Near-white with cool teal tint
    cream: '#EEF8F7',     // Cool teal-cream (replaces warm cream)
    wheat: '#E5F3F2',     // Cool teal-tinted (replaces warm wheat)
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
    light: '#E6EEEE',   // Cool teal-tinted (replaces warm '#F0EBE6')
    main: '#D8E8E7',    // Cool teal-tinted (replaces warm '#E5E0DC')
    dark: '#D6D3D1',
  },

  // Special Effects
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  overlay: 'rgba(42, 40, 38, 0.4)',

  // Gradients
  gradients: {
    primary: ['#3D3D3D', '#1F1F1F'],
    secondary: ['#78716c', '#57534e'],
    warmResult: ['#F0FDFA', '#CCFBF1'],
    golden: ['#3D3D3D', '#1F1F1F'],
  },

  // Bench semantic palette — modernist, sourdough-specific
  bench: {
    flour: '#F0FAFA',     // Cool teal-white (replaces warm '#FFF9ED')
    parchment: '#E4F2F1', // Cool teal-tinted (replaces warm parchment '#F8EEDC')
    linen: '#D6ECEA',     // Cool teal-gray (replaces warm linen '#F2E2C9')
    crust: '#3B2112',
    crustSoft: '#5A3A25',
    crumb: '#14B8A6',
    copper: '#0D9488',
    copperDark: '#0F766E',
    starterGreen: '#557A3B',
    waterBlue: '#4F7E8A',
    heatRed: '#A84E2E',
    border: '#C4C4C4',
    borderSoft: '#DEDEDE',
  },

  // Modernist palette — precise editorial style for Modernist Formula Cards redesign.
  // Color ratio target: ~70% paper/white, 20% ink/graphite, 7% teal rules, 3% teal accent or semantic state.
  modernist: {
    paper: '#FDFEFE',     // Cool near-white (replaces warm '#FFFDF8')
    paperWarm: '#F2F7F7', // Cool teal-tinted (replaces warm '#F7F4EE')
    porcelain: '#FFFFFF',
    ink: '#111111',
    graphite: '#2B2B2B',
    graphiteMuted: '#66615B',
    hairline: '#D8D3CB',
    hairlineDark: '#A9A49B',
    ruleTeal: '#2E7474',
    tealSoft: '#E6F0EF',
    copper: '#0D9488',
    copperSoft: '#CCEDEB',
    starterGreen: '#4D6F3A',
    waterBlue: '#356F8C',
    heatRed: '#9B3F2F',
    warningAmber: '#4E7E7B',
  },

  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
};

export type ColorPalette = typeof colors;
