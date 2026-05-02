/**
 * Main Tab Navigator
 * Bottom tabs for main app sections
 */

import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MaterialCommunityIconName } from '../types/icons';
import type {
  HomeStackParamList,
  ToolsStackParamList,
  StartersStackParamList,
  RecipesStackParamList,
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
import RecipeRescueCalculatorScreen from '../screens/Tools/RecipeRescueCalculatorScreen';
import FlourBlendCalculatorScreen from '../screens/Tools/FlourBlendCalculatorScreen';
import PhotoRescueScreen from '../screens/Tools/PhotoRescueScreen';
import DiagnosisResultScreen from '../screens/Tools/DiagnosisResultScreen';
import BakeDayCopilotScreen from '../screens/Tools/BakeDayCopilotScreen';
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
import HelpFaqScreen from '../screens/Profile/HelpFaqScreen';
import AboutScreen from '../screens/Profile/AboutScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/Profile/TermsOfServiceScreen';
import LearnScreen from '../screens/Learn/LearnScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const ToolsStackNav = createNativeStackNavigator<ToolsStackParamList>();
const StartersStackNav = createNativeStackNavigator<StartersStackParamList>();
const RecipesStackNav = createNativeStackNavigator<RecipesStackParamList>();

const modernistHeaderOptions = {
  headerShown: false,
  headerStyle: { backgroundColor: theme.colors.modernist.paper },
  headerTintColor: theme.colors.modernist.ink,
  headerTitleStyle: {
    fontFamily: theme.typography.roles.body,
    fontSize: 17,
    color: theme.colors.modernist.ink,
  },
  headerShadowVisible: false,
};

const safeTopStyle = { flex: 1, backgroundColor: theme.colors.modernist.paper } as const;
const safeTopInner = { flex: 1, paddingTop: theme.spacing.xs } as const;
const withSafeTop = (Comp: React.ComponentType<any>) => {
  const Wrapped = (props: any) => (
    <SafeAreaView edges={['top']} style={safeTopStyle}>
      <View style={safeTopInner}>
        <Comp {...props} />
      </View>
    </SafeAreaView>
  );
  Wrapped.displayName = `SafeTop(${Comp.displayName || Comp.name || 'Component'})`;
  return Wrapped;
};

// Pre-create all wrapped components at module scope so their identity
// stays stable across renders — inline calls create new types each render
// which causes React Navigation to unmount/remount screens on mobile.
const SafeLearnScreen = withSafeTop(LearnScreen);
const SafeToolsScreen = withSafeTop(ToolsScreen);
const SafeBakersCalculatorScreen = withSafeTop(BakersCalculatorScreen);
const SafeHydrationCalculatorScreen = withSafeTop(HydrationCalculatorScreen);
const SafeTimelineCalculatorScreen = withSafeTop(TimelineCalculatorScreen);
const SafeScalingCalculatorScreen = withSafeTop(ScalingCalculatorScreen);
const SafeTemperatureCalculatorScreen = withSafeTop(TemperatureCalculatorScreen);
const SafeLevainBuilderScreen = withSafeTop(LevainBuilderScreen);
const SafeStarterPercentageCalculatorScreen = withSafeTop(StarterPercentageCalculatorScreen);
const SafePrefermentCalculatorScreen = withSafeTop(PrefermentCalculatorScreen);
const SafeDoughWeightCalculatorScreen = withSafeTop(DoughWeightCalculatorScreen);
const SafeRecipeRescueCalculatorScreen = withSafeTop(RecipeRescueCalculatorScreen);
const SafeFlourBlendCalculatorScreen = withSafeTop(FlourBlendCalculatorScreen);
const SafeStartersScreen = withSafeTop(StartersScreen);
const SafeStarterDetailScreen = withSafeTop(StarterDetailScreen);
const SafeAddStarterScreen = withSafeTop(AddStarterScreen);
const SafeEditStarterScreen = withSafeTop(EditStarterScreen);
const SafeAddFeedingScreen = withSafeTop(AddFeedingScreen);
const SafeRecipesScreen = withSafeTop(RecipesScreen);
const SafeRecipeDetailScreen = withSafeTop(RecipeDetailScreen);
const SafeAddRecipeScreen = withSafeTop(AddRecipeScreen);
const SafeEditRecipeScreen = withSafeTop(EditRecipeScreen);
const SafeProfileScreen = withSafeTop(ProfileScreen);
const SafeHelpFaqScreen = withSafeTop(HelpFaqScreen);
const SafeAboutScreen = withSafeTop(AboutScreen);
const SafePrivacyPolicyScreen = withSafeTop(PrivacyPolicyScreen);
const SafeTermsOfServiceScreen = withSafeTop(TermsOfServiceScreen);

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={modernistHeaderOptions}>
      <HomeStackNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStackNav.Screen
        name="Learn"
        component={SafeLearnScreen}
        options={{ title: 'Sourdough Academy' }}
      />
      <HomeStackNav.Screen
        name="Profile"
        component={SafeProfileScreen}
        options={{ title: 'Profile' }}
      />
      <HomeStackNav.Screen
        name="HelpFaq"
        component={SafeHelpFaqScreen}
        options={{ title: 'Help & FAQ' }}
      />
      <HomeStackNav.Screen
        name="About"
        component={SafeAboutScreen}
        options={{ title: 'About' }}
      />
      <HomeStackNav.Screen
        name="PrivacyPolicy"
        component={SafePrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <HomeStackNav.Screen
        name="TermsOfService"
        component={SafeTermsOfServiceScreen}
        options={{ title: 'Terms of Service' }}
      />
    </HomeStackNav.Navigator>
  );
}

function ToolsStack() {
  return (
    <ToolsStackNav.Navigator screenOptions={modernistHeaderOptions}>
      <ToolsStackNav.Screen
        name="ToolsList"
        component={SafeToolsScreen}
        options={{ title: 'Calculators & Tools' }}
      />
      <ToolsStackNav.Screen
        name="BakersCalculator"
        component={SafeBakersCalculatorScreen}
        options={{ title: "Baker's Percentage" }}
      />
      <ToolsStackNav.Screen
        name="HydrationCalculator"
        component={SafeHydrationCalculatorScreen}
        options={{ title: 'Hydration Calculator' }}
      />
      <ToolsStackNav.Screen
        name="TimelineCalculator"
        component={SafeTimelineCalculatorScreen}
        options={{ title: 'Timeline Calculator' }}
      />
      <ToolsStackNav.Screen
        name="ScalingCalculator"
        component={SafeScalingCalculatorScreen}
        options={{ title: 'Recipe Scaler' }}
      />
      <ToolsStackNav.Screen
        name="TemperatureCalculator"
        component={SafeTemperatureCalculatorScreen}
        options={{ title: 'Temperature Calculator' }}
      />
      <ToolsStackNav.Screen
        name="LevainBuilder"
        component={SafeLevainBuilderScreen}
        options={{ title: 'Levain Builder' }}
      />
      <ToolsStackNav.Screen
        name="StarterPercentageCalculator"
        component={SafeStarterPercentageCalculatorScreen}
        options={{ title: 'Starter Percentage Calculator' }}
      />
      <ToolsStackNav.Screen
        name="PrefermentCalculator"
        component={SafePrefermentCalculatorScreen}
        options={{ title: 'Preferment Calculator' }}
      />
      <ToolsStackNav.Screen
        name="DoughWeightCalculator"
        component={SafeDoughWeightCalculatorScreen}
        options={{ title: 'Dough Weight Calculator' }}
      />
      <ToolsStackNav.Screen
        name="RecipeRescueCalculator"
        component={SafeRecipeRescueCalculatorScreen}
        options={{ title: 'Recipe Rescue Calculator' }}
      />
      <ToolsStackNav.Screen
        name="FlourBlendCalculator"
        component={SafeFlourBlendCalculatorScreen}
        options={{ title: 'Flour Blend Calculator' }}
      />
      <ToolsStackNav.Screen
        name="PhotoRescue"
        component={PhotoRescueScreen}
        options={{ title: 'Photo Rescue' }}
      />
      <ToolsStackNav.Screen
        name="DiagnosisResult"
        component={DiagnosisResultScreen}
        options={{ title: 'Diagnosis Result' }}
      />
      <ToolsStackNav.Screen
        name="BakeDayCopilot"
        component={BakeDayCopilotScreen}
        options={{ title: 'Bake Day Copilot' }}
      />
    </ToolsStackNav.Navigator>
  );
}

function StartersStack() {
  return (
    <StartersStackNav.Navigator screenOptions={modernistHeaderOptions}>
      <StartersStackNav.Screen
        name="StartersList"
        component={SafeStartersScreen}
        options={{ title: 'My Starters' }}
      />
      <StartersStackNav.Screen
        name="StarterDetail"
        component={SafeStarterDetailScreen}
        options={{ title: 'Starter Details' }}
      />
      <StartersStackNav.Screen
        name="AddStarter"
        component={SafeAddStarterScreen}
        options={{ title: 'Add Starter' }}
      />
      <StartersStackNav.Screen
        name="EditStarter"
        component={SafeEditStarterScreen}
        options={{ title: 'Edit Starter' }}
      />
      <StartersStackNav.Screen
        name="AddFeeding"
        component={SafeAddFeedingScreen}
        options={{ title: 'Log Feeding' }}
      />
    </StartersStackNav.Navigator>
  );
}

function RecipesStack() {
  return (
    <RecipesStackNav.Navigator screenOptions={modernistHeaderOptions}>
      <RecipesStackNav.Screen
        name="Recipes"
        component={SafeRecipesScreen}
        options={{ title: 'Recipes' }}
      />
      <RecipesStackNav.Screen
        name="RecipeDetail"
        component={SafeRecipeDetailScreen}
        options={{ title: 'Recipe Details' }}
      />
      <RecipesStackNav.Screen
        name="AddRecipe"
        component={SafeAddRecipeScreen}
        options={{ title: 'Add Recipe' }}
      />
      <RecipesStackNav.Screen
        name="EditRecipe"
        component={SafeEditRecipeScreen}
        options={{ title: 'Edit Recipe' }}
      />
    </RecipesStackNav.Navigator>
  );
}


export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: MaterialCommunityIconName;

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
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={focused ? 30 : 28} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.modernist.ruleTeal,
        tabBarInactiveTintColor: theme.colors.text.secondary, // Darker than disabled
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border.light,
          borderTopWidth: 1,
          paddingBottom: 32, // Increased spacing for standard devices
          paddingTop: 12,
          height: 96, // Increased height from 80
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
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: route.name }] })
            );
          },
        })}
      />
      <Tab.Screen
        name="ToolsTab"
        component={ToolsStack}
        options={{ title: 'Tools' }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: route.name }] })
            );
          },
        })}
      />
      <Tab.Screen
        name="StartersTab"
        component={StartersStack}
        options={{ title: 'Starters' }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: route.name }] })
            );
          },
        })}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStack}
        options={{ title: 'Recipes' }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: route.name }] })
            );
          },
        })}
      />
    </Tab.Navigator>
  );
}
