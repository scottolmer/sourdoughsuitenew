/**
 * API Configuration
 */

declare const window: { location: { protocol: string; hostname: string } } | undefined;

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window && window.location) {
    const { protocol, hostname } = window.location;
    const replitDevMatch = hostname.match(/^(\d+)-(.+\.replit\.dev)$/);
    if (replitDevMatch) {
      return `${protocol}//3001-${replitDevMatch[2]}/api`;
    }
    const replCoMatch = hostname.match(/^(.+)\.repl\.co$/);
    if (replCoMatch) {
      return `${protocol}//${hostname}:3001/api`;
    }
  }
  return 'http://localhost:3001/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

export const API_TIMEOUT = 30000; // 30 seconds

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },

  // Starters
  STARTERS: {
    LIST: '/starters',
    DETAIL: (id: number) => `/starters/${id}`,
    CREATE: '/starters',
    UPDATE: (id: number) => `/starters/${id}`,
    DELETE: (id: number) => `/starters/${id}`,
    FEEDING_LOGS: (id: number) => `/starters/${id}/feeding-logs`,
    CATALOG: '/sourdough-starters',
  },

  // Feeding Logs
  FEEDING_LOGS: {
    CREATE: '/feeding-logs',
    DELETE: (id: number) => `/feeding-logs/${id}`,
  },

  // Recipes
  RECIPES: {
    LIST: '/recipes',
    DETAIL: (id: number) => `/recipes/${id}`,
    CREATE: '/recipes',
    UPDATE: (id: number) => `/recipes/${id}`,
    DELETE: (id: number) => `/recipes/${id}`,
    VALIDATE: '/recipes/validate',
  },

  // Baking Logs
  BAKING_LOGS: {
    LIST: '/baking-logs',
    DETAIL: (id: number) => `/baking-logs/${id}`,
    CREATE: '/baking-logs',
    UPDATE: (id: number) => `/baking-logs/${id}`,
    DELETE: (id: number) => `/baking-logs/${id}`,
  },

  // Calculators
  CALCULATORS: {
    TIMELINE: '/ai/generate-timeline',
    SCALING: '/formulas',
    HYDRATION: '/formulas',
    TEMPERATURE: '/formulas',
  },

  // Photo Rescue
  PHOTO_RESCUE: {
    ANALYZE: '/photo-rescue/analyze',
  },

  // AI Services
  AI: {
    GENERATE_RECIPE: '/ai/generate-recipe',
    ANALYZE_RECIPE: '/ai/analyze-recipe',
    TROUBLESHOOT: '/ai/troubleshoot-starter',
    RECOMMEND_STARTER: '/ai/recommend-starter',
    CHAT: '/ai/chat',
  },

  // Content
  CONTENT: {
    FAQS: '/faqs',
    BLOG: '/blog-posts',
    VIDEOS: '/videos',
    ARTICLES: '/content-articles',
  },

  // Shop
  SHOP: {
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id: number) => `/products/${id}`,
    ORDERS: '/orders',
  },
};
