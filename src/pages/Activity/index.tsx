import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from 'native-base';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AppLoading from '@components/AppLoading';
import Button from '@components/Button';
import { Feather as Icon } from '@expo/vector-icons';
import { format } from 'date-fns';
import localePtBR from 'date-fns/locale/pt-BR';
import faker from 'faker';
import { Activity, AppColors } from '../../types';

const ActivityComponent: React.FC = () => {
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // carregando este componente
  const [refreshing, setRefreshing] = useState<boolean>(false); // refresh na listagem de atividades

  const navigation = useNavigation();

  useEffect(() => {
    setActivityList(fakeActivityList);
    setLoading(false);
  }, []);

  const onDeleteActivity = async (id: number) => {
    /**
     *
     * @todo
     * requisição para deletar atividade
     *
     */

    const newActivityList = activityList.filter(activity => activity.id !== id);

    setActivityList(newActivityList);
  };

  const onUpdateActivity = (id: number) => {
    // ao atualizar uma atividade
    /**
     *
     * @todo
     * redirecionar para a página de edição de atividade
     *
     */
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setActivityList(fakeActivityList);
      setRefreshing(false);
    }, 2000);
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FlatList
          data={activityList}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={() => (
            <React.Fragment>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>GERENCIAR ATIVIDADES</Text>
              </View>
              <Divider />
            </React.Fragment>
          )}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.activity}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName} children={item.name} />
                <Text
                  style={styles.activityDate}
                  children={format(new Date(item.day), "EEEE '-' dd/MM", {
                    locale: localePtBR,
                  })}
                />
              </View>
              <View style={styles.activityActionsContainer}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
                  <Icon
                    style={[styles.activityIcon, { backgroundColor: AppColors.GREEN }]}
                    name="edit"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => onDeleteActivity(item.id)}
                >
                  <Icon
                    style={[styles.activityIcon, { backgroundColor: AppColors.RED }]}
                    name="trash-2"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <Divider />} // renderizado entre cada componente (cada atividade)
          ListFooterComponent={() => (
            <View style={styles.buttonContainer}>
              <Button onPress={() => navigation.navigate('CreateActivityStack')} title="NOVA ATIVIDADE" />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const fakeActivityList = [
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
  { id: faker.random.number(), name: faker.random.word(), day: faker.date.recent() },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BLUE,
  },

  // card styles
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: '2%',
  },
  cardTitleContainer: {
    paddingHorizontal: '3%',
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_medium',
    paddingVertical: 15,
    paddingLeft: '3%',
  },
  cardContent: {
    paddingHorizontal: '3%',
    paddingTop: '1.5%',
  },

  // activity styles
  activity: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  activityInfo: {
    flex: 1,
  },
  activityActionsContainer: {
    flexDirection: 'row',
  },
  activityIcon: {
    borderRadius: 5,
    marginHorizontal: 4,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityName: {
    fontFamily: 'Montserrat_extra_bold',
    fontSize: 12,
  },
  activityDate: {
    fontFamily: 'Montserrat_medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityComponent;
