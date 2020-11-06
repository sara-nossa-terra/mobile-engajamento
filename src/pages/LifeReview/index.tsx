import React from 'react';
import { Text, View } from 'native-base';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LifeReview: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text>Revisão de Vidas</Text>
            <Button
                title="Criar Revisão de Vidas"
                onPress={() => navigation.navigate('CreateLifeReviewStack')}
            />
        </View>
    );
};

export default LifeReview;
