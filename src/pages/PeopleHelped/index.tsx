import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import Button from '@components/Button';
import AppLoading from '@components/AppLoading';
import faker from 'faker';
import { AppColors, PersonHelped } from '../../types';

const PeopleHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); // carregando componente
  const [refreshing, setRefreshing] = useState<boolean>(false); // refresh na listagem de pessoas
  const [personHelpedList, setPersonHelpedList] = useState<PersonHelped[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    setPersonHelpedList(fakePersonHelpedList);
    setLoading(false);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    setTimeout(() => {
      setPersonHelpedList(fakePersonHelpedList);
      setRefreshing(false);
    }, 2000);
  };

  const onDeletePerson = async (id: number) => {
    /**
     *
     * @todo
     * requisição para deletar atividade
     *
     */

    const peopleHelpedList = personHelpedList.filter(person => person.id !== id);

    setPersonHelpedList(peopleHelpedList);
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
                <Text style={styles.personName} children={item.name} />
                <Text style={styles.personPhone} children={item.phone} />
                <Text style={styles.personLeader} children={`Líder: ${item.leader}`} />
              </View>
              <View style={styles.personActions}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
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
              <Button onPress={() => navigation.navigate('CreatePeopleHelpedStack')} title="ADICIONAR PESSOA" />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const fakePersonHelpedList: PersonHelped[] = [
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
  {
    id: faker.random.number(),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(2),
    leader: faker.name.findName(),
  },
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
