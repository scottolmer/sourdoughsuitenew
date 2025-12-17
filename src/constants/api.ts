/**
 * API Configuration
 * Update these values for production
 */

// For development, update this to your local machine's IP or production URL
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3001/api' // Android emulator localhost
  : 'https://your-production-url.com/api';

// Alternative for iOS simulator
// export const API_BASE_URL = __DEV__
//   ? 'http://localhost:5000/api'
//   : 'https://your-production-url.com/api';

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
