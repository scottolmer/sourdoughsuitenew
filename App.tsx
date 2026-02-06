/**
 * SourdoughSuite Mobile App
 * Main entry point with navigation
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryProvider } from './src/providers/QueryProvider';
import { AuthProvider } from './src/hooks/useAuth';
import MainTabNavigator from './src/navigation/MainTabNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
