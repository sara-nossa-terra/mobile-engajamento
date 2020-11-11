import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, Text, Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLoading from '@components/AppLoading';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '@services/Api';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

interface SubmitFormData {
  name: string;
  day: Date;
}

const CreateActivityValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  date: Yup.date(),
});

const CreateActivity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false); // picker de data
  const [showsTimePicker, setShowsTimePicker] = useState<boolean>(false); // picker de hora

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(false);
  }, []);

  // cadastrar atividade
  const onSubmit = async ({ name, day }: SubmitFormData) => {
    api
      .post('atividades', { name, day })
      .then(() => navigation.navigate('ActivityStack'))
      .catch(err => {
        Alert.alert('Erro', 'Ocorreu um erro ao cadastrar a atividade', [
          { text: 'OK', style: 'default' },
        ]);
      });
  };

  if (loading) return <AppLoading />;

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Card style={styles.card}>
          <Card.Title title="Cadastrar Atividades" />

          <Formik
            onSubmit={onSubmit}
            validationSchema={CreateActivityValidationSchema}
            initialValues={{
              name: '',
              day: new Date(),
            }}
          >
            {({ values, errors, handleSubmit, setFieldValue, handleBlur }) => (
              <>
                <Card.Content style={styles.cardContent}>
                  <Text>Nome</Text>

                  <TextInput
                    value={values.name}
                    onChangeText={text => setFieldValue('name', text)}
                    onBlur={handleBlur('name')}
                    style={styles.input}
                    mode="outlined"
                    error={errors.name ? true : false}
                    theme={{
                      colors: { primary: '#3b8ea5' },
                    }}
                  />
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text>Dia</Text>

                  <TextInput
                    disabled
                    style={styles.input}
                    mode="outlined"
                    value={format(values.day, "d 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                    left={
                      <TextInput.Icon
                        name="calendar"
                        onPress={() => setShowsDatePicker(true)}
                      />
                    }
                    theme={{
                      colors: { primary: '#3b8ea5' },
                    }}
                  />

                  {showsDatePicker && (
                    <DateTimePicker
                      value={values.day}
                      mode="date"
                      is24Hour
                      display="default"
                      minimumDate={new Date()}
                      onTouchCancel={() => setShowsDatePicker(false)}
                      onChange={(e, selectedDate) => {
                        setShowsDatePicker(false);
                        if (selectedDate) setFieldValue('day', selectedDate);
                      }}
                    />
                  )}
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <Text>Hora</Text>

                  <TextInput
                    value={format(values.day, 'HH:mm')}
                    disabled
                    style={styles.input}
                    mode="outlined"
                    left={
                      <TextInput.Icon
                        name="clock"
                        onPress={() => setShowsTimePicker(true)}
                      />
                    }
                    theme={{
                      colors: { primary: '#3b8ea5' },
                    }}
                  />

                  {showsTimePicker && (
                    <DateTimePicker
                      value={values.day}
                      mode="time"
                      is24Hour
                      onTouchCancel={() => setShowsTimePicker(false)}
                      onChange={(e, selectedDateTime) => {
                        setShowsTimePicker(false);
                        if (selectedDateTime)
                          setFieldValue('day', selectedDateTime);
                      }}
                    />
                  )}
                </Card.Content>

                <Card.Content style={styles.cardContent}>
                  <View style={styles.buttonContainer}>
                    <Button
                      style={styles.button}
                      compact
                      color="#00a3bb"
                      mode="contained"
                      icon="send"
                      onPress={handleSubmit}
                    >
                      Salvar
                    </Button>
                    <Button
                      style={styles.button}
                      compact
                      color="#ffcb00"
                      mode="contained"
                      icon="arrow-left"
                      onPress={navigation.goBack}
                    >
                      Cancelar
                    </Button>
                  </View>
                </Card.Content>
              </>
            )}
          </Formik>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateActivity;

const styles = StyleSheet.create({
  card: {
    paddingVertical: hp('2%'),
  },
  cardContent: {
    marginBottom: hp('1.5%'),
  },
  input: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginRight: wp('1.5%'),
  },
});
