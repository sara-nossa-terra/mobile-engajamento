import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Navigation from './src/routes/Navigation'

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Navigation />
    </>
  );
}