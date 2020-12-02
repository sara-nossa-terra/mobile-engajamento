import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Card, Text, TextInput, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';
import AppLoading from '@components/AppLoading';
import Input from '@components/Input';
import Button from '@components/Button';
import Form from '@components/Form';
import { Formik } from 'formik';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';
import faker from 'faker';
import { AppColors, Leader, PersonHelped } from '../../types';

const formSchema = Yup.object().shape({
  birth: Yup.date().required(),
  name: Yup.string().required(),
  phone: Yup.string().min(15).required(),
  leader: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.number().notOneOf([0]).required(),
  }),
});

interface RouteParams {
  personId: number;
}

interface FormSubmitData {
  name: string;
  phone: string;
  leader: { label: string; value: number }; // value é o ID
  birth: Date;
}

const EditPersonHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [leaderList, setLeaderList] = useState<Leader[]>([]);
  const [person, setPerson] = useState<PersonHelped>({} as PersonHelped);

  const theme = useTheme();
  const route = useRoute();

  useEffect(() => {
    /**
     *
     * @todo
     *
     * requisitar líderes
     * requisitar pessoa pelo id
     *
     */
    const { personId } = route.params as RouteParams;

    setLeaderList(fakeLeaderList);
    setPerson({
      id: personId,
      leaderId: 0,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      birth: faker.date.past(),
    });

    setLoading(false);
  }, []);

  const onSubmit = async (data: FormSubmitData) => {
    /**
     * @todo
     *
     * Requisitar atualização de pessoa ajudada
     * Exibir toast de pessoa editada com sucesso
     * Redirecionar para tela de gerenciamento de pessoas ajudadas
     *
     *
     */
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          initialValues={{
            name: person.name,
            birth: person.birth,
            phone: person.phone,
            leader: { label: '', value: 0 },
          }}
          onSubmit={onSubmit}
          validationSchema={formSchema}
        >
          {({ values, errors, touched, handleSubmit, handleChange, setFieldTouched, setFieldValue }) => (
            <Form title="GERENCIAR PESSOA AJUDADA">
              <Card.Content style={styles.cardContent}>
                <Text style={[styles.label, { marginBottom: 5 }]}>Líder</Text>

                <DropDownPicker
                  items={leaderList.map(leader => ({ label: leader.name, value: leader.id }))}
                  onChangeItem={item => setFieldValue('leader', item || {})}
                  defaultValue={values.leader.value || 0}
                  style={{
                    borderTopLeftRadius: theme.roundness,
                    borderTopRightRadius: theme.roundness,
                    borderBottomLeftRadius: theme.roundness,
                    borderBottomRightRadius: theme.roundness,
                    borderColor: errors.leader ? theme.colors.error : theme.colors.disabled,
                    borderWidth: errors.leader ? 2 : 1,
                  }}
                  multiple={false}
                  containerStyle={{ height: 55, marginLeft: 5 }}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  labelStyle={{ fontFamily: 'Montserrat_medium', fontSize: 12 }}
                  placeholderStyle={{ color: AppColors.INPUT_DISABLE, fontFamily: 'Montserrat_medium', fontSize: 12 }}
                />
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Nome da pessoa</Text>
                <Input
                  placeholder="Nome completo"
                  value={values.name}
                  error={errors.name && touched.name ? true : false}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name', true)}
                  theme={theme}
                />
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Data de nascimento</Text>

                <Input
                  disabled
                  value={format(new Date(values.birth), 'd - MMM - yyyy', {
                    locale: ptBR,
                  })}
                  style={[{ width: '45%' }, styles.input]}
                  right={<TextInput.Icon name="calendar-month-outline" onPress={() => setShowsDatePicker(true)} />}
                  theme={theme}
                />

                {showsDatePicker && (
                  <DateTimePicker
                    value={values.birth}
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

              <Card.Content style={styles.cardContent}>
                <Text style={styles.label}>Telefone</Text>

                <TextInput
                  keyboardType="numeric"
                  textContentType="telephoneNumber"
                  placeholder="(__) _____  -  ____"
                  error={errors.phone && touched.phone ? true : false}
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={() => setFieldTouched('phone', true)}
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

              <Card.Content style={styles.cardContent}>
                <View style={styles.buttonContainer}>
                  <Button onPress={() => handleSubmit()} title="EDITAR PESSOA" />
                </View>
              </Card.Content>
            </Form>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );
};

const fakeLeaderList: Leader[] = [
  { id: 0, name: 'Selecíone um líder', phone: '(61) 99999-9999', email: 'email@email.com', birth: new Date() },
  { id: 1, name: 'Valdemir', phone: '(61) 99999-9999', email: 'email@email.com', birth: new Date() },
  { id: 2, name: 'Rafael', phone: '(61) 99999-9999', email: 'email@email.com', birth: new Date() },
  { id: 3, name: 'Thiago', phone: '(61) 99999-9999', email: 'email@email.com', birth: new Date() },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BLUE,
  },
  cardContent: {
    marginBottom: 10,
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
    marginTop: 22,
    marginBottom: 15,
  },
});

export default EditPersonHelped;
