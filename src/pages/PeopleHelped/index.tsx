import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import Button from '@components/Button';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import api from '@services/Api';
import { AppColors, PersonHelped } from '../../types';

const PeopleHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); // carregando componente
  const [refreshing, setRefreshing] = useState<boolean>(false); // refresh na listagem de pessoas
  const [personHelpedList, setPersonHelpedList] = useState<PersonHelped[]>([]);

  const [deletePersonHelpedToastVisible, setDeletePersonHelpedToastVisible] = useState<boolean>(false);
  const [errorShowPeopleHelpedToastVisible, setErrorShowPeopleHelpedToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    api
      .get('/v1/helpedPersons')
      .then(response => {
        const data = response.data.data as PersonHelped[];
        setPersonHelpedList(data);
      })
      .catch(e => {
        setPersonHelpedList([]);
        setErrorShowPeopleHelpedToastVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // mostra toast de exclusão de pessoas ajudadas  por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (deletePersonHelpedToastVisible) {
        setDeletePersonHelpedToastVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [deletePersonHelpedToastVisible]);

  // mostra toast de erro ao mostrar pessoas por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowPeopleHelpedToastVisible) {
        setErrorShowPeopleHelpedToastVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowPeopleHelpedToastVisible]);

  // atualizar lista pessoas ajudadas
  const onRefresh = async () => {
    setRefreshing(true);

    api
      .get('/v1/helpedPersons')
      .then(response => {
        const data = response.data.data as PersonHelped[];
        setPersonHelpedList(data);
      })
      .catch(() => {
        setPersonHelpedList([]);
        setErrorShowPeopleHelpedToastVisible(true);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  // exclusão de pessoa ajudada
  const onDeletePerson = async (id: number) => {
    api
      .delete(`/v1/helpedPersons/${id}`)
      .then(() => {
        const peopleHelpedList = personHelpedList.filter(person => person.id !== id);
        setPersonHelpedList(peopleHelpedList);

        // mostra toast de exclusão por 5 segundos
        setDeletePersonHelpedToastVisible(true);
      })
      .catch(() => {
        setDeletePersonHelpedToastVisible(true);
      });
  };

  const onUpdatePersonHelped = (personId: number) => {
    if (!personId) return;
    navigation.navigate('EditPersonHelpedStack', { personId });
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FlatList
          data={personHelpedList}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={() => (
            <React.Fragment>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>GERENCIAR PESSOAS AJUDADAS</Text>
              </View>
              <Divider />
            </React.Fragment>
          )}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.personHelpedContainer}>
              <View style={styles.personInfo}>
                <Text style={styles.personName} children={item.tx_nome} />
                <Text style={styles.personPhone} children={`(${item.nu_ddd}) ${item.nu_telefone}`} />

                {item.lider_id && <Text style={styles.personLeader} children={`Líder: ${item.lider_id.tx_nome}`} />}
              </View>
              <View style={styles.personActions}>
                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => onUpdatePersonHelped(item.id)}
                >
                  <Icon
                    style={[styles.personIcon, { backgroundColor: AppColors.GREEN }]}
                    name="edit"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => onDeletePerson(item.id)}
                >
                  <Icon
                    style={[styles.personIcon, { backgroundColor: AppColors.RED }]}
                    name="trash-2"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <Divider />} // renderizado entre cada componente (cada pessoa ajudada)
          ListFooterComponent={() => (
            <View style={styles.buttonContainer}>
              <Button onPress={() => navigation.navigate('CreatePersonHelpedStack')} title="ADICIONAR PESSOA" />
            </View>
          )}
        />
      </View>

      <Toast
        title="PESSOA EXCLUÍDA"
        onDismiss={() => setDeletePersonHelpedToastVisible(false)}
        backgroundColor={AppColors.YELLOW}
        iconColor={AppColors.YELLOW}
        icon="trash-2"
        visible={deletePersonHelpedToastVisible}
      />

      <Toast
        title="Não foi possível mostrar as pessoas ajudadas"
        onDismiss={() => setErrorShowPeopleHelpedToastVisible(false)}
        backgroundColor={AppColors.RED}
        iconColor={AppColors.RED}
        icon="x"
        visible={errorShowPeopleHelpedToastVisible}
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

  // person helped styles
  personHelpedContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  personInfo: {
    flex: 1,
  },
  personActions: {
    flexDirection: 'row',
  },
  personIcon: {
    borderRadius: 5,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  personName: {
    fontFamily: 'Montserrat_extra_bold',
    fontSize: 12,
  },
  personPhone: {
    fontFamily: 'Montserrat_medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  personLeader: {
    fontFamily: 'Montserrat_extra_bold',
    fontSize: 12,
  },
  buttonContainer: {
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PeopleHelped;
