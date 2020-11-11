import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppProvider from './src/hooks/index';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Navigator from './src/routes/index';

export default function App() {
  useEffect(() => {
    async function loadRobotoFont() {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
    }

    loadRobotoFont();
  }, []);

  return (
    <NavigationContainer>
      <AppProvider>
        <StatusBar style="auto" />
        <Navigator />
      </AppProvider>
    </NavigationContainer>
  );
}
