import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Card, Text, useTheme, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import Form from '@components/Form';
import Button from '@components/Button';
import Input from '@components/Input';
import AppLoading from '@components/AppLoading';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppColors } from '../../types';

interface SubmitFormData {
  name: string;
  birth: Date;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const formSchema = Yup.object().shape({
  name: Yup.string().required(),
  birth: Yup.date().required(),
  phone: Yup.string().min(15).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(5).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')])
    .required(),
});

const CreateLeader: React.FC = () => {
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
  }, []);

  const onSubmit = async (data: SubmitFormData) => {
    /**
     *
     * @todo
     *
     * criar/editar líder
     *
     */
  };

  if (loading) return <AppLoading />;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          onSubmit={onSubmit}
          validationSchema={formSchema}
          initialValues={{
            name: '',
            birth: new Date(2000, 10, 10),
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
        >
          {({ values, handleSubmit, handleChange, setFieldValue, handleBlur, errors }) => (
            <React.Fragment>
              <Form title="INFORMAÇÕES PESSOAIS">
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Nome</Text>

                  <Input
                    value={values.name}
                    placeholder="Nome completo"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={errors.name ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Data de nascimento</Text>

                  <Input
                    disabled
                    value={format(new Date(values.birth), 'd - M - yyyy', {
                      locale: ptBR,
                    })}
                    error={errors.birth ? true : false}
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
                        if (selectedDate) setFieldValue('birth', selectedDate);
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
                    error={errors.phone ? true : false}
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    style={[styles.input, { width: '65%' }]}
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
                    onBlur={handleBlur('email')}
                    error={errors.email ? true : false}
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
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                    secureTextEntry={true}
                    placeholder="*********"
                    error={errors.password ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text style={styles.label}>Confirmação de senha</Text>

                  <Input
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    secureTextEntry={true}
                    placeholder="*********"
                    error={errors.confirmPassword ? true : false}
                    theme={theme}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <View style={styles.buttonContainer}>
                    <Button onPress={() => handleSubmit()} title="ADICIONAR LÍDER" />
                  </View>
                </Card.Content>
              </Form>
            </React.Fragment>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
  },
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
