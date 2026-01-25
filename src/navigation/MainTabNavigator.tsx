/**
 * Main Tab Navigator
 * Bottom tabs for main app sections
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import type {
  HomeStackParamList,
  ToolsStackParamList,
  StartersStackParamList,
  RecipesStackParamList,
  ProfileStackParamList,
  MainTabParamList,
} from './types';

// Import screens
import HomeScreen from '../screens/Home/HomeScreen';
import ToolsScreen from '../screens/Tools/ToolsScreen';
import BakersCalculatorScreen from '../screens/Tools/BakersCalculatorScreen';
import HydrationCalculatorScreen from '../screens/Tools/HydrationCalculatorScreen';
import TimelineCalculatorScreen from '../screens/Tools/TimelineCalculatorScreen';
import ScalingCalculatorScreen from '../screens/Tools/ScalingCalculatorScreen';
import TemperatureCalculatorScreen from '../screens/Tools/TemperatureCalculatorScreen';
import LevainBuilderScreen from '../screens/Tools/LevainBuilderScreen';
import StarterPercentageCalculatorScreen from '../screens/Tools/StarterPercentageCalculatorScreen';
import PrefermentCalculatorScreen from '../screens/Tools/PrefermentCalculatorScreen';
import DoughWeightCalculatorScreen from '../screens/Tools/DoughWeightCalculatorScreen';
import StartersScreen from '../screens/Starters/StartersScreen';
import StarterDetailScreen from '../screens/Starters/StarterDetailScreen';
import AddStarterScreen from '../screens/Starters/AddStarterScreen';
import EditStarterScreen from '../screens/Starters/EditStarterScreen';
import AddFeedingScreen from '../screens/Starters/AddFeedingScreen';
import RecipesScreen from '../screens/Recipes/RecipesScreen';
import RecipeDetailScreen from '../screens/Recipes/RecipeDetailScreen';
import AddRecipeScreen from '../screens/Recipes/AddRecipeScreen';
import EditRecipeScreen from '../screens/Recipes/EditRecipeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const ToolsStackNav = createNativeStackNavigator<ToolsStackParamList>();
const StartersStackNav = createNativeStackNavigator<StartersStackParamList>();
const RecipesStackNav = createNativeStackNavigator<RecipesStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();

// Stack navigators for each tab
function HomeStack() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'SourdoughSuite' }}
      />
    </HomeStackNav.Navigator>
  );
}

function ToolsStack() {
  return (
    <ToolsStackNav.Navigator>
      <ToolsStackNav.Screen
        name="ToolsList"
        component={ToolsScreen}
        options={{ title: 'Calculators & Tools' }}
      />
      <ToolsStackNav.Screen
        name="BakersCalculator"
        component={BakersCalculatorScreen}
        options={{ title: "Baker's Percentage" }}
      />
      <ToolsStackNav.Screen
        name="HydrationCalculator"
        component={HydrationCalculatorScreen}
        options={{ title: 'Hydration Calculator' }}
      />
      <ToolsStackNav.Screen
        name="TimelineCalculator"
        component={TimelineCalculatorScreen}
        options={{ title: 'Timeline Calculator' }}
      />
      <ToolsStackNav.Screen
        name="ScalingCalculator"
        component={ScalingCalculatorScreen}
        options={{ title: 'Recipe Scaler' }}
      />
      <ToolsStackNav.Screen
        name="TemperatureCalculator"
        component={TemperatureCalculatorScreen}
        options={{ title: 'Temperature Calculator' }}
      />
      <ToolsStackNav.Screen
        name="LevainBuilder"
        component={LevainBuilderScreen}
        options={{ title: 'Levain Builder' }}
      />
      <ToolsStackNav.Screen
        name="StarterPercentageCalculator"
        component={StarterPercentageCalculatorScreen}
        options={{ title: 'Starter Percentage Calculator' }}
      />
      <ToolsStackNav.Screen
        name="PrefermentCalculator"
        component={PrefermentCalculatorScreen}
        options={{ title: 'Preferment Calculator' }}
      />
      <ToolsStackNav.Screen
        name="DoughWeightCalculator"
        component={DoughWeightCalculatorScreen}
        options={{ title: 'Dough Weight Calculator' }}
      />
    </ToolsStackNav.Navigator>
  );
}

function StartersStack() {
  return (
    <StartersStackNav.Navigator>
      <StartersStackNav.Screen
        name="StartersList"
        component={StartersScreen}
        options={{ title: 'My Starters' }}
      />
      <StartersStackNav.Screen
        name="StarterDetail"
        component={StarterDetailScreen}
        options={{ title: 'Starter Details' }}
      />
      <StartersStackNav.Screen
        name="AddStarter"
        component={AddStarterScreen}
        options={{ title: 'Add Starter' }}
      />
      <StartersStackNav.Screen
        name="EditStarter"
        component={EditStarterScreen}
        options={{ title: 'Edit Starter' }}
      />
      <StartersStackNav.Screen
        name="AddFeeding"
        component={AddFeedingScreen}
        options={{ title: 'Log Feeding' }}
      />
    </StartersStackNav.Navigator>
  );
}

function RecipesStack() {
  return (
    <RecipesStackNav.Navigator>
      <RecipesStackNav.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{ title: 'Recipes' }}
      />
      <RecipesStackNav.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe Details' }}
      />
      <RecipesStackNav.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{ title: 'Add Recipe' }}
      />
      <RecipesStackNav.Screen
        name="EditRecipe"
        component={EditRecipeScreen}
        options={{ title: 'Edit Recipe' }}
      />
    </RecipesStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </ProfileStackNav.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ToolsTab':
              iconName = focused ? 'calculator' : 'calculator-variant-outline';
              break;
            case 'StartersTab':
              iconName = focused ? 'bacteria' : 'bacteria-outline';
              break;
            case 'RecipesTab':
              iconName = focused ? 'book-open-variant' : 'book-open-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={focused ? 26 : 24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.text.disabled,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border.light,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          ...theme.shadows.sm,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="ToolsTab"
        component={ToolsStack}
        options={{ title: 'Tools' }}
      />
      <Tab.Screen
        name="StartersTab"
        component={StartersStack}
        options={{ title: 'Starters' }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStack}
        options={{ title: 'Recipes' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
