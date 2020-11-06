import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppProvider from './src/hooks/index';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/routes/index';

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <NavigationContainer>
                <AppProvider>
                    <Navigator />
                </AppProvider>
            </NavigationContainer>
        </>
    );
}
