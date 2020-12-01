import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme, Text, Card, TextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLoading from '@components/AppLoading';
import Input from '@components/Input';
import Form from '@components/Form';
import Button from '@components/Button';
import { Formik } from 'formik';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';
import { AppColors, Leader } from '../../types';
import faker from 'faker';

interface RouteParams {
  leaderId: number;
}

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

const EditLeader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [leader, setLeader] = useState<Leader>({} as Leader);

  const theme = useTheme();
  const route = useRoute();

  useEffect(() => {
    /**
     *
     * @todo
     *
     * Requisitar líder pelo id
     *
     */
    const { leaderId } = route.params as RouteParams;

    setLeader({
      id: leaderId,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      birth: faker.date.past(),
    });
    setLoading(false);
  }, []);

  const onSubmit = async (data: SubmitFormData) => {
    /**
     *
     * @todo
     *
     * requisitar atualização ao líder
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
            name: leader.name,
            birth: leader.birth,
            phone: leader.phone,
            email: leader.email,
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

              <Form title="CONTA">
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
                    <Button onPress={() => handleSubmit()} title="EDITAR LÍDER" />
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

export default EditLeader;
