/**
 * Main App Navigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import type {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  ToolsStackParamList,
  StartersStackParamList,
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
import InoculationCalculatorScreen from '../screens/Tools/InoculationCalculatorScreen';
import PrefermentCalculatorScreen from '../screens/Tools/PrefermentCalculatorScreen';
import DoughWeightCalculatorScreen from '../screens/Tools/DoughWeightCalculatorScreen';
import StartersScreen from '../screens/Starters/StartersScreen';
import StarterDetailScreen from '../screens/Starters/StarterDetailScreen';
import AddStarterScreen from '../screens/Starters/AddStarterScreen';
import EditStarterScreen from '../screens/Starters/EditStarterScreen';
import AddFeedingScreen from '../screens/Starters/AddFeedingScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const ToolsStackNav = createNativeStackNavigator<ToolsStackParamList>();
const StartersStackNav = createNativeStackNavigator<StartersStackParamList>();

function HomeStack() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Sourdough Suite' }}
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
        options={{ title: 'Calculators' }}
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
        name="InoculationCalculator"
        component={InoculationCalculatorScreen}
        options={{ title: 'Inoculation Calculator' }}
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

function MainTabNavigator() {
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
        options={{ title: 'Calculators' }}
      />
      <Tab.Screen
        name="StartersTab"
        component={StartersStack}
        options={{ title: 'Starters' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
