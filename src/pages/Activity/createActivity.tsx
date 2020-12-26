import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActivityForm from '@components/Form/Activity';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import { Activity, AppColors } from '../../types';
import api from '@services/Api';
import { formatDateToAmericanDatetime } from '@utils/formatAmericanDatetimeToDate';

interface SubmitFormData {
  tx_nome: string;
  dt_dia: Date;
}

const CreateActivity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(false);
  }, []);

  // mostra toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorToastVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorToastVisible]);

  // remove o toast de sucesso depois de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (successToastVisible) {
        setSuccessToastVisible(false);
        navigation.navigate('ActivityManageStack');
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [successToastVisible]);

  const onDismissSuccessToast = () => {
    setSuccessToastVisible(false);
    navigation.navigate('ActivityManageStack');
  };

  // cadastrar atividade
  const onSubmit = async ({ tx_nome, dt_dia }: SubmitFormData) => {
    const dt_dia_formated = formatDateToAmericanDatetime(dt_dia);

    api
      .post('/v1/activities', { tx_nome, dt_dia: dt_dia_formated })
      .then(() => {
        setSuccessToastVisible(true);
      })
      .catch(() => {
        setErrorToastVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <ActivityForm activity={{} as Activity} onSubmit={onSubmit} />
      </KeyboardAvoidingView>

      {/* Toast de erro ao cadastrar atividade */}
      <Toast
        onDismiss={() => setErrorToastVisible(false)}
        visible={errorToastVisible}
        icon="x"
        title="Não foi possível cadastrar a atividade"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
      />

      {/* Toast de sucesso ao cadastrar atividade */}
      <Toast
        onDismiss={onDismissSuccessToast}
        visible={successToastVisible}
        icon="check"
        title="Atividade cadastrada com sucesso"
        iconColor={AppColors.GREEN}
        backgroundColor={AppColors.BLUE}
      />
    </View>
  );
};

export default CreateActivity;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
  },
});
