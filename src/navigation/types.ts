/**
 * Navigation types
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Stack param lists
export type HomeStackParamList = {
  Home: undefined;
  Learn: undefined;
  Profile: undefined;
  HelpFaq: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export type ToolsStackParamList = {
  ToolsList: undefined;
  BakersCalculator: {
    prefilledFormula?: {
      flour: string;
      water: string;
      salt: string;
      starter: string;
      name?: string;
    };
  } | undefined;
  HydrationCalculator: undefined;
  TimelineCalculator: undefined;
  ScalingCalculator: undefined;
  TemperatureCalculator: undefined;
  LevainBuilder: undefined;
  StarterPercentageCalculator: undefined;
  PrefermentCalculator: undefined;
  DoughWeightCalculator: undefined;
  RecipeRescueCalculator: undefined;
  FlourBlendCalculator: undefined;
  PhotoRescue: undefined;
  DiagnosisResult: {
    diagnosis: import('../types/photoRescue').PhotoRescueDiagnosis;
    imageUri?: string;
    isQuickRescue?: boolean;
  };
  BakeDayCopilot: {
    diagnosis?: import('../types/photoRescue').PhotoRescueDiagnosis;
  };
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
  HelpFaq: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

// Tab param list
export type MainTabParamList = {
  HomeTab: undefined;
  ToolsTab: NavigatorScreenParams<ToolsStackParamList> | undefined;
  StartersTab: undefined;
  RecipesTab: undefined;
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
