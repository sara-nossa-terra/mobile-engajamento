import React from 'react';
import { StyleSheet, ButtonProps } from 'react-native';
import { Button, Text } from 'native-base';
import { AppColors } from '../../types';

const ButtonComponent: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <Button rounded style={styles.button} onPress={() => onPress({})}>
      <Text style={styles.text}>{title}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat_extra_bold',
  },
  button: {
    marginHorizontal: 'auto',
    alignSelf: 'center',
    backgroundColor: AppColors.GREEN,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
});

export default ButtonComponent;
