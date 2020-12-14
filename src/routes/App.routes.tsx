import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { Feather as Icon } from '@expo/vector-icons';
import MenuHamburguer from '@components/MenuHamburguer';
import MenuLogout from '@components/MenuLogOut';
import { useAuth } from '@hooks/Auth';
import { AppColors } from '../types';

// pages
import Dashboard from '@pages/Dashboard';
import DashboardListPeopleHelped from '@pages/Dashboard/listPeopleHelped';
import ActivityManage from '@pages/Activity';
import PeopleHelpedManage from '@pages/PeopleHelped';
import LeaderManage from '@pages/Leader';
import CreateLeader from '@pages/Leader/createLeader';
import CreateActivity from '@pages/Activity/createActivity';
import CreatePersonHelped from '@pages/PeopleHelped/createPersonHelped';
import EditActivity from '@pages/Activity/editActivity';
import EditPersonHelped from '@pages/PeopleHelped/editPersonHelped';
import EditLeader from '@pages/Leader/editLeader';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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

    <Stack.Screen
      name="DashboardListPeopleHelpedStack"
      component={DashboardListPeopleHelped}
      options={{
        title: 'Pessoas',
        headerRight: () => <MenuLogout />,
      }}
    />
  </Stack.Navigator>
);

const LeaderStackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="LeaderManageStack"
      component={LeaderManage}
      options={{
        title: 'Líderes',
        headerLeft: () => <MenuHamburguer />,
        headerRight: () => <MenuLogout />,
      }}
    />

    <Stack.Screen
      name="CreateLeaderStack"
      component={CreateLeader}
      options={{
        title: 'Cadastrar líderes',
        headerRight: () => <MenuLogout />,
      }}
    />

    <Stack.Screen
      name="EditLeaderStack"
      component={EditLeader}
      options={{
        title: 'Editar líder',
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

    <Stack.Screen
      name="EditActivityStack"
      component={EditActivity}
      options={{ title: 'Editar atividade', headerRight: () => <MenuLogout /> }}
    />
  </Stack.Navigator>
);

const PeopleHelpedNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="PeopleHelpedManageStack"
      component={PeopleHelpedManage}
      options={{
        title: 'Pessoas ajudadas',
        headerLeft: () => <MenuHamburguer />,
        headerRight: () => <MenuLogout />,
      }}
    />

    <Stack.Screen
      name="CreatePersonHelpedStack"
      component={CreatePersonHelped}
      options={{ title: 'Cadastrar pessoas', headerRight: () => <MenuLogout /> }}
    />

    <Stack.Screen
      name="EditPersonHelpedStack"
      component={EditPersonHelped}
      options={{ title: 'Editar pessoa', headerRight: () => <MenuLogout /> }}
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
const AppNavigator: React.FC = () => {
  const { logOut } = useAuth();

  return (
    <Drawer.Navigator
      keyboardDismissMode="on-drag"
      // estilização do header, footer e content do menu drawer
      drawerContent={props => (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
          <View>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerHeaderText}>Menu</Text>
            </View>
            <Divider style={{ marginBottom: 16 }} />
            <DrawerItemList {...props} />
          </View>

          <View>
            <TouchableOpacity onPress={logOut} activeOpacity={0.1}>
              <Text style={styles.drawerLogout}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{
          drawerIcon: () => <DrawerLabel title="INICIAL" icon="home" color={AppColors.BLUE} />,
        }}
      />

      <Drawer.Screen
        name="Leader"
        component={LeaderStackNavigator}
        options={{
          drawerIcon: () => <DrawerLabel title="LÍDERES" icon="user" color={AppColors.BLUE} />,
        }}
      />

      <Drawer.Screen
        name="PeopleHelped"
        component={PeopleHelpedNavigator}
        options={{
          drawerIcon: () => <DrawerLabel title="PESSOAS AJUDADAS" icon="users" color={AppColors.BLUE} />,
        }}
      />

      <Drawer.Screen
        name="Activity"
        component={ActivityNavigator}
        options={{
          drawerIcon: () => <DrawerLabel title="ATIVIDADES" icon="plus-square" color={AppColors.BLUE} />,
        }}
      />
    </Drawer.Navigator>
  );
};

/**
 *
 * Drawer Label
 *
 * Label estilado do menu drawer (cada item do menu e tal do drawer)
 *
 * title => nome do menu
 * icon => icone do menu
 *
 */

const DrawerLabel: React.FC<{ color: string; focused?: boolean; title: string; icon: string }> = ({
  color = AppColors.BLUE,
  title,
  icon,
}) => (
  <View style={styles.drawerItem}>
    <Icon name={icon} size={20} color={color} />
    <Text style={[styles.drawerItemText, { color }]}>{title}</Text>
    <Icon name="chevron-right" size={20} color={color} />
  </View>
);

// estilização header do stack navigator
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

const styles = StyleSheet.create({
  // header menu drawer
  drawerHeader: {
    padding: 17,
  },
  drawerHeaderText: {
    fontSize: 14,
    fontFamily: 'Montserrat_extra_bold',
  },

  drawerContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },

  // item menu drawer
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemText: {
    fontFamily: 'Montserrat_extra_bold',
    fontSize: 12,
    flex: 1,
    paddingLeft: 15,
  },

  // logout
  drawerLogout: {
    fontSize: 14,
    color: AppColors.BLUE,
    textAlign: 'center',
    fontFamily: 'Montserrat_extra_bold',
    padding: 16,
  },
});

export default AppNavigator;
