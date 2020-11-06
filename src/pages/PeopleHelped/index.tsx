import React from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PeopleHelped: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text>Pessoas Ajudadas </Text>

            <Button
                title="Cadastrar Pessoas Ajudadas"
                onPress={() => navigation.navigate('CreatePeopleHelpedStack')}
            />
        </View>
    );
};

export default PeopleHelped;
