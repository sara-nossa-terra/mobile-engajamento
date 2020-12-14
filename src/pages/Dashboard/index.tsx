import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { Feather as Icon } from '@expo/vector-icons';
import AppLoading from '@components/AppLoading';
import Card from '@components/Form';
import { Activity, AppColors } from '../../types';
import faker from 'faker';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activityList, setActivityList] = useState<Activity[]>(() => {
    const fakerActivityList: Activity[] = [];

    let counter = 0;
    do {
      fakerActivityList.push({
        id: faker.random.number(),
        dt_dia: String(faker.date.recent()),
        tx_nome: faker.name.findName(),
      });

      counter++;
    } while (counter <= 5);

    return fakerActivityList;
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
  }, []);

  const onRefresh = () => {};

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seja bem vindo(a), líder!</Text>
        <Text style={styles.headerSubtitle}>Tente sempre manter as atividades atualizadas.</Text>
      </View>

      <Card
        title="ATIVIDADES"
        style={{ borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }}
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
      >
        <FlatList
          data={activityList}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.activity}>
              <View style={styles.activityNameContainer}>
                <Text style={styles.activityName}>{item.tx_nome} </Text>
              </View>
              <TouchableOpacity onPress={() => {}} style={styles.activityIcon}>
                <Icon name="chevron-right" size={30} color={AppColors.BLUE} />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <Divider />} // renderizado entre cada componente (cada atividade)
        />
      </Card>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BLUE,
  },

  // header acima da listagem de atividades
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
    marginTop: '2%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Montserrat_medium',
    fontSize: 16,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_light_italic',
    fontSize: 12,
  },

  // atividades
  activity: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingVertical: 11,
  },
  activityNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  activityName: {
    fontFamily: 'Montserrat_extra_bold',
    color: AppColors.BLUE,
    flexWrap: 'wrap',
  },
  activityIcon: {
    justifyContent: 'center',
  },
});
