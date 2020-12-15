import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Portal, Text, Divider, ActivityIndicator } from 'react-native-paper';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { MaterialCommunityIcons as Icon, Feather } from '@expo/vector-icons';
import { Activity, AppColors, PersonHelped } from '../../types';

/**
 *
 * Painel (modal)
 * que mostra a lista de pessoas de determinada atividade
 *
 *
 */

interface SwipeableComponentProps {
  loading: boolean;
  personHelpedList: PersonHelped[];
  activity: Activity;
  active: boolean;
  onClose(): void | Promise<void>;
}

const SwipeableComponent: React.FC<SwipeableComponentProps> = ({
  active = false,
  loading = false,
  onClose,
  activity,
  personHelpedList,
}) => {
  const onPressThumbsUp = async (personId: number) => {};

  const onPressThumbsDown = async (personId: number) => {};

  return (
    <Portal>
      <SwipeablePanel closeOnTouchOutside noBar fullWidth onlyLarge openLarge isActive={active} onClose={onClose}>
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

        <ScrollView>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={AppColors.BLUE} />
            </View>
          ) : (
            personHelpedList.map(person => (
              <React.Fragment key={person.id}>
                <View key={person.id} style={styles.person}>
                  <View style={styles.personNameContainer}>
                    <Text style={styles.personName}>{person.tx_nome}</Text>
                  </View>
                  <View style={styles.personActionsContainer}>
                    <TouchableOpacity onPress={() => onPressThumbsUp(person.id)} style={styles.personAction}>
                      <Icon name="thumb-up-outline" size={25} color={AppColors.GREEN} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onPressThumbsDown(person.id)} style={styles.personAction}>
                      <Icon name="thumb-down-outline" size={25} color={AppColors.RED} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Divider />
              </React.Fragment>
            ))
          )}
        </ScrollView>
      </SwipeablePanel>
    </Portal>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' },
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

export default SwipeableComponent;
