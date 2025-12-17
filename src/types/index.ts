/**
 * TypeScript types for SourdoughSuite Mobile
 */

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'free' | 'premium' | 'master';
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  defaultHydration?: number;
  timezone?: string;
}

// Starter types
export type StarterType =
  | 'levain'
  | 'liquid-levain'
  | 'stiff-levain'
  | 'poolish'
  | 'biga'
  | 'pate-fermentee'
  | 'sourdough';

export type StarterHealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'inactive';

export interface Starter {
  id: number;
  name: string;
  type: StarterType;
  flourType: string;
  feedingRatio: string;
  createdAt: string;
  updatedAt?: string;
  userId?: number;
  notes?: string;
  isActive: boolean;

  // Health & Activity tracking
  lastFed?: string; // ISO timestamp of last feeding
  nextFeedingDue?: string; // ISO timestamp when next feeding is due
  feedingFrequencyHours?: number; // How often it needs feeding (e.g., 12, 24)
  healthStatus?: StarterHealthStatus;

  // Health indicators (calculated from recent feeding logs)
  avgRiseTime?: number; // Average time to peak in hours
  avgActivityLevel?: number; // Average activity level 1-5
  consistency?: string; // Current consistency notes
}

export interface FeedingLog {
  id?: number;
  starterId: number;
  date?: string;
  time?: string;
  starterAmount?: number;
  flourAmount?: number;
  waterAmount?: number;
  flourType?: string;
  temperature?: number;
  observations?: string;
  notes?: string;
  peakTime?: number;
  activityLevel?: number;
  createdAt: string;
}

// Recipe ingredient type
export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  percentage?: number;
  type?: 'flour' | 'water' | 'salt' | 'starter' | 'fat' | 'sweetener' | 'inclusion' | 'other';
}

// Recipe types
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  starterUsedId?: number; // Link to the starter used for this recipe

  // Baker's percentages (all relative to flour = 100%)
  formula: {
    flour: number; // grams (base amount)
    water: number; // percentage
    salt: number; // percentage
    starter: number; // percentage
  };

  // Additional ingredients (seeds, oils, inclusions, etc.)
  additionalIngredients?: RecipeIngredient[];

  // Calculated values
  hydration: number; // percentage
  totalWeight: number; // grams

  // Instructions and timing
  instructions: string;
  timing?: {
    bulk: number; // minutes
    proof: number; // minutes
    bake: number; // minutes
  };

  // Metadata
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yieldAmount?: string; // e.g., "2 loaves", "1 boule"
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Baking Log types
export interface BakingLog {
  id: number;
  recipeId: number;
  starterId?: number;
  date: string;
  duration?: number;
  temperature?: number;
  humidity?: number;
  rating?: number;
  notes?: string;
  photos?: string[];
  success: boolean;
  issues?: string[];
  createdAt: string;
}

// Calculator types
export interface TimelineCalculation {
  steps: TimelineStep[];
  totalTime: number;
  startTime?: string;
  endTime?: string;
}

export interface TimelineStep {
  name: string;
  duration: number;
  temperature?: number;
  startTime?: string;
  endTime?: string;
  description?: string;
}

export interface HydrationCalculation {
  totalFlour: number;
  totalWater: number;
  hydrationPercentage: number;
  ingredients: RecipeIngredient[];
}

// AI types
export interface AIRecipeRequest {
  prompt?: string;
  difficulty?: string;
  hydration?: number;
  flourType?: string;
  time?: number;
}

export interface AIRecipeResponse {
  recipe: Recipe;
  explanation?: string;
  tips?: string[];
}

export interface AITroubleshootRequest {
  issue: string;
  starterAge?: number;
  feedingSchedule?: string;
  observations?: string;
}

export interface AITroubleshootResponse {
  diagnosis: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  featured: boolean;
}

// Order types
export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  productName: string;
}

// Content types
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  tags?: string[];
}

export interface Video {
  id: number;
  title: string;
  description?: string;
  youtubeId: string;
  category: string;
  difficulty: string;
  duration?: number;
  featured: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Navigation types
export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;

  // Main tabs
  MainTabs: undefined;
  Home: undefined;
  Tools: undefined;
  Starters: undefined;
  Recipes: undefined;
  Profile: undefined;

  // Starter screens
  StarterDetail: { starterId: number };
  AddStarter: undefined;
  EditStarter: { starterId: number };
  FeedingLog: { starterId: number };

  // Recipe screens
  RecipeDetail: { recipeId: string };
  AddRecipe: undefined;
  EditRecipe: { recipeId: string };
  RecipeValidator: undefined;

  // Calculator screens
  BakersCalculator: undefined;
  TimelineCalculator: undefined;
  HydrationConverter: undefined;
  ScalingCalculator: undefined;
  TemperatureCalculator: undefined;

  // AI screens
  AIRecipeGenerator: undefined;
  AITroubleshooter: undefined;
  AIChat: undefined;

  // Baking log screens
  BakingLogs: undefined;
  AddBakingLog: { recipeId?: number };
  BakingLogDetail: { logId: number };

  // Content screens
  FAQList: undefined;
  BlogList: undefined;
  BlogDetail: { slug: string };
  VideoList: undefined;

  // Shop screens
  Shop: undefined;
  ProductDetail: { productId: number };
  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;
};
