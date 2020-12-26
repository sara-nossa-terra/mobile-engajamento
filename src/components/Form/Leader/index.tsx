import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import { Formik } from 'formik';
import Input from '@components/Input';
import Form from '@components/Form';
import Button from '@components/Button';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';
import { Leader } from 'src/types';

const formSchema = Yup.object().shape({
  tx_nome: Yup.string().required(),
  dt_nascimento: Yup.date().required(),
  nu_telefone: Yup.string().min(14).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(5).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')])
    .required(),
});

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormLeaderProps {
  onSubmit(data: SubmitFormData): void;
  leader: Leader;
  buttonText?: string;
}

const FormLeader: React.FC<FormLeaderProps> = ({ onSubmit, leader, buttonText = 'ADICIONAR LÍDER' }) => {
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);

  const theme = useTheme();

  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={formSchema}
      initialValues={{
        tx_nome: leader.tx_nome || '',
        dt_nascimento: leader.dt_nascimento || new Date(),
        nu_telefone: `(${leader.nu_ddd || ''}) ${leader.nu_telefone || ''}`,
        email: leader.email || '',
        password: '',
        confirmPassword: '',
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
                <Button onPress={() => handleSubmit()} title={buttonText} />
              </View>
            </Card.Content>
          </Form>
        </React.Fragment>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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

export default FormLeader;
