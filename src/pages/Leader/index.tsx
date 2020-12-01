import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import Button from '@components/Button';
import Toast from '@components/Toast';
import AppLoading from '@components/AppLoading';
import faker from 'faker';
import { AppColors, Leader } from '../../types';

const LeaderComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [leaderList, setLeaderList] = useState<Leader[]>([]);
  const [deleteLeaderToastVisible, setDeleteLeaderToastVisible] = useState<boolean>(false);

  useEffect(() => {
    setLeaderList(fakeLeaderList);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (deleteLeaderToastVisible) {
      const timer = setTimeout(() => setDeleteLeaderToastVisible(false), 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [deleteLeaderToastVisible]);

  const navigation = useNavigation();

  const onDeleteLeader = async (id: number) => {
    /**
     *
     * @todo
     *
     * requisitar exclusão no back
     *
     */

    const newLeaderList = leaderList.filter(leader => leader.id !== id);

    setLeaderList(newLeaderList);

    // mostra o toast de sucesso de exclusão por 5 segundos
    setDeleteLeaderToastVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    /**
     *
     * @todo
     *
     * requisistar lista de líderes novamente
     *
     */

    setTimeout(() => {
      setLeaderList(fakeLeaderList);
      setRefreshing(false);
    }, 2000);
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FlatList
          data={leaderList}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={() => (
            <React.Fragment>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>GERENCIAR LÍDERES</Text>
              </View>
              <Divider />
            </React.Fragment>
          )}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.leader}>
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName} children={item.name} />
                <Text style={styles.leaderPhone} children={item.phone} />
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => {}}>
                  <Icon
                    style={[styles.icon, { backgroundColor: AppColors.GREEN }]}
                    name="edit"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => onDeleteLeader(item.id)}
                >
                  <Icon
                    style={[styles.icon, { backgroundColor: AppColors.RED }]}
                    name="trash-2"
                    Component
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <Divider />} // renderizado entre cada componente (cada líder)
          ListFooterComponent={() => (
            <View style={styles.buttonContainer}>
              <Button onPress={() => navigation.navigate('CreateLeaderStack')} title="NOVO LÍDER" />
            </View>
          )}
        />
      </View>

      <Toast
        title="LÍDER EXCLUÍDO"
        icon="trash-2"
        backgroundColor={AppColors.YELLOW}
        iconColor={AppColors.YELLOW}
        onDismiss={() => setDeleteLeaderToastVisible(false)}
        visible={deleteLeaderToastVisible}
      />
    </View>
  );
};

const fakeLeaderList: Leader[] = [
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
  { id: faker.random.number(), name: faker.name.findName(), phone: faker.phone.phoneNumberFormat(1) },
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

  // leader Style

  leader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  leaderInfo: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    borderRadius: 5,
    marginHorizontal: 4,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderName: {
    fontFamily: 'Montserrat_extra_bold',
    fontSize: 12,
  },
  leaderPhone: {
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

export default LeaderComponent;
