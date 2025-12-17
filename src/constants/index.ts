export * from './api';

/**
 * App Constants
 */

export const APP_NAME = 'SourdoughSuite';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@sourdough_auth_token',
  USER_DATA: '@sourdough_user',
  THEME_MODE: '@sourdough_theme',
  ONBOARDING_COMPLETE: '@sourdough_onboarding',
};

// Query cache keys
export const QUERY_KEYS = {
  USER: 'user',
  STARTERS: 'starters',
  STARTER_DETAIL: 'starter_detail',
  FEEDING_LOGS: 'feeding_logs',
  RECIPES: 'recipes',
  RECIPE_DETAIL: 'recipe_detail',
  BAKING_LOGS: 'baking_logs',
  FAQS: 'faqs',
  BLOG_POSTS: 'blog_posts',
  PRODUCTS: 'products',
  ORDERS: 'orders',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Expert', value: 'expert' },
] as const;

// Starter types
export const STARTER_TYPES = [
  { label: 'White Flour', value: 'white' },
  { label: 'Whole Wheat', value: 'whole_wheat' },
  { label: 'Rye', value: 'rye' },
  { label: 'Spelt', value: 'spelt' },
  { label: 'Mixed Grain', value: 'mixed' },
] as const;

// Feeding ratios
export const FEEDING_RATIOS = [
  { label: '1:1:1', value: '1:1:1' },
  { label: '1:2:2', value: '1:2:2' },
  { label: '1:3:3', value: '1:3:3' },
  { label: '1:5:5', value: '1:5:5' },
  { label: '1:10:10', value: '1:10:10' },
] as const;
