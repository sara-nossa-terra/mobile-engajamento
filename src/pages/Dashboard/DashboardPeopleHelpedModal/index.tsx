import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { Portal, Text, Divider, ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons as Icon, Feather } from '@expo/vector-icons';
import { Activity, AppColors, PersonHelped } from '../../../types';

/**
 *
 * Painel (modal)
 * que mostra a lista de pessoas de determinada atividade
 *
 *
 */

interface DashboardPeopleHelpedModalProps {
  loading: boolean;
  personHelpedList: PersonHelped[];
  activity: Activity;
  active: boolean;
  onClose(): void | Promise<void>;
  onPressThumbsUp(personId: number): void | Promise<void>;
  onPressThumbsDown(personId: number): void | Promise<void>;
}

const DashboardPeopleHelpedModal: React.FC<DashboardPeopleHelpedModalProps> = ({
  active = false,
  loading = false,
  onClose,
  activity,
  personHelpedList,
  onPressThumbsDown,
  onPressThumbsUp,
}) => {
  return (
    <Portal>
      <Modal
        style={{ margin: 0 }}
        deviceHeight={Dimensions.get('window').height}
        deviceWidth={Dimensions.get('window').width}
        animationIn="slideInUp"
        isVisible={active}
        onDismiss={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{activity.tx_nome}</Text>
              <Text style={styles.headerSubtitle}>Marque os membros que fizeram esta atividade</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.headerIcon}>
              <Feather size={20} name="x" color="#fff" style={{ backgroundColor: '#ccc', borderRadius: 10 }} />
            </TouchableOpacity>
          </View>
          <Divider />

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={AppColors.BLUE} />
            </View>
          ) : (
            <FlatList
              data={personHelpedList}
              ItemSeparatorComponent={Divider}
              keyExtractor={item => `${item.id}`}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.person}>
                  <View style={styles.personNameContainer}>
                    <Text style={styles.personName}>{item.tx_nome}</Text>
                  </View>
                  <View style={styles.personActionsContainer}>
                    <TouchableOpacity onPress={() => onPressThumbsUp(item.id)} style={styles.personAction}>
                      <Icon name={item.thumbsup ? 'thumb-up' : 'thumb-up-outline'} size={25} color={AppColors.GREEN} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressThumbsDown(item.id)} style={styles.personAction}>
                      <Icon
                        name={item.thumbsup ? 'thumb-down-outline' : 'thumb-down'}
                        size={25}
                        color={AppColors.RED}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: { paddingHorizontal: 20, paddingVertical: 20, flexDirection: 'row' },
  headerTitle: { fontFamily: 'Montserrat_medium', fontSize: 12 },
  headerSubtitle: { fontFamily: 'Montserrat_light_italic', fontSize: 12 },
  headerIcon: { justifyContent: 'center', alignItems: 'center' },

  loading: { paddingVertical: 30 },

  // pessoa ajudada style
  person: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 },
  personNameContainer: { flex: 1, justifyContent: 'center' },
  personName: { fontFamily: 'Montserrat_medium', fontSize: 12 },
  personActionsContainer: { flexDirection: 'row', justifyContent: 'center' },
  personAction: { marginRight: 13 },
});

export default DashboardPeopleHelpedModal;
