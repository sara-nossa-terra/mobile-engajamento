import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '@services/Api';
import { Leader } from '../types';

interface AuthState {
  token: string;
  user: Leader;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextProps {
  token: string;
  user: Leader;
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

        api.interceptors.response.use(
          response => {
            return response;
          },
          error => {
            if ([401, 422].includes(error.response.status)) {
              logOut();
            }

            return error;
          },
        );
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    const response = await api.post('/login', { email: email.toLowerCase(), password });

    const token = response.data.access_token as string;

    // armazena o token na request
    api.defaults.headers.authorization = `Bearer ${token}`;

    const userInfoResponse = await api.post('/v1/auth/me');
    const user = userInfoResponse.data.data as Leader;

    // armazena o token e o usuário
    await AsyncStorage.multiSet([
      ['@Engajamento:token', token],
      ['@Engajamento:user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const logOut = useCallback(async () => {
    AsyncStorage.multiRemove(['@Engajamento:token', '@Engajamento:user'])
      .then(() => {
        setData({} as AuthState);
      })
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ login, loading, logOut, token: data.token, user: data.user }}>
      {children}
    </AuthContext.Provider>
  );
};

// React Hook que retorna o acesso a dados e funções de autenticação
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
