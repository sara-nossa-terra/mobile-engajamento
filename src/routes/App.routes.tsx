import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '@pages/Dashboard';

const Drawer = createDrawerNavigator();

const AppNavigator: React.FC = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Dashboard" component={Dashboard} />
  </Drawer.Navigator>
);

export default AppNavigator;
