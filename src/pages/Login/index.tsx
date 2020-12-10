import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Switch, Text, useTheme } from 'react-native-paper';
import { Button } from 'native-base';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '@hooks/Auth';
import Input from '@components/Input';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppColors } from '../../types';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

interface FormSubmitData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [MessageError, setMessageError] = useState<string>("");

  const { login } = useAuth();
  const theme = useTheme();

  const handleLogin = useCallback(
    async ({ email, password }: FormSubmitData) => {
      try {
        await login({ email, password });
      } catch (err) {
        if (err.status == 401 && err.data.error) {
          setMessageError('Usuário e/ou senha incorretos!\n Tente novamente.');
        } else if (err.status == 500) {
          setMessageError('Não foi possível fazer login! Favor tente novamente mais tarde.');
        }
        setError(true);
      }
    },
    [login],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        onSubmit={handleLogin}
        validationSchema={loginValidationSchema}
        validateOnBlur={true}
        initialValues={{
          email: '',
          password: '',
        }}
      >
        {({
            values,
            errors,
            touched,
            setFieldTouched,
            handleBlur,
            handleSubmit,
            handleChange
          }) => (
          <React.Fragment>
            {error && (
              <View style={styles.errorContainer}>
                <View style={styles.error} />
                <View style={styles.errorTextContainer}>
                  <View style={styles.errorIconContainer}>
                    <Icon name="information" size={30} color={AppColors.RED} />
                  </View>
                  <Text style={styles.errorText}>
                    {MessageError}
                  </Text>
                </View>
              </View>
            )}

            <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.form}>
              <View style={styles.formHeader}>
                <Text numberOfLines={1} ellipsizeMode="clip" adjustsFontSizeToFit={true} style={styles.title}>
                  ENGAJAMENTO
                </Text>
                <Text style={styles.subtitle}>Inicie uma sessão</Text>
              </View>
              <Input
                error={errors.email && touched.email ? true : false}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email', true)}
                autoCompleteType="email"
                keyboardType="email-address"
                placeholder="E-mail"
                placeholderTextColor="rgb(39, 36, 46)"
                style={styles.input}
                theme={theme}
              />
              <Input
                error={errors.password && touched.password ? true : false}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password', true)}
                secureTextEntry={true}
                placeholder="Senha"
                placeholderTextColor="rgb(39, 36, 46)"
                style={styles.input}
                theme={theme}
              />

              <View style={styles.switchContainer}>
                <Switch
                  style={styles.switch}
                  value={remember}
                  onValueChange={() => setRemember(!remember)}
                  color={AppColors.GREEN}
                />
                <Text style={styles.text}>Lembrar-me</Text>
              </View>

              <Button rounded onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>ENTRAR</Text>
              </Button>
            </KeyboardAvoidingView>
          </React.Fragment>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#fff',
    width: '90%',
    paddingHorizontal: 16,
    borderRadius: 20,
    paddingBottom: 32,

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    color: '#3B8EA5',
    fontFamily: 'Montserrat_extra_bold',
    fontSize: 30,
  },
  subtitle: {
    fontFamily: 'Montserrat_medium',
    color: '#27242E',
    marginTop: 13,
  },
  input: {
    marginLeft: 0,
    marginBottom: 8,
    fontSize: 14,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  text: {
    fontFamily: 'Montserrat_medium',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  switch: {
    marginRight: 5,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    alignSelf: 'center',
    backgroundColor: AppColors.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_extra_bold',
    width: '55%',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    width: '90%',
    marginBottom: 16,
  },
  errorTextContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 12,
  },
  error: {
    backgroundColor: AppColors.RED,
    flex: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 12,
  },
  errorIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: AppColors.RED,
    flex: 4,
    fontFamily: 'Montserrat_semi_bold',
    fontSize: 12,
    paddingLeft: 6,
  },
});
