import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Card, Text, useTheme, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import Form from '@components/Form';
import Button from '@components/Button';
import Input from '@components/Input';
import { useAuth } from '@hooks/Auth';
import api from '@services/Api';
import { Formik } from 'formik';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { formSchema } from './utils/formValidation';
import { formatDateToAmericanDatetime, formatAmericanDatetimeToDate } from '@utils/formatAmericanDatetimeToDate';
import { AppColors, Activity } from '../../types';

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

  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false); // picker de data

  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);
  const [errorShowActivityToastVisible, setErrorShowActivityToastVisible] = useState<boolean>(false);

  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const auth = useAuth();

  const { activityId = 0 } = route.params as RouteParams;

  useEffect(() => {
    api
      .get(`/v1/activities/${activityId}`)
      .then(response => {
        setActivity({
          id: response.data.data.id,
          tx_nome: response.data.data.tx_nome,
          dt_dia: response.data.data.dt_dia,
        });

        setLoading(false);
      })
      .catch(() => {
        navigation.navigate('ActivityManageStack');
      });
  }, []);

  // mostra o toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorToastVisible) {
        setErrorToastVisible(false);
      }
    }, 2500);

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
    }, 2500);

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
    }, 2500);

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
  };

  // atualiza as atividades
  const onSubmit = async ({ tx_nome, dt_dia }: SubmitFormData) => {
    const dt_dia_formated = formatDateToAmericanDatetime(dt_dia);

    api
      .put(`/v1/activities/${activityId}`, { tx_nome, dt_dia: dt_dia_formated })
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
        <Formik
          onSubmit={onSubmit}
          validationSchema={formSchema}
          initialValues={{
            tx_nome: activity.tx_nome || '',
            dt_dia: formatAmericanDatetimeToDate(activity.dt_dia) || new Date(),
          }}
        >
          {({ values, errors, handleSubmit, setFieldValue, handleBlur }) => (
            <Form title="Atividade">
              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Nome da atividade</Text>

                <Input
                  value={values.tx_nome}
                  placeholder="Nome da atividade"
                  onChangeText={text => setFieldValue('tx_nome', text)}
                  onBlur={handleBlur('tx_nome')}
                  error={errors.tx_nome ? true : false}
                  theme={theme}
                />
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Dia da atividade</Text>

                <Input
                  disabled
                  value={format(new Date(values.dt_dia), 'd - MMM - yyyy', {
                    locale: ptBR,
                  })}
                  right={<TextInput.Icon name="calendar-month-outline" onPress={() => setShowsDatePicker(true)} />}
                  theme={theme}
                />

                {showsDatePicker && (
                  <DateTimePicker
                    value={new Date(values.dt_dia)}
                    mode="date"
                    is24Hour
                    display="default"
                    onTouchCancel={() => setShowsDatePicker(false)}
                    onChange={(e, selectedDate) => {
                      setShowsDatePicker(false);
                      if (selectedDate) setFieldValue('dt_dia', selectedDate);
                    }}
                  />
                )}
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <View style={styles.buttonContainer}>
                  <Button onPress={() => handleSubmit()} title={'SALVAR'} />
                </View>
              </Card.Content>
            </Form>
          )}
        </Formik>
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

  // form atividades
  cardContent: {
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Montserrat_medium',
    fontSize: 12,
  },
  buttonContainer: {
    marginVertical: 15,
  },
});

export default EditActivity;
