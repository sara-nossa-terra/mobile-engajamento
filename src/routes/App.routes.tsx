import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import Dashboard from '@pages/Dashboard';
import Leader from '@pages/Leader';
import CreateLeader from '@pages/Leader/createLeader';
import Activity from '@pages/Activity';
import CreateActivity from '@pages/Activity/createActivity';
import EditActivity from '@pages/Activity/editActivity';
import PeopleHelped from '@pages/PeopleHelped';
import CreatePeopleHelped from '@pages/PeopleHelped/createPeopleHelped';
import LifeReview from '@pages/LifeReview';
import CreateLifeReview from '@pages/LifeReview/createLifeReview';
import MenuHamburguer from '@components/MenuHamburguer';
import MenuLogout from '@components/MenuLogOut';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const stackScreenOptions: StackNavigationOptions = {
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: '#fff',
  },
  headerStyle: {
    backgroundColor: '#3b8ea5',
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
      name="LeaderStack"
      component={Leader}
      options={{ title: 'Líderes', headerLeft: () => <MenuHamburguer /> }}
    />
    <Stack.Screen
      name="CreateLeaderStack"
      component={CreateLeader}
      options={{ title: 'Cadastrar Líderes' }}
    />
  </Stack.Navigator>
);

const ActivityNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="ActivityStack"
      component={Activity}
      options={{
        title: 'Atividades',
        headerLeft: () => <MenuHamburguer />,
      }}
    />
    <Stack.Screen
      name="CreateActivityStack"
      component={CreateActivity}
      options={{ title: 'Cadastrar Atividades' }}
    />

    <Stack.Screen
      name="EditActivityStack"
      component={EditActivity}
      options={{ title: 'Editar Atividade' }}
    />
  </Stack.Navigator>
);

const PeopleHelpedNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="PeopleHelpedStack"
      component={PeopleHelped}
      options={{
        title: 'Pessoas Ajudadas',
        headerLeft: () => <MenuHamburguer />,
      }}
    />
    <Stack.Screen
      name="CreatePeopleHelpedStack"
      component={CreatePeopleHelped}
      options={{ title: 'Cadastrar Pessoas Ajudadas' }}
    />
  </Stack.Navigator>
);

const LifeReviewNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="LifeReviewStack"
      component={LifeReview}
      options={{
        title: 'Revisão de Vidas',
        headerLeft: () => <MenuHamburguer />,
      }}
    />
    <Stack.Screen
      name="CreateLifeReviewStack"
      component={CreateLifeReview}
      options={{ title: 'Cadastrar Revisão de Vidas' }}
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
    <Drawer.Screen
      name="Dashboard"
      component={DashboardStackNavigator}
      options={{ title: 'Dashboard' }}
    />

    <Drawer.Screen
      name="Leader"
      component={LeaderStackNavigator}
      options={{ title: 'Líderes' }}
    />

    <Drawer.Screen
      name="Activity"
      component={ActivityNavigator}
      options={{ title: 'Atividades' }}
    />

    <Drawer.Screen
      name="PeopleHelped"
      component={PeopleHelpedNavigator}
      options={{ title: 'Pessoas Ajudadas' }}
    />

    <Drawer.Screen
      name="LifeReview"
      component={LifeReviewNavigator}
      options={{ title: 'Revisão de Vidas' }}
    />
  </Drawer.Navigator>
);

export default AppNavigator;
