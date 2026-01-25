/**
 * Navigation types
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Stack param lists
export type HomeStackParamList = {
  Home: undefined;
};

export type ToolsStackParamList = {
  ToolsList: undefined;
  BakersCalculator: undefined;
  HydrationCalculator: undefined;
  TimelineCalculator: undefined;
  ScalingCalculator: undefined;
  TemperatureCalculator: undefined;
  LevainBuilder: undefined;
  StarterPercentageCalculator: undefined;
  PrefermentCalculator: undefined;
  DoughWeightCalculator: undefined;
  RecipeRescueCalculator: undefined;
};

export type StartersStackParamList = {
  StartersList: undefined;
  StarterDetail: { starterId: number };
  AddStarter: undefined;
  EditStarter: { starterId: number };
  AddFeeding: { starterId: number };
};

export type RecipesStackParamList = {
  Recipes: undefined;
  RecipeDetail: { recipeId: string };
  AddRecipe: {
    prefilledFormula?: {
      flour: string;
      water: string;
      salt: string;
      starter: string;
      additionalIngredients?: Array<{
        name: string;
        amount: number;
        unit: string;
        type?: 'flour' | 'fat' | 'sweetener' | 'inclusion' | 'other';
      }>;
    };
  } | undefined;
  EditRecipe: { recipeId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

// Tab param list
export type MainTabParamList = {
  HomeTab: undefined;
  ToolsTab: undefined;
  StartersTab: undefined;
  RecipesTab: undefined;
  ProfileTab: undefined;
};

// Root stack
export type RootStackParamList = {
  MainTabs: undefined;
};

// Screen props types
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
export type StarterDetailScreenProps = NativeStackScreenProps<
  StartersStackParamList,
  'StarterDetail'
>;
export type AddStarterScreenProps = NativeStackScreenProps<
  StartersStackParamList,
  'AddStarter'
>;
export type EditStarterScreenProps = NativeStackScreenProps<
  StartersStackParamList,
  'EditStarter'
>;
export type AddFeedingScreenProps = NativeStackScreenProps<
  StartersStackParamList,
  'AddFeeding'
>;
export type ToolsScreenProps = NativeStackScreenProps<
  ToolsStackParamList,
  'ToolsList'
>;
