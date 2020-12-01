import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLoading from '@components/AppLoading';
import Form from '@components/Form';
import Button from '@components/Button';
import Input from '@components/Input';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppColors } from '../../types';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

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

  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
  }, []);

  // cadastrar atividade
  const onSubmit = async (data: SubmitFormData) => {
    // @todo  integrar backend
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          onSubmit={onSubmit}
          validationSchema={CreateActivityValidationSchema}
          initialValues={{
            name: '',
            day: new Date(),
          }}
        >
          {({ values, errors, handleSubmit, setFieldValue, handleBlur }) => (
            <Form title="Atividade">
              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Nome da atividade</Text>

                <Input
                  value={values.name}
                  placeholder="Nome da atividade"
                  onChangeText={text => setFieldValue('name', text)}
                  onBlur={handleBlur('name')}
                  error={errors.name ? true : false}
                  theme={theme}
                />
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Dia da atividade</Text>

                <Input
                  disabled
                  style={{ width: '45%' }}
                  value={format(values.day, 'd - MMM - yyyy', {
                    locale: ptBR,
                  })}
                  right={<TextInput.Icon name="calendar-month-outline" onPress={() => setShowsDatePicker(true)} />}
                  theme={theme}
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
                <View style={styles.buttonContainer}>
                  <Button onPress={() => handleSubmit()} title="ADICIONAR ATIVIDADE" />
                </View>
              </Card.Content>
            </Form>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateActivity;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
  },
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
