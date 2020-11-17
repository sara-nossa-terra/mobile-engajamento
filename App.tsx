import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppProvider from './src/hooks/index';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/routes/index';

export default function App() {
  return (
    <NavigationContainer>
      <AppProvider>
        <StatusBar style="auto" />
        <Navigator />
      </AppProvider>
    </NavigationContainer>
  );
}
