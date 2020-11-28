import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Dashboard from '@pages/Dashboard';
import ActivityManage from '@pages/Activity';
import PeopleHelpedManage from '@pages/PeopleHelped';
import CreateLeader from '@pages/Leader/createLeader';
import CreateActivity from '@pages/Activity/createActivity';
import CreatePeopleHelped from '@pages/PeopleHelped/createPeopleHelped';
import MenuHamburguer from '@components/MenuHamburguer';
import MenuLogout from '@components/MenuLogOut';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const stackScreenOptions: StackNavigationOptions = {
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: '#fff',
    fontFamily: 'Montserrat_semi_bold',
    fontSize: 16,
  },
  headerStyle: {
    backgroundColor: '#3b8ea5',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // rem
  },
  headerBackTitleStyle: {
    color: '#fff',
  },
};

const DashboardStackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="DashboardStack"
      component={Dashboard}
      options={{
        title: 'Arregimentação',
        headerLeft: () => <MenuHamburguer />,
        headerRight: () => <MenuLogout />,
      }}
    />
  </Stack.Navigator>
);

const LeaderStackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="CreateLeaderStack"
      component={CreateLeader}
      options={{
        title: 'Cadastrar atividade',
        headerLeft: () => <MenuHamburguer />,
        headerRight: () => <MenuLogout />,
      }}
    />
  </Stack.Navigator>
);

const ActivityNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="ActivityManageStack"
      component={ActivityManage}
      options={{
        title: 'Atividades',
        headerLeft: () => <MenuHamburguer />,
        headerRight: () => <MenuLogout />,
      }}
    />
    <Stack.Screen
      name="CreateActivityStack"
      component={CreateActivity}
      options={{ title: 'Cadastrar atividade', headerRight: () => <MenuLogout /> }}
    />
  </Stack.Navigator>
);

const PeopleHelpedNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="PeopleHelpedManageStack"
      options={{
        title: 'Pessoas ajudadas',
        headerLeft: () => <MenuHamburguer />,
        headerRight: () => <MenuLogout />,
      }}
      component={PeopleHelpedManage}
    />

    <Stack.Screen
      name="CreatePeopleHelpedStack"
      component={CreatePeopleHelped}
      options={{ title: 'Cadastrar pessoas', headerRight: () => <MenuLogout /> }}
    />
  </Stack.Navigator>
);

/**
 *
 * Este é o componente principal que renderiza as telas.
 *
 * Como foi usado dois tipos de navegação (Stack e Drawer), foi preciso criar toda
 * lógica acima para cada tela ter um "header menu"
 *
 */
const AppNavigator: React.FC = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Dashboard" component={DashboardStackNavigator} options={{ title: 'Dashboard' }} />
    <Drawer.Screen name="Leader" component={LeaderStackNavigator} options={{ title: 'Líderes' }} />
    <Drawer.Screen name="Activity" component={ActivityNavigator} options={{ title: 'Atividades' }} />
    <Drawer.Screen name="PeopleHelped" component={PeopleHelpedNavigator} options={{ title: 'Pessoas Ajudadas' }} />
  </Drawer.Navigator>
);

export default AppNavigator;
