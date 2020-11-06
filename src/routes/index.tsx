import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@hooks/Auth';
/**
 *
 * App navigator -> rotas de quando o usuário está autenticado na aplicação
 * AuthNavigator -> rotas de autenticação da aplicação
 *
 */
import AppNavigator from '@routes/App.routes';
import AuthNavigator from '@routes/Auth.routes';

//Arquivo dedicado as configurações de navegação do aplicativo
const Navigation: React.FC = () => {
    const { loading, user } = useAuth();

    if (loading)
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#3B8EA5" />
            </View>
        );

    return user ? <AppNavigator /> : <AuthNavigator />;
};

export default Navigation;

const styles = StyleSheet.create({
    loading: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
});
