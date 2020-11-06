import React from 'react';
import { Text, View } from 'native-base';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Leader: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View
            style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
        >
            <Text>Líderes</Text>
            <Button
                title="Cadastrar Líderes"
                onPress={() => navigation.navigate('CreateLeaderStack')}
            />
        </View>
    );
};

export default Leader;
