import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Arregimentação</Text>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 38,
  },
});
