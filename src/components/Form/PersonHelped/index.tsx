import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, TextInput, useTheme } from 'react-native-paper';
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
import { AppColors, Leader, PersonHelped } from '../../../types';
import api from '@services/Api';
import { useAuth } from '@hooks/Auth';

const formSchemaAdmin = Yup.object().shape({
  tx_nome: Yup.string().required(),
  nu_telefone: Yup.string().min(14).required(),
  dt_nascimento: Yup.date().required(),
});

const formSchema = Yup.object().shape({
  tx_nome: Yup.string().required(),
  nu_telefone: Yup.string().min(14).required(),
  dt_nascimento: Yup.date().required(),
  leader: Yup.object().shape({
    label: Yup.string().required(),
    value: Yup.number().notOneOf([0]).required(),
  }),
});

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  leader: { label: string; value: number }; // value é o ID do líder | label o nome do líder
}

interface FormPersonHelpedProps {
  personHelped: PersonHelped;
  onSubmit(data: SubmitFormData): void;
  buttonText?: string;
}

const FormPersonHelped: React.FC<FormPersonHelpedProps> = ({
  personHelped,
  onSubmit,
  buttonText = 'ADICIONAR PESSOA',
}) => {
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [leaderList, setLeaderList] = useState<Leader[]>([]);

  const theme = useTheme();
  const auth = useAuth();

  useEffect(() => {
    api
      .get('/v1/leaders')
      .then(response => setLeaderList(response.data.data))
      .catch(() => {});
  }, []);

  const formikInitialState = auth.isAdmin() ? formSchemaAdmin : formSchema;

  const leaderName = personHelped.lider_id.tx_nome;
  const leaderId = personHelped.lider_id.id;

  let dropdownItems = leaderList.map(leader => ({ label: leader.tx_nome, value: leader.id }));
  dropdownItems = dropdownItems.filter(i => i.value != leaderId);
  dropdownItems.push({ label: leaderName, value: leaderId });

  return (
    <Formik
      validationSchema={formikInitialState}
      onSubmit={onSubmit}
      initialValues={{
        tx_nome: personHelped.tx_nome || '',
        nu_telefone: `(${personHelped.nu_ddd || ''}) ${personHelped.nu_telefone || ''}`,
        dt_nascimento: personHelped.dt_nascimento || new Date(),
        leader: { label: leaderName, value: leaderId },
      }}
    >
      {({ values, handleSubmit, errors, handleChange, setFieldValue, touched, setFieldTouched }) => (
        <Form title="Pessoa ajudada">
          {auth.isAdmin() && (
            <Card.Content style={[styles.cardContent, { marginBottom: 5 }]}>
              <Text style={[styles.label, { marginBottom: 5 }]}>Líder</Text>

              <DropDownPicker
                items={dropdownItems}
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
          )}

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Nome da pessoa</Text>
            <Input
              placeholder="Nome completo"
              value={values.tx_nome}
              error={errors.tx_nome && touched.tx_nome ? true : false}
              onChangeText={handleChange('tx_nome')}
              onBlur={() => setFieldTouched('tx_nome', true)}
              theme={theme}
            />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Data de nascimento</Text>

            <Input
              disabled
              value={format(new Date(values.dt_nascimento), 'd - MMM - yyyy', { locale: ptBR })}
              style={[{ width: '45%' }, styles.input]}
              right={<TextInput.Icon name="calendar-month-outline" onPress={() => setShowsDatePicker(true)} />}
              theme={theme}
            />

            {showsDatePicker && (
              <DateTimePicker
                value={new Date(values.dt_nascimento)}
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

          <Card.Content style={styles.cardContent}>
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

          <Card.Content style={styles.cardContent}>
            <View style={styles.buttonContainer}>
              <Button onPress={() => handleSubmit()} title={buttonText} />
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

export default FormPersonHelped;
