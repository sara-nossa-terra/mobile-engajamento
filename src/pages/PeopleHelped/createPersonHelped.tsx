import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { Card, Text, useTheme, TextInput, Menu } from 'react-native-paper';
import AppLoading from '@components/AppLoading';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Form from '@components/Form';
import Input from '@components/Input';
import Button from '@components/Button';
import { TextInputMask } from 'react-native-masked-text';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppColors, Leader } from '../../types';

interface SubmitFormData {
  name: string;
  birth: Date;
  phone: string;
  leader: { label: string; value: number }; // value é o ID do líder
}

const formSchema = Yup.object().shape({
  name: Yup.string().required(),
  phone: Yup.string().min(15).required(),
  birth: Yup.date().required(),
});

const CreatePeopleHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [showsLeaderMenu, setShowsLeaderMenu] = useState<boolean>(false);
  const [leaderSelected, setLeaderSelected] = useState<Leader>({} as Leader);
  const [leaderList, setLeaderList] = useState<Leader[]>([]);

  const theme = useTheme();

  useEffect(() => {
    /**
     *
     * @todo
     *
     * Requisitar lideres quando a tela carregar
     * listar líderes no input de líderes
     *
     */

    setLeaderList(fakeLeaderList);
    setLoading(false);
  }, []);

  const onSubmit = (data: SubmitFormData) => {
    /**
     *
     * @todo
     *
     * Criar pessoa ajudada
     * adicionar toast sucesso/erro
     */
  };

  const onSelectLeader = (leader: Leader) => {
    setLeaderSelected(leader);
    setShowsLeaderMenu(false);
  };

  if (loading) return <AppLoading />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          validationSchema={formSchema}
          initialValues={{ name: '', phone: '', birth: new Date(2000, 0, 1), leader: { label: '', value: 0 } }}
          onSubmit={onSubmit}
        >
          {({ values, handleSubmit, errors, handleChange, setFieldValue, touched, setFieldTouched }) => (
            <Form title="Pessoa ajudada">
              <Card.Content style={[styles.cardContent, { marginBottom: 5 }]}>
                <Text style={[styles.label, { marginBottom: 5 }]}>Líder</Text>

                <DropDownPicker
                  items={leaderList.map(leader => ({ label: leader.name, value: leader.id }))}
                  onChangeItem={item => setFieldValue('leader', item || {})}
                  defaultValue={values.leader.value || 0}
                  multiple={false}
                  containerStyle={{ height: 55, marginLeft: 5 }}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  labelStyle={{ fontFamily: 'Montserrat_medium', fontSize: 12 }}
                  placeholderStyle={{ color: AppColors.INPUT_DISABLE, fontFamily: 'Montserrat_medium', fontSize: 12 }}
                  style={{
                    borderTopLeftRadius: theme.roundness,
                    borderTopRightRadius: theme.roundness,
                    borderBottomLeftRadius: theme.roundness,
                    borderBottomRightRadius: theme.roundness,
                    borderColor: errors.leader ? theme.colors.error : theme.colors.disabled,
                    borderWidth: errors.leader ? 2 : 1,
                  }}
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
                  <Button onPress={() => handleSubmit()} title="ADICIONAR PESSOA" />
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
  {
    id: Math.round(Math.random() * 1000000),
    name: 'Valdemir',
    phone: '(61) 99999-9999',
    birth: new Date(),
    email: 'email@email.com',
  },
  {
    id: Math.round(Math.random() * 1000000),
    name: 'Rafael',
    phone: '(61) 99999-9999',
    birth: new Date(),
    email: 'email@email.com',
  },
  {
    id: Math.round(Math.random() * 1000000),
    name: 'Thiago',
    phone: '(61) 99999-9999',
    birth: new Date(),
    email: 'email@email.com',
  },
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

export default CreatePeopleHelped;
