import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

interface MenuPlusProps {
  route: string;
}
/**
 *
 * Componente do header menu com sinal de add
 *
 */
const MenuPlus: React.FC<MenuPlusProps> = ({ route }) => {
  const navigation = useNavigation();

  // @ts-ignore
  const onPress = () => navigation.navigate(route);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

export default MenuPlus;

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
  },
});
