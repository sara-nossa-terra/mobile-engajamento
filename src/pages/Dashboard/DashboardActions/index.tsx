import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { AppColors } from '../../../types';

/**
 *
 * Botões de avançar e retroceder semana
 *
 */

interface DashboardActionsProps {
  advanceWeek(): void;
  backWeek(): void;
  start: Date;
  end: Date;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ advanceWeek, backWeek, start, end }) => {
  const firstDayOfWeekFormated = format(start, 'dd/MM', { locale: ptBR });
  const lastDayOfWeeksFormated = format(end, 'dd/MM', { locale: ptBR });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={backWeek} style={styles.headerActions}>
        <Icon name="chevrons-left" size={30} color={AppColors.BLUE} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{`Semana ${firstDayOfWeekFormated} à ${lastDayOfWeeksFormated}`}</Text>
      <TouchableOpacity onPress={advanceWeek} style={styles.headerActions}>
        <Icon name="chevrons-right" size={30} color={AppColors.BLUE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 25,
    borderRadius: 20,
    marginTop: '2%',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  headerTitle: { fontFamily: 'Montserrat_extra_bold', fontSize: 12, alignSelf: 'center', flex: 1, textAlign: 'center' },
  headerActions: { justifyContent: 'center' },
});

export default DashboardActions;
