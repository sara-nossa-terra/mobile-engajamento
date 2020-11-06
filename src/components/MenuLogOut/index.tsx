import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '@hooks/Auth';

const MenuLogOut: React.FC = () => {
    const { logOut } = useAuth();

    return (
        <TouchableOpacity onPress={logOut}>
            <Text
                style={{ color: '#fff', fontSize: 17, marginRight: 15 }}
                children="SAIR"
            />
        </TouchableOpacity>
    );
};

export default MenuLogOut;
