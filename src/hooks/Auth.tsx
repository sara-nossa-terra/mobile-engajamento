import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  token: string | undefined;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string>();

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
};

// React Hook que retorna o acesso a dados e funções de autenticação
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
