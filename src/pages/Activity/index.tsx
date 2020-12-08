import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from 'native-base';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AppLoading from '@components/AppLoading';
import Button from '@components/Button';
import Toast from '@components/Toast';
import { Feather as Icon } from '@expo/vector-icons';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { Activity, AppColors } from '../../types';
import api from '@services/Api';
import { formatAmericanDatetimeToDate } from '@utils/formatAmericanDatetimeToDate';

const ActivityComponent: React.FC = () => {
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // carregando este componente
  const [refreshing, setRefreshing] = useState<boolean>(false); // refresh na listagem de atividades
  const [deleteToastVisible, setDeleteToastVisible] = useState<boolean>(false);
  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    api
      .get('/v1/activities')
      .then(response => {
        const data = response.data.data as Activity[];
        setActivityList(data);
      })
      .catch(err => {
        setActivityList([]);
        setErrorToastVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // mostra o toast de exclusão de atividades por 5 segs
  useEffect(() => {
    if (deleteToastVisible) {
      const timer = setTimeout(() => setDeleteToastVisible(false), 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [deleteToastVisible]);

  // mostra o toast de erro por 5 segs
  useEffect(() => {
    if (errorToastVisible) {
      const timer = setTimeout(() => setErrorToastVisible(false), 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [errorToastVisible]);

  // excluir atividade
  const onDeleteActivity = async (id: number) => {
    api
      .delete(`/v1/activities/${id}`)
      .then(() => {
        const newActivityList = activityList.filter(activity => activity.id !== id);

        setActivityList(newActivityList);
        setDeleteToastVisible(true);
      })
      .catch(() => {});
  };

  const onUpdateActivity = (activityId: number) => {
    if (!activityId) return;
    navigation.navigate('EditActivityStack', { activityId });
  };

  // ao atualizar a listagem de atividades
  const onRefresh = async () => {
    setRefreshing(true);

    api
      .get('/v1/activities')
      .then(response => {
        const data = response.data.data as Activity[];
        setActivityList(data);
      })
      .catch(err => {
        setActivityList([]);
        setErrorToastVisible(true);
      })
      .finally(() => {
        setRefreshing(false);
      });
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
                <Text style={styles.activityName} children={item.tx_nome} />
                <Text
                  style={styles.activityDate}
                  // @ts-ignore
                  children={format(formatAmericanDatetimeToDate(item.dt_dia), "EEEE '-' dd/MM", { locale: ptBR })}
                />
              </View>
              <View style={styles.activityActionsContainer}>
                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => onUpdateActivity(item.id)}
                >
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

      {/* Toast de exclusão de atividades */}
      <Toast
        onDismiss={() => setDeleteToastVisible(false)}
        visible={deleteToastVisible}
        icon="trash-2"
        title="Atividade excluída"
        iconColor={AppColors.YELLOW}
        backgroundColor={AppColors.YELLOW}
      />

      {/* Toast de erro ao mostrar atividades */}
      <Toast
        onDismiss={() => setErrorToastVisible(false)}
        visible={errorToastVisible}
        icon="x"
        title="Erro ao mostrar atividades"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
      />
    </View>
  );
};

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
