import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useAuth } from '@hooks/Auth';
import { Feather as Icon } from '@expo/vector-icons';
import AppLoading from '@components/AppLoading';
import Card from '@components/Form';
import Toast from '@components/Toast';
import Button from '@components/Button';
import DashboardActions from './DashboardActions';
import DashboardPeopleHelpedModal from './DashboardPeopleHelpedModal';
import { addWeeks, subWeeks } from 'date-fns';
import { Activity, AppColors, PersonHelped } from '../../types';
import api from '@services/Api';

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true); // loading page
  const [refreshing, setRefreshing] = useState<boolean>(false); // refresh atividades
  const [openPanel, setOpenPanel] = useState<boolean>(false); // painel de pessoas ajudadas
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

  const advanceWeek = () => {
    const nextWeek = addWeeks(date, 1);
    setDate(nextWeek);
  };

  const backWeek = () => {
    const lastWeek = subWeeks(date, 1);
    setDate(lastWeek);
  };

  const onPressThumbsUp = (personId: number) => {
    /**
     *
     * @todo
     * Requisitar thumbs up
     *
     */

    const newPersonHelpedList = personHelpedList.map(person => {
      if (person.id === personId) {
        person.thumbsup = true;
      }

      return person;
    });

    setPersonHelpedList(newPersonHelpedList);
  };

  const onPressThumbsDown = (personId: number) => {
    /**
     *
     * @todo
     * Requisistar thumbs down
     *
     */

    const newPersonHelpedList = personHelpedList.map(person => {
      if (person.id === personId) {
        person.thumbsup = false;
      }

      return person;
    });

    setPersonHelpedList(newPersonHelpedList);
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <DashboardActions date={date} advanceWeek={advanceWeek} backWeek={backWeek} />

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
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Sem atividades para mostrar</Text>
              <Button title="Atualizar" onPress={onRefresh} />
            </View>
          )}
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

      <DashboardPeopleHelpedModal
        onPressThumbsDown={onPressThumbsDown}
        onPressThumbsUp={onPressThumbsUp}
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
        title="Não foi possível mostrar as atividades da semana"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.BLUE },

  // atividades
  activity: { flexDirection: 'row', paddingHorizontal: 28, paddingVertical: 11 },
  activityNameContainer: { flex: 1, justifyContent: 'center' },
  activityName: { fontFamily: 'Montserrat_extra_bold', color: AppColors.BLUE, flexWrap: 'wrap' },
  activityIcon: { justifyContent: 'center' },

  // Lista de atividades vazia
  empty: { marginVertical: 20, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginVertical: 20, fontFamily: 'Montserrat_medium', fontSize: 14 },
});
