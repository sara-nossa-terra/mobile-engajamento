import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Card, TextInput, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import Input from '@components/Input';
import Form from '@components/Form';
import Button from '@components/Button';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import api from '@services/Api';
import { Formik } from 'formik';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { separeDDDFromPhoneNumber } from '@utils/separeDDDfromPhoneNumber';
import { Leader, AppColors } from '../../types';
import { formSchema } from './utils/formValidation';

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  email: string;
  password: string;
  confirmPassword: string;
  user_type: number;
}

const EditLeader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [leader, setLeader] = useState<Leader>({} as Leader);

  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);

  const [errorShowLeaderVisible, setErrorShowLeaderVisible] = useState<boolean>(false);
  const [errorUpdateLeaderVisible, setErrorUpdateLeaderVisible] = useState<boolean>(false);
  const [successUpdateLeaderVisible, setSuccessUpdateLeaderVisible] = useState<boolean>(false);

  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();

  const { leaderId = 0 } = route.params as { leaderId: number };

  useEffect(() => {
    api
      .get(`/v1/leaders/${leaderId}`)
      .then(response => {
        const data = response.data.data as Leader;

        setLeader(data);
        setLoading(false);
      })
      .catch(() => {
        navigation.navigate('LeaderManageStack');
      });
  }, []);

  // mostra toast de erro ao requisitar líder por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowLeaderVisible) setErrorShowLeaderVisible(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowLeaderVisible]);

  // mostra toast de erro ao atualizar líder por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorUpdateLeaderVisible) setErrorUpdateLeaderVisible(false);
    }, 2500);

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
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [setSuccessUpdateLeaderVisible]);

  const onSubmit = ({ email, nu_telefone, dt_nascimento, password, tx_nome }: SubmitFormData) => {
    const { dddPhoneNumber, phoneNumber } = separeDDDFromPhoneNumber(nu_telefone);

    /**
     *
     * O ADMIN engajamento não possui lider_id
     * Visto isso, foi necessário fazer a logica abaixo
     * para verificar se o líder que queremos editar possui o líder_id
     * Se não possui, não mandamos a requisição pro back
     *
     */
    const data = leader.lider_id
      ? {
          email: email.toLowerCase(),
          nu_telefone: phoneNumber,
          nu_ddd: dddPhoneNumber,
          dt_nascimento,
          password,
          tx_nome,
          lider_id: leader.lider_id.id,
        }
      : {
          email: email.toLowerCase(),
          nu_telefone: phoneNumber,
          nu_ddd: dddPhoneNumber,
          dt_nascimento,
          password,
          tx_nome,
        };

    api
      .put(`/v1/leaders/${leaderId}`, data)
      .then(() => {
        setSuccessUpdateLeaderVisible(true);
      })
      .catch(() => {
        setErrorUpdateLeaderVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          onSubmit={onSubmit}
          validationSchema={formSchema}
          initialValues={{
            tx_nome: leader.tx_nome,
            dt_nascimento: leader.dt_nascimento,
            nu_telefone: `(${leader.nu_ddd}) ${leader.nu_telefone}`,
            email: leader.email,
            password: '',
            confirmPassword: '',
            user_type: 2, // 1 para admin | 2 para líder
          }}
        >
          {({ values, touched, setFieldTouched, handleSubmit, handleChange, setFieldValue, handleBlur, errors }) => (
            <React.Fragment>
              <Form title="INFORMAÇÕES PESSOAIS">
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Nome</Text>

                  <Input
                    value={values.tx_nome}
                    placeholder="Nome completo"
                    onChangeText={handleChange('tx_nome')}
                    onBlur={() => setFieldTouched('tx_nome', true)}
                    error={errors.tx_nome && touched.tx_nome ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Data de nascimento</Text>

                  <Input
                    disabled
                    value={format(new Date(values.dt_nascimento), 'd - M - yyyy', { locale: ptBR })}
                    error={errors.dt_nascimento ? true : false}
                    style={{ width: '45%' }}
                    right={<TextInput.Icon name="calendar-month-outline" onPress={() => setShowsDatePicker(true)} />}
                    theme={theme}
                  />

                  {showsDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      is24Hour
                      display="default"
                      onTouchCancel={() => setShowsDatePicker(false)}
                      onChange={(e, selectedDate) => {
                        setShowsDatePicker(false);
                        if (selectedDate) setFieldValue('dt_nascimento', selectedDate);
                      }}
                    />
                  )}
                </Card.Content>

                <Card.Content>
                  <Text style={styles.label}>Telefone</Text>

                  <TextInput
                    keyboardType="numeric"
                    textContentType="telephoneNumber"
                    placeholder="(__) _____  -  ____"
                    error={errors.nu_telefone && touched.nu_telefone ? true : false}
                    value={values.nu_telefone}
                    onChangeText={handleChange('nu_telefone')}
                    onBlur={() => setFieldTouched('nu_telefone', true)}
                    style={[styles.input, { width: '65%', paddingLeft: 5 }]}
                    mode="outlined"
                    theme={theme}
                    render={props => (
                      // @ts-ignore
                      <TextInputMask
                        type={'cel-phone'}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) ',
                        }}
                        {...props}
                      />
                    )}
                  />
                </Card.Content>
              </Form>

              <Form title="CRIAR CONTA">
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>E-mail</Text>

                  <Input
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    placeholder="email@email.com"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={() => setFieldTouched('email', true)}
                    error={errors.email && touched.email ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Senha</Text>
                  <Text style={[styles.label, { color: 'rgb(168, 168, 168)', fontStyle: 'italic' }]}>
                    5 ou mais caracteres
                  </Text>

                  <Input
                    value={values.password}
                    onBlur={() => setFieldTouched('password', true)}
                    onChangeText={handleChange('password')}
                    secureTextEntry={true}
                    placeholder="*********"
                    error={errors.password && touched.password ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Confirmação de senha</Text>

                  <Input
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={() => setFieldTouched('confirmPassword', true)}
                    secureTextEntry={true}
                    placeholder="*********"
                    error={errors.confirmPassword && touched.confirmPassword ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <View style={styles.buttonContainer}>
                    <Button onPress={() => handleSubmit()} title={'SALVAR'} />
                  </View>
                </Card.Content>
              </Form>
            </React.Fragment>
          )}
        </Formik>
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
        visible={successUpdateLeaderVisible}
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

  // form leader styles
  cardContent: {
    marginBottom: 5,
  },
  label: {
    fontFamily: 'Montserrat_medium',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#ffff',
    fontSize: 12,
    fontFamily: 'Montserrat_medium',
  },
  buttonContainer: {
    marginTop: 32,
  },
});

export default EditLeader;
