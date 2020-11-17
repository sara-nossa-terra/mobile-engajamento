import React from 'react';
import { AuthProvider } from './Auth';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from '@components/AppLoading';
import { AppColors } from '../types';

const AppProvider: React.FC = ({ children }) => {
  /**
   *
   * Carrega as fontes do Native Base
   * E a fonte Montserrat (fonte padrão no aplicativo)
   *
   */
  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/Montserrat-Regular.ttf'),
    Montserrat_medium: require('../../assets/fonts/Montserrat-Medium.ttf'),
    Montserrat_extra_bold: require('../../assets/fonts/Montserrat-ExtraBold.ttf'),
    Montserrat_semi_bold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    ...Ionicons.font,
  });

  /**
   *
   * Padroniza o React Native Paper de acordo com o tema do layout do aplicativo
   *
   */
  const theme = {
    ...DefaultTheme,
    roundness: 10,

    colors: {
      ...DefaultTheme.colors,
      primary: AppColors.BLUE,
      error: AppColors.RED,
    },
  };

  if (!loaded) return <AppLoading />;

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
    </PaperProvider>
  );
};

export default AppProvider;
