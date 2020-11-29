import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { Feather as Icon } from '@expo/vector-icons';

/**
 *
 * Toast que retorna mensagens de
 * sucesso e erro
 *
 * Precisa passar as propriedades
 * title -> mensagem de sucesso/erro
 * color -> cor do componente em formato string
 * icon -> algum nome de icone da biblioteca Feather (https://feathericons.com/)
 * visible -> se ele é ou não visível (boolean)
 *
 */

interface ToastProps {
  title: string;
  visible: boolean;
  backgroundColor: string;
  icon: string;
  iconColor: string;
  onDismiss(): void;
}

const Toast: React.FC<ToastProps> = ({ title, visible, backgroundColor, icon, iconColor, onDismiss }) => (
  <Portal>
    <Modal dismissable onDismiss={onDismiss} visible={visible} contentContainerStyle={styles.modal}>
      <View style={[styles.card, { backgroundColor }]}>
        <View style={styles.iconContainer}>
          <Icon style={styles.icon} name={icon} size={35} color={iconColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
      </View>
    </Modal>
  </Portal>
);

const styles = StyleSheet.create({
  modal: {},
  card: {
    marginHorizontal: '20%',
    borderRadius: 5,
    paddingVertical: 17,
    paddingHorizontal: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
  },
  titleContainer: {
    padding: 15,
  },
  title: {
    fontFamily: 'Montserrat_extra_bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
  },
});

export default Toast;
