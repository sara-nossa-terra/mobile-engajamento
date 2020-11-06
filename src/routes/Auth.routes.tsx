import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '@pages/Login';
import CreateAccount from '@pages/Login/createAccount';
import ResetPassword from '@pages/Login/ResetPassword';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="CreateAccount" component={CreateAccount} />
  </Stack.Navigator>
);

export default AuthNavigator;
