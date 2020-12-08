import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Form from '@components/Form';
import Button from '@components/Button';
import Input from '@components/Input';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Activity, AppColors } from '../../../types';

const formSchema = Yup.object().shape({
  tx_nome: Yup.string().required(),
  dt_dia: Yup.date(),
});

interface SubmitFormData {
  tx_nome: string;
  dt_dia: Date;
}

interface FormActivityProps {
  activity: Activity;
  onSubmit(data: SubmitFormData): void;
}

const FormActivity: React.FC<FormActivityProps> = ({ activity, onSubmit }) => {
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false); // picker de data

  const theme = useTheme();

  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={formSchema}
      initialValues={{
        tx_nome: activity.tx_nome || '',
        dt_dia: new Date(activity.dt_dia || new Date()),
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
              <Button onPress={() => handleSubmit()} title="ADICIONAR ATIVIDADE" />
            </View>
          </Card.Content>
        </Form>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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

export default FormActivity;
