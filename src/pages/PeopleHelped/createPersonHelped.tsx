import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import PersonHelpedForm from '@components/Form/PersonHelped/';
import api from '@services/Api';
import { AppColors, PersonHelped } from '../../types';
import { separeDDDFromPhoneNumber } from '@utils/separeDDDfromPhoneNumber';

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  leader: { label: string; value: number }; // value é o ID do líder | label o nome do líder
}

const CreatePeopleHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(false);
  }, []);

  // mostra toast de sucesso por 5 segs e redireciona o usuário pra listagem
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

  // mostra toast de erro por 5 segs
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

  // cadastra pessoa ajudada
  const onSubmit = ({ nu_telefone, tx_nome, leader, dt_nascimento }: SubmitFormData) => {
    if (leader.value === 0) return;

    const { dddPhoneNumber, phoneNumber } = separeDDDFromPhoneNumber(nu_telefone);

    api
      .post(`/v1/helpedPersons`, {
        tx_nome,
        dt_nascimento,
        lider_id: leader.value,
        phoneNumber,
        nu_telefone: phoneNumber,
        nu_ddd: dddPhoneNumber,
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
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <PersonHelpedForm onSubmit={onSubmit} personHelped={{} as PersonHelped} />
      </KeyboardAvoidingView>

      <Toast
        title="Não foi possível cadastrar a pessoa"
        onDismiss={() => setErrorToastVisible(false)}
        icon="x"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
        visible={errorToastVisible}
      />

      <Toast
        title="Pessoa cadastrada com sucesso"
        icon="check"
        iconColor={AppColors.GREEN}
        backgroundColor={AppColors.BLUE}
        visible={successToastVisible}
        onDismiss={() => {
          setSuccessToastVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BLUE,
  },
});

export default CreatePeopleHelped;
