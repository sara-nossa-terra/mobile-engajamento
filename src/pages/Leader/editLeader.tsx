import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import AppLoading from '@components/AppLoading';
import FormLeader from '@components/Form/Leader';
import Toast from '@components/Toast';
import { AppColors, Leader } from '../../types';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '@services/Api';

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EditLeader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [leader, setLeader] = useState<Leader>({} as Leader);

  const [errorShowLeaderVisible, setErrorShowLeaderVisible] = useState<boolean>(false);
  const [errorUpdateLeaderVisible, setErrorUpdateLeaderVisible] = useState<boolean>(false);
  const [successUpdateLeaderVisible, setSuccessUpdateLeaderVisible] = useState<boolean>(false);

  const route = useRoute();
  const navigation = useNavigation();

  const { leaderId = 0 } = route.params as { leaderId: number };

  useEffect(() => {
    api
      .get(`/v1/leaders/${leaderId}`)
      .then(response => {
        const data = response.data.data as Leader;

        setLeader(data);
      })
      .catch(() => {
        setErrorShowLeaderVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // mostra toast de erro ao requisitar líder por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowLeaderVisible) setErrorShowLeaderVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowLeaderVisible]);

  // mostra toast de erro ao atualizar líder por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorUpdateLeaderVisible) setErrorUpdateLeaderVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorUpdateLeaderVisible]);

  // mostra toast de sucesso ao atualizar líder por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (successUpdateLeaderVisible) {
        setSuccessUpdateLeaderVisible(false);
        navigation.goBack();
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorUpdateLeaderVisible]);

  const onSubmit = ({ email, nu_telefone, dt_nascimento, password, tx_nome }: SubmitFormData) => {
    api
      .put(`/v1/leaders/${leaderId}`, {
        email,
        nu_telefone,
        dt_nascimento,
        password,
        tx_nome,
        lider_id: leader.lider_id.id,
      })
      .then(() => {
        Alert.alert('sucesso');
      })
      .catch(() => {
        setErrorUpdateLeaderVisible(true);
      })
      .finally(() => {});
  };

  if (loading) return <AppLoading />;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <FormLeader buttonText="SALVAR LÍDER" leader={leader} onSubmit={onSubmit} />
      </KeyboardAvoidingView>

      <Toast
        title="Não foi possível mostrar o líder"
        icon="x"
        backgroundColor={AppColors.RED}
        iconColor={AppColors.RED}
        onDismiss={() => setErrorShowLeaderVisible(false)}
        visible={errorShowLeaderVisible}
      />

      <Toast
        title="Não foi possível atualizar o líder"
        icon="x"
        backgroundColor={AppColors.RED}
        iconColor={AppColors.RED}
        onDismiss={() => setErrorUpdateLeaderVisible(false)}
        visible={errorUpdateLeaderVisible}
      />

      <Toast
        title="Líder atualizado com sucesso"
        icon="check"
        backgroundColor={AppColors.BLUE}
        iconColor={AppColors.GREEN}
        visible={errorUpdateLeaderVisible}
        onDismiss={() => {
          setSuccessUpdateLeaderVisible(false);
          navigation.goBack();
        }}
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

export default EditLeader;
