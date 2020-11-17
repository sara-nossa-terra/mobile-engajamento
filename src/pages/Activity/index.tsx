import React from 'react';
import { Text, View } from 'native-base';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ActivityComponent: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Listagem de atividades</Text>
      <Button title="Criar Revisão de Vidas" onPress={() => navigation.navigate('CreateActivityStack')} />
    </View>
  );
};

export default ActivityComponent;
