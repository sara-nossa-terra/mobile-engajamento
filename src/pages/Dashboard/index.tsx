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
import { endOfWeek, startOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatAmericanDatetimeToDate } from '@utils/formatAmericanDatetimeToDate';

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true); // loading page
  const [refreshing, setRefreshing] = useState<boolean>(false); // refresh atividades
  const [openPanel, setOpenPanel] = useState<boolean>(false); // painel de pessoas ajudadas
  const [activitySelected, setActivitySelected] = useState<Activity>({} as Activity);
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [personHelpedList, setPersonHelpedList] = useState<PersonHelped[]>([]);
  const [errorShowActivityToastVisible, setErrorShowActivityToastVisible] = useState<boolean>(false);

  // começo e fim da semana
  const dt_begin = startOfWeek(date, { locale: ptBR, weekStartsOn: 0 });
  const dt_until = endOfWeek(date, { locale: ptBR, weekStartsOn: 0 });

  useEffect(() => {
    api
      .get('/v1/regimentation', {
        params: { dt_begin: format(dt_begin, 'yyyy-MM-dd'), dt_until: format(dt_until, 'yyyy-MM-dd') },
      })
      .then(response => {
        // os dados estão sendo retornados como um objeto de atividades e pessoas ajudadas, por isso a coonversão para array
        const activityListData = response.data.data['activities'];
        const personHelpedListData = response.data.data['helpedPerson'];

        // converte a lista de atividades e pessoas para array (estão retornando como objeto)
        const activityListArray = Object.values(activityListData[0]) as Activity[];
        const personHelpedListArray = Object.values(personHelpedListData) as PersonHelped[];

        setActivityList(activityListArray);
        setPersonHelpedList(personHelpedListArray);
      })
      .catch(() => {
        setActivityList([]);
        setPersonHelpedList([]);
        setErrorShowActivityToastVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // atualiza a lista de atividades quando a data mudar
  useEffect(() => {
    onRefresh();
  }, [date]);

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
      .get('/v1/regimentation', {
        params: { dt_begin: format(dt_begin, 'yyyy-MM-dd'), dt_until: format(dt_until, 'yyyy-MM-dd') },
      })
      .then(response => {
        // os dados estão sendo retornados como um objeto de atividades e pessoas ajudadas, por isso a coonversão para array
        const activityListData = response.data.data['activities'];
        const personHelpedListData = response.data.data['helpedPerson'];

        // converte a lista de atividades e pessoas para array (estão retornando como objeto)
        const activityListArray = Object.values(activityListData[0]) as Activity[];
        const personHelpedListArray = Object.values(personHelpedListData) as PersonHelped[];

        setActivityList(activityListArray);
        setPersonHelpedList(personHelpedListArray);
      })
      .catch(() => {
        setActivityList([]);
        setPersonHelpedList([]);
        setErrorShowActivityToastVisible(true);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  // ao selecionar uma atividade, abre o modal
  const onSelectActivity = (activity: Activity) => {
    setActivitySelected(activity);
    setOpenPanel(true);
  };

  const advanceWeek = () => {
    const nextWeek = addWeeks(date, 1);
    setDate(nextWeek);
  };

  const backWeek = () => {
    const lastWeek = subWeeks(date, 1);
    setDate(lastWeek);
  };

  const onPressThumbsUp = (person: PersonHelped) => {
    api
      .post('/v1/regimentation/review', {
        atividade_id: activitySelected.id,
        pessoa_id: person.id,
        dt_periodo: date,
      })
      .then(() => {
        const newPersonHelpedList = personHelpedList.map(p => {
          if (p.id === person.id && p.atividade) {
            p.atividade.map(a => {
              if (a.id === activitySelected.id) {
                a.thumbsup = true;
              }
            });
          }

          return p;
        });

        setPersonHelpedList(newPersonHelpedList);
      })
      .catch(() => {});
  };

  const onPressThumbsDown = (person: PersonHelped) => {
    let reviewID = 0;

    const newPersonHelpedList = personHelpedList.map(p => {
      if (p.id === person.id) {
        person.atividade?.map(activity => {
          if (activity.id === activitySelected.id) {
            activity.thumbsup = false;
            reviewID = activity.reviewId;
          }

          return activity;
        });
      }
      return p;
    });

    if (reviewID === 0) {
      setPersonHelpedList(newPersonHelpedList);
      return;
    }

    api
      .delete(`/v1/regimentation/${reviewID}`)
      .then(() => {
        setPersonHelpedList(newPersonHelpedList);
      })
      .catch(() => {});
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <DashboardActions start={dt_begin} end={dt_until} advanceWeek={advanceWeek} backWeek={backWeek} />

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
