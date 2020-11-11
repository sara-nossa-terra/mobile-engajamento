import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuPlus from '@components/MenuPlus';
import AppLoading from '@components/AppLoading';
import { DataTable, Colors, Button } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { format } from 'date-fns';
import api from '@services/Api';

interface ActivityInterface {
  id: number;
  name: string;
  day: Date;
}

const Activity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [activities, setActivities] = useState<ActivityInterface[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    // adiciona o botão criar atividade no header menu
    navigation.setOptions({
      headerRight: () => <MenuPlus route="CreateActivityStack" />,
    });

    api
      .get('atividades')
      .then(response => {
        setActivities(response.data);
      })
      .catch(err => {
        Alert.alert('Erro', 'Ocorreu um erro ao mostrar as atividades', [
          { text: 'OK', style: 'default' },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // atualizar listagem de atividades
  const onRefresh = async () => {
    setRefresh(true);

    api
      .get('atividades')
      .then(response => setActivities(response.data))
      .catch(err => {
        Alert.alert('Erro', 'Ocorreu um erro ao mostrar as atividades', [
          { text: 'OK', style: 'default' },
        ]);
      })
      .finally(() => setRefresh(false));
  };

  // deletar atividades
  const onDeleteActivity = async (id: number) => {
    api
      .delete(`atividades/${id}`)
      .then(() => {
        const newActivities = activities.filter(activity => activity.id !== id);
        setActivities(newActivities);
      })
      .catch(err => {
        Alert.alert('Erro', 'Ocorreu um erro ao excluir a atividade', [
          { text: 'OK', style: 'default' },
        ]);
      });
  };

  // atualizar uma única atividade
  const onUpdateActivity = async (activityId: number) => {
    navigation.navigate('EditActivityStack', { activityId });
  };

  if (loading) return <AppLoading />;

  return (
    <View style={{ flex: 1 }}>
      <DataTable>
        <FlatList
          data={activities}
          keyExtractor={item => String(item.id)}
          onRefresh={onRefresh}
          refreshing={refresh}
          ListHeaderComponent={() => (
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>Nome da Atividade</DataTable.Title>
              <DataTable.Title>Dia</DataTable.Title>
              <DataTable.Title numeric>Ações</DataTable.Title>
            </DataTable.Header>
          )}
          renderItem={({ item }) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell> {item.name} </DataTable.Cell>
              <DataTable.Cell>
                {format(new Date(item.day), 'dd/MM/yyyy')}
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    style={styles.button}
                    compact
                    mode="contained"
                    onPress={() => onUpdateActivity(item.id)}
                    color={Colors.blue700}
                  >
                    <Icon name="border-color" size={20} color="#fff" />
                  </Button>

                  <Button
                    style={styles.button}
                    compact
                    mode="contained"
                    onPress={() => onDeleteActivity(item.id)}
                    color={Colors.red700}
                  >
                    <Icon name="delete" size={20} color="#fff" />
                  </Button>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          )}
        />
      </DataTable>
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({
  tableRowActions: {
    justifyContent: 'flex-end',
  },
  tableRowAction: {
    marginVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#e9ecef',
  },
  tableHeaderText: {
    color: '#495057',
  },
  button: {
    marginHorizontal: 2,
  },
});
