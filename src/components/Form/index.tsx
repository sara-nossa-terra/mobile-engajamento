import React from 'react';
import { View, ViewProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type FormProps = ViewProps & { title: string; contentContainerStyle?: StyleProp<ViewStyle> };

const Form: React.FC<FormProps> = ({ title, children, style, contentContainerStyle = {}, ...rest }) => {
  return (
    <View style={[style, styles.container]} {...rest}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
      <Divider />
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: hp('2%'),
    marginTop: hp('2%'),
  },
  titleContainer: {
    paddingHorizontal: wp('3%'),
  },
  title: {
    fontSize: 12,
    fontFamily: 'Montserrat_medium',
    paddingVertical: hp('1.8%'),
    paddingLeft: wp('3%'),
  },

  content: {
    paddingHorizontal: wp('3%'),
    paddingTop: hp('1.5%'),
  },
});

export default Form;
