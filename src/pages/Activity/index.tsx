import React from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Activity: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text>Atividades</Text>

            <Button
                title="Criar atividade"
                onPress={() => navigation.navigate('CreateActivityStack')}
            />
        </View>
    );
};

export default Activity;
