import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/hooks/Auth';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/routes/';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <AuthProvider>
          <Navigator />
        </AuthProvider>
      </NavigationContainer>
    </>
  );
}
