import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Card, Text, useTheme, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import { AppColors } from '../../types';
import api from '@services/Api';
import { formatDateToAmericanDatetime } from '@utils/formatAmericanDatetimeToDate';
import DateTimePicker from '@react-native-community/datetimepicker';
import Form from '@components/Form';
import Button from '@components/Button';
import Input from '@components/Input';
import { Formik } from 'formik';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { formSchema } from './utils/formValidation';

interface SubmitFormData {
  tx_nome: string;
  dt_dia: Date;
}

const CreateActivity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false); // picker de data

  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
  }, []);

  // mostra toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorToastVisible(false);
    }, 2500);

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
    }, 2500);

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
        <Formik onSubmit={onSubmit} validationSchema={formSchema} initialValues={{ tx_nome: '', dt_dia: new Date() }}>
          {({ values, errors, handleSubmit, setFieldValue, handleBlur, handleChange }) => (
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
                  style={{ width: '45%' }}
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
                  <Button onPress={() => handleSubmit()} title={'ADICIONAR'} />
                </View>
              </Card.Content>
            </Form>
          )}
        </Formik>
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
