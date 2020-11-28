import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInputProps } from 'react-native-paper/src/components/TextInput/TextInput';
import { TextInput } from 'react-native-paper';
import { AppColors } from '../../types';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTheme } from 'react-native-paper/src/core/theming';

const Input: React.FC<TextInputProps> = ({ error = false, right: RightComponet, style, ...rest }) => {
  const theme = useTheme();

  return (
    <TextInput
      mode="outlined"
      right={error ? <TextInput.Icon name="information" size={30} color={AppColors.RED} /> : RightComponet}
      error={error}
      style={[styles.input, style]}
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
  },
});

export default Input;
