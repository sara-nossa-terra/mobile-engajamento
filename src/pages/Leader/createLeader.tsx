import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Card, TextInput, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';
import Input from '@components/Input';
import Form from '@components/Form';
import Button from '@components/Button';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import { useAuth } from '@hooks/Auth';
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
  perfil: { value: number; label: string };
  leaderSelected: { value: number; label: string };
}

const CreateLeader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderList, setLeaderList] = useState<Leader[]>([]);

  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);

  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);
  const [errorToastVisible, setErrorToastVisible] = useState<boolean>(false);

  const auth = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    async function getRecursiveLeaders(leaderId: number, leaderList: Leader[] = []) {
      const response = await api.get(`/v1/leaders/${leaderId}`);
      const leader = response.data.data as Leader;

      leaderList.push(leader);
      if (leader.lider_id) {
        await getRecursiveLeaders(leader.lider_id.id, leaderList);
      }

      return leaderList;
    }

    async function getAllLeaders() {
      const response = await api.get('/v1/leaders');
      const leaderList = response.data.data as Leader[];

      return leaderList;
    }

    if (auth.isAdmin()) {
      getAllLeaders()
        .then(leaderList => {
          setLeaderList(leaderList);
          setLoading(false);
        })
        .catch(() => {
          navigation.goBack();
        });
    } else {
      getRecursiveLeaders(auth.user.id, [])
        .then(leaderList => {
          setLeaderList(leaderList);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          navigation.goBack();
        });
    }
  }, []);

  // remove o toast de erro depois de 5 segundos
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

  // remove o toast de sucesso depois de 5 segundos
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

  // remove o toast de sucesso e redireciona o usuário
  const onDismissSuccessToast = () => {
    setSuccessToastVisible(false);
    navigation.goBack();
  };

  const onSubmit = ({
    tx_nome,
    perfil,
    password,
    dt_nascimento,
    email,
    leaderSelected,
    nu_telefone,
  }: SubmitFormData) => {
    if (!leaderSelected.value || !leaderSelected.label) return;

    const { dddPhoneNumber, phoneNumber } = separeDDDFromPhoneNumber(nu_telefone);
    const lider_id = perfil.value === 1 ? null : leaderSelected.value;

    api
      .post('/v1/leaders', {
        tx_nome,
        dt_nascimento,
        email: email.toLowerCase(),
        password,
        nu_ddd: dddPhoneNumber,
        nu_telefone: phoneNumber,
        perfil_id: perfil.value,
        lider_id,
      })
      .then(err => {
        setSuccessToastVisible(true);
      })
      .catch(() => {
        setErrorToastVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  const dropdownList = leaderList.map(l => ({ label: l.tx_nome, value: l.id }));
  dropdownList.unshift({ label: 'Selecíone um líder', value: 0 });
  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          onSubmit={onSubmit}
          validationSchema={formSchema}
          initialValues={{
            tx_nome: '',
            dt_nascimento: new Date(),
            nu_telefone: '',
            email: '',
            password: '',
            confirmPassword: '',
            perfil: { value: 2, label: 'Líder' }, // 1 para admin | 2 para líder
            leaderSelected: { value: 0, label: 'Selecione um líder' },
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
                    style={[styles.input, { paddingLeft: 5 }]}
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
                  <Text theme={theme} style={styles.label}>
                    E-mail
                  </Text>

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

                {auth.isAdmin() && (
                  <Card.Content style={[styles.cardContent, { marginBottom: 5 }]}>
                    <Text style={[styles.label, { marginBottom: 5 }]}>Tipo de usuário</Text>

                    <DropDownPicker
                      items={[
                        { value: 1, label: 'Administrador' },
                        { value: 2, label: 'Líder' },
                      ]}
                      onChangeItem={item => setFieldValue('perfil', item || { value: 2, label: 'Líder' })}
                      defaultValue={values.perfil.value || 2}
                      multiple={false}
                      containerStyle={{ height: 55, marginLeft: 5 }}
                      itemStyle={{ justifyContent: 'flex-start' }}
                      labelStyle={{ fontFamily: 'Montserrat_medium', fontSize: 12 }}
                      placeholderStyle={{
                        color: AppColors.INPUT_DISABLE,
                        fontFamily: 'Montserrat_medium',
                        fontSize: 12,
                      }}
                      style={{
                        borderTopLeftRadius: theme.roundness,
                        borderTopRightRadius: theme.roundness,
                        borderBottomLeftRadius: theme.roundness,
                        borderBottomRightRadius: theme.roundness,
                        borderColor: errors.perfil?.value ? theme.colors.error : theme.colors.disabled,
                        borderWidth: errors.perfil?.value ? 2 : 1,
                      }}
                    />
                  </Card.Content>
                )}

                {/* Selecionar líder do líder em cadastro */}
                {values.perfil.value === 2 && (
                  <Card.Content style={[styles.cardContent, { marginBottom: 5 }]}>
                    <Text style={[styles.label, { marginBottom: 5 }]}>Líder do usuário</Text>

                    <DropDownPicker
                      items={dropdownList}
                      onChangeItem={item =>
                        setFieldValue('leaderSelected', item || { value: 0, label: 'Selecione um líder' })
                      }
                      defaultValue={0}
                      multiple={false}
                      containerStyle={{ height: 55, marginLeft: 5 }}
                      itemStyle={{ justifyContent: 'flex-start' }}
                      labelStyle={{ fontFamily: 'Montserrat_medium', fontSize: 12 }}
                      placeholderStyle={{
                        color: AppColors.INPUT_DISABLE,
                        fontFamily: 'Montserrat_medium',
                        fontSize: 12,
                      }}
                      style={{
                        borderTopLeftRadius: theme.roundness,
                        borderTopRightRadius: theme.roundness,
                        borderBottomLeftRadius: theme.roundness,
                        borderBottomRightRadius: theme.roundness,
                      }}
                    />
                  </Card.Content>
                )}

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
                    <Button onPress={() => handleSubmit()} title={'ADICIONAR'} />
                  </View>
                </Card.Content>
              </Form>
            </React.Fragment>
          )}
        </Formik>
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
        title="Não foi possível cadastrar o líder"
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

export default CreateLeader;
