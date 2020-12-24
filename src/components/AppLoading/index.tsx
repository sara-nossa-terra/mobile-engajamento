import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppColors } from '../../types';

const AppLoading: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

export default AppLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
