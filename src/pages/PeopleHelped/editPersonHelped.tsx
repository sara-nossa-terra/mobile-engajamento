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

const EditPersonHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [person, setPerson] = useState<PersonHelped>({} as PersonHelped);

  const [errorUpdatePersonToastVisible, setErrorUpdatePersonToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);
  const [errorShowPersonToastVisible, setErrorShowPersonToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute();

  const { personId } = route.params as { personId: number };

  useEffect(() => {
    api
      .get(`/v1/helpedPersons/${personId}`)
      .then(response => {
        const data = response.data.data as PersonHelped;
        setPerson(data);
      })
      .catch(() => {
        setErrorShowPersonToastVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // mostra toast de sucesso por 5 segs e redireciona o usuário pra listagem
  useEffect(() => {
    if (successToastVisible) {
      const timer = setTimeout(() => {
        setSuccessToastVisible(false);
        navigation.goBack();
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [successToastVisible]);

  // mostra toast de erro ao requisistar pessoa por id por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowPersonToastVisible) {
        setErrorShowPersonToastVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowPersonToastVisible]);

  // mostra toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorUpdatePersonToastVisible) {
        setErrorUpdatePersonToastVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorUpdatePersonToastVisible]);

  // edita pessoa ajudada
  const onSubmit = ({ nu_telefone, tx_nome, leader, dt_nascimento }: SubmitFormData) => {
    if (leader.value === 0) return;

    const { dddPhoneNumber, phoneNumber } = separeDDDFromPhoneNumber(nu_telefone);
    api
      .put(`/v1/helpedPersons/${personId}`, {
        tx_nome,
        dt_nascimento,
        lider_id: leader.value,
        phoneNumber,
        nu_telefone: phoneNumber,
        nu_ddd: dddPhoneNumber,
        id: personId,
      })
      .then(() => {
        setSuccessToastVisible(true);
      })
      .catch(err => {
        setErrorUpdatePersonToastVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <PersonHelpedForm onSubmit={onSubmit} personHelped={person} buttonText="SALVAR PESSOA" />
      </KeyboardAvoidingView>

      <Toast
        title="Não foi possível atualizar a pessoa"
        onDismiss={() => setErrorUpdatePersonToastVisible(false)}
        icon="x"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
        visible={errorUpdatePersonToastVisible}
      />

      <Toast
        title="Não foi possível mostrar a pessoa"
        onDismiss={() => setErrorShowPersonToastVisible(false)}
        icon="x"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
        visible={errorShowPersonToastVisible}
      />

      <Toast
        title="Pessoa editada com sucesso"
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

export default EditPersonHelped;
