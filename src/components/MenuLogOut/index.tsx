import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '@hooks/Auth';

const MenuLogOut: React.FC = () => {
  const { logOut } = useAuth();

  return (
    <TouchableOpacity onPress={logOut}>
      <Text style={styles.text} children="Sair" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat_semi_bold',
    color: '#fff',
    fontSize: 16,
    marginRight: 15,
  },
});

export default MenuLogOut;
