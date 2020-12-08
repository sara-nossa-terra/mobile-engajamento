import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '@services/Api';

interface AuthState {
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextProps {
  token: string;
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
      const token = await AsyncStorage.getItem('@Engajamento:token');

      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        setData({ token });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    console.log('request');
    const response = await api.post('/login', { email, password });

    const token: string = response.data.access_token as string;

    // armazena o token do usuário
    await AsyncStorage.setItem('@Engajamento:token', token);

    // armazena o token na request
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token });
  }, []);

  const logOut = useCallback(async () => {
    await AsyncStorage.removeItem('@Engajamento:token');

    setData({} as AuthState);
  }, []);

  return <AuthContext.Provider value={{ login, loading, logOut, token: data.token }}>{children}</AuthContext.Provider>;
};

// React Hook que retorna o acesso a dados e funções de autenticação
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
