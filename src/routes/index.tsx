import React from 'react';
import { useAuth } from '@hooks/Auth';
import AppLoading from '@components/AppLoading';
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
  const { loading, token } = useAuth();

  if (loading) return <AppLoading />;

  return token ? <AppNavigator /> : <AuthNavigator />;
};

export default Navigation;
