import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FormActivity from '@components/Form/Activity';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import api from '@services/Api';
import { formatAmericanDatetimeToDate, formatDateToAmericanDatetime } from '@utils/formatAmericanDatetimeToDate';
import { Activity, AppColors } from '../../types';

interface RouteParams {
  activityId: number;
}

interface SubmitFormData {
  tx_nome: string;
  dt_dia: Date;
}

const EditActivity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activity, setActivity] = useState<Activity>({} as Activity);

  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);
  const [errorShowActivityToastVisible, setErrorShowActivityToastVisible] = useState<boolean>(false);

  const route = useRoute();
  const navigation = useNavigation();

  const { activityId = 0 } = route.params as RouteParams;

  useEffect(() => {
    api
      .get(`/v1/activities/${activityId}`)
      .then(response => {
        setActivity({ ...response.data.data, dt_dia: formatAmericanDatetimeToDate(response.data.data.dt_dia) });
      })
      .catch(() => {
        setErrorShowActivityToastVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // mostra o toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorToastVisible) {
        setErrorToastVisible(false);
        navigation.goBack();
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorToastVisible]);

  // mostra o toast de erro por 5 segs
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

  // mostra o toast de erro ao requisitar atividade ao back por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowActivityToastVisible) {
        setErrorShowActivityToastVisible(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowActivityToastVisible]);

  const onDismissSuccessToast = async () => {
    setSuccessToastVisible(false);
    navigation.goBack();
  };

  const onDismissErrorToast = async () => {
    setErrorToastVisible(false);
    navigation.goBack();
  };

  // atualiza as atividades
  const onSubmit = async ({ tx_nome, dt_dia }: SubmitFormData) => {
    api
      .put(`/v1/activities/${activityId}`, { tx_nome, dt_dia: formatDateToAmericanDatetime(dt_dia) })
      .then(() => {
        setSuccessToastVisible(true);
      })
      .catch(err => {
        setErrorToastVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <FormActivity activity={activity} onSubmit={onSubmit} />
      </KeyboardAvoidingView>

      <Toast
        onDismiss={onDismissErrorToast}
        visible={errorToastVisible}
        icon="x"
        title="Não foi possível cadastrar atividade"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
      />

      <Toast
        onDismiss={onDismissSuccessToast}
        visible={successToastVisible}
        icon="check"
        title="Atividade editada com sucesso"
        iconColor={AppColors.GREEN}
        backgroundColor={AppColors.BLUE}
      />

      <Toast
        onDismiss={() => setErrorShowActivityToastVisible(false)}
        visible={errorShowActivityToastVisible}
        icon="x"
        title="Não foi possível mostrar a atividade"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
  },
});

export default EditActivity;
