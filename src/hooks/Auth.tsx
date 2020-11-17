import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { User } from '../types';
import api from '@services/Api';

interface AuthState {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: User;
  loading: boolean;
  login(credentials: LoginCredentials): Promise<void>;
  logOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStorageData() {
      const [token, user] = await AsyncStorage.multiGet(['@Engajamento:token', '@Engajamento:user']);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    // Descomentar e setar a URL quando o back estiver pronto para a integração
    // const response = await api.post('/sessions', { email, password })

    const userFakeData: User = {
      birth: new Date(1999, 9, 9),
      email: email,
      id: 1,
      name: 'admin',
    };

    const token = 'token_asdoiasdaosd_asdoaidaoidsas'; // fake

    // armazena o usuário e o token no dispositivo
    await AsyncStorage.multiSet([
      ['@Engajamento:token', token],
      ['@Engajamento:user', JSON.stringify(userFakeData)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user: userFakeData });
  }, []);

  const logOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Engajamento:user', '@Engajamento:token']);

    setData({} as AuthState);
  }, []);

  return <AuthContext.Provider value={{ login, user: data.user, loading, logOut }}>{children}</AuthContext.Provider>;
};

// React Hook que retorna o acesso a dados e funções de autenticação
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
