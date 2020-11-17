import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInputProps } from 'react-native-paper/src/components/TextInput/TextInput';
import { TextInput } from 'react-native-paper';
import { AppColors } from '../../types';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Input: React.FC<TextInputProps> = ({ error = false, right: RightComponet, style, ...rest }) => {
  return (
    <TextInput
      mode="outlined"
      placeholderTextColor="rgb(217, 217, 217)"
      right={error ? <TextInput.Icon name="information" size={30} color={AppColors.RED} /> : RightComponet}
      error={error}
      style={[style, styles.input]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginLeft: wp('1.6%'),
    backgroundColor: 'transparent',
    fontSize: 12,
    fontFamily: 'Montserrat_medium',
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
});

export default Input;
