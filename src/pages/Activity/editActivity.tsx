import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card, useTheme, TextInput, Text } from 'react-native-paper';
import AppLoading from '@components/AppLoading';
import Form from '@components/Form';
import Input from '@components/Input';
import Button from '@components/Button';
import { Formik } from 'formik';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Activity, AppColors } from '../../types';
import * as Yup from 'yup';
import faker from 'faker';

interface RouteParams {
  activityId: number;
}

interface SubmitFormData {
  id: number;
  name: string;
  day: Date;
}

const formSchema = Yup.object().shape({
  name: Yup.string().required(),
  date: Yup.date(),
});

const EditActivity: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false); // picker de data
  const [activity, setActivity] = useState<Activity>({} as Activity);

  const route = useRoute();
  const theme = useTheme();

  useEffect(() => {
    /**
     *
     * @todo
     *
     * carregar a atividade do backend pelo id
     *
     */
    const { activityId } = route.params as RouteParams;

    const fakeActivity: Activity = {
      id: activityId,
      day: faker.date.recent(),
      name: faker.lorem.words(),
    };

    setActivity(fakeActivity);
    setLoading(false);
  }, []);

  const onSubmit = async (data: SubmitFormData) => {
    /**
     *
     * @todo
     *
     * Requisitar atualização da atividade
     * Redirecionar para a página de gerenciamento de atividades
     *
     */
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          initialValues={{
            name: activity.name,
            day: activity.day,
            id: activity.id,
          }}
          onSubmit={onSubmit}
          validationSchema={formSchema}
        >
          {({ values, errors, handleSubmit, handleBlur, setFieldValue }) => (
            <Form title="ATIVIDADE">
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
                  <Button onPress={() => handleSubmit()} title="EDITAR ATIVIDADE" />
                </View>
              </Card.Content>
            </Form>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );
};

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

export default EditActivity;
