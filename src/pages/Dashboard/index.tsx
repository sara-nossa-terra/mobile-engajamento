import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, Divider, Portal } from 'react-native-paper';
import { useAuth } from '@hooks/Auth';
import { Feather as Icon } from '@expo/vector-icons';
import AppLoading from '@components/AppLoading';
import Card from '@components/Form';
import SwipeablePanel from '@components/SwipeablePanel';
import Toast from '@components/Toast';
import { Activity, AppColors, PersonHelped } from '../../types';
import api from '@services/Api';

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [openPanel, setOpenPanel] = useState<boolean>(false);
  const [activitySelected, setActivitySelected] = useState<Activity>({} as Activity);
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [personHelpedList, setPersonHelpedList] = useState<PersonHelped[]>([]);
  const [loadingPersonHelpedList, setLoadingPersonHelpedList] = useState<boolean>(false);
  const [errorShowActivityToastVisible, setErrorShowActivityToastVisible] = useState<boolean>(false);

  const auth = useAuth();

  useEffect(() => {
    api
      .get('/v1/activities')
      .then(response => {
        const data = response.data.data as Activity[];
        setActivityList(data);
      })
      .catch(() => {
        setActivityList([]);
        setErrorShowActivityToastVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // mostra o toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowActivityToastVisible) {
        setErrorShowActivityToastVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowActivityToastVisible]);

  const onRefresh = () => {
    setRefreshing(true);
    api
      .get('/v1/activities')
      .then(response => {
        const data = response.data.data as Activity[];
        setActivityList(data);
      })
      .catch(() => {
        setActivityList([]);
        setErrorShowActivityToastVisible(true);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onSelectActivity = (activity: Activity) => {
    setActivitySelected(activity);
    setLoadingPersonHelpedList(true);
    setOpenPanel(true);

    api
      .get(`/v1/helpedPersons/leader/${auth.user.id}`)
      .then(response => {
        const data = response.data.data as PersonHelped[];

        setPersonHelpedList(data);
        setLoadingPersonHelpedList(false);
      })
      .catch(() => {
        setOpenPanel(false);
      });
  };

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
              <TouchableOpacity onPress={() => onSelectActivity(item)} style={styles.activityIcon}>
                <Icon name="chevron-right" size={30} color={AppColors.BLUE} />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={Divider} // renderizado entre cada componente (cada atividade)
        />
      </Card>
      <SwipeablePanel
        loading={loadingPersonHelpedList}
        personHelpedList={personHelpedList}
        activity={activitySelected}
        active={openPanel}
        onClose={() => setOpenPanel(false)}
      />

      <Toast
        onDismiss={() => setErrorShowActivityToastVisible(false)}
        visible={errorShowActivityToastVisible}
        icon="x"
        title="Não foi possível mostrar as atividades"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.BLUE },

  // header acima da listagem de atividades
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
    marginTop: '2%',
    justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: 'Montserrat_medium', fontSize: 16, marginBottom: 5 },
  headerSubtitle: { fontFamily: 'Montserrat_light_italic', fontSize: 12 },

  // atividades
  activity: { flexDirection: 'row', paddingHorizontal: 28, paddingVertical: 11 },
  activityNameContainer: { flex: 1, justifyContent: 'center' },
  activityName: { fontFamily: 'Montserrat_extra_bold', color: AppColors.BLUE, flexWrap: 'wrap' },
  activityIcon: { justifyContent: 'center' },
});
