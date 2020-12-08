import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import { useAuth } from '@hooks/Auth';
import AppLoading from '@components/AppLoading';
import FormLeader from '@components/Form/Leader';
import Toast from '@components/Toast';
import { separeDDDFromPhoneNumber } from '@utils/separeDDDfromPhoneNumber';
import api from '@services/Api';
import { AppColors, Leader } from '../../types';
import { useNavigation } from '@react-navigation/native';

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateLeader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);
  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);

  const auth = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(false);
  }, []);

  // remove o toast de erro depois de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorToastVisible) {
        setErrorToastVisible(false);
      }
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
        navigation.goBack();
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [successToastVisible]);

  // remove o toast de sucesso e redireciona o usuário
  const onDismissSuccessToast = () => {
    setSuccessToastVisible(false);
    navigation.goBack();
  };

  const onSubmit = ({ tx_nome, dt_nascimento, email, nu_telefone, password }: SubmitFormData) => {
    const { dddPhoneNumber, phoneNumber } = separeDDDFromPhoneNumber(nu_telefone);

    api
      .post('/v1/leaders', {
        tx_nome,
        dt_nascimento,
        email,
        password,
        lider_id: auth.user.id,
        nu_ddd: dddPhoneNumber,
        nu_telefone: phoneNumber,
      })
      .then(() => {
        setSuccessToastVisible(true);
      })
      .catch(() => {
        setErrorToastVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <FormLeader leader={{} as Leader} onSubmit={onSubmit} />
      </KeyboardAvoidingView>

      <Toast
        title="Líder cadastrado com sucesso"
        backgroundColor={AppColors.BLUE}
        icon="check"
        iconColor={AppColors.GREEN}
        onDismiss={onDismissSuccessToast}
        visible={successToastVisible}
      />

      <Toast
        title="Erro ao cadastrar líder"
        backgroundColor={AppColors.RED}
        icon="x"
        iconColor={AppColors.RED}
        onDismiss={() => setErrorToastVisible(false)}
        visible={errorToastVisible}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
  },
});

export default CreateLeader;
