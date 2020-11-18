import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '@pages/Login';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

export default AuthNavigator;
