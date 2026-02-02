/**
 * SourdoughSuite Mobile App
 * Main entry point with navigation and custom fonts
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryProvider } from './src/providers/QueryProvider';
import { AuthProvider } from './src/hooks/useAuth';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
          PlayfairDisplay_400Regular,
          PlayfairDisplay_700Bold,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Fallback to system fonts
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // Show loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e8942a" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <MainTabNavigator />
          </NavigationContainer>
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}

export default App;
