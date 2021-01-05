import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { useTheme, Card, Text, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import AppLoading from '@components/AppLoading';
import Toast from '@components/Toast';
import Form from '@components/Form';
import Input from '@components/Input';
import Button from '@components/Button';
import { useAuth } from '@hooks/Auth';
import api from '@services/Api';
import { Formik } from 'formik';
import { AppColors, Leader, PersonHelped } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { separeDDDFromPhoneNumber } from '@utils/separeDDDfromPhoneNumber';
import { formSchemaForAdmin, formSchemaForLeader } from './utils/formValidation';

interface SubmitFormData {
  tx_nome: string;
  dt_nascimento: Date;
  nu_telefone: string;
  leader: { label: string; value: number }; // value é o ID do líder | label o nome do líder
}

const EditPersonHelped: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [person, setPerson] = useState<PersonHelped>({} as PersonHelped);

  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [leaderList, setLeaderList] = useState<Leader[]>([]);

  const [errorUpdatePersonToastVisible, setErrorUpdatePersonToastVisible] = useState<boolean>(false);
  const [successToastVisible, setSuccessToastVisible] = useState<boolean>(false);
  const [errorShowPersonToastVisible, setErrorShowPersonToastVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const auth = useAuth();

  const { personId } = route.params as { personId: number };

  useEffect(() => {
    api
      .get(`/v1/helpedPersons/${personId}`)
      .then(response => {
        const data = response.data.data as PersonHelped;
        setPerson(data);

        setLoading(false);
      })
      .catch(() => {
        navigation.navigate('PeopleHelpedManageStack');
      });
  }, []);

  useEffect(() => {
    api
      .get('/v1/leaders')
      .then(response => {
        setLeaderList(response.data.data);
      })
      .catch(() => {});
  }, []);

  // mostra toast de sucesso por 5 segs e redireciona o usuário pra listagem
  useEffect(() => {
    if (successToastVisible) {
      const timer = setTimeout(() => {
        setSuccessToastVisible(false);
        navigation.goBack();
      }, 2500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [successToastVisible]);

  // mostra toast de erro ao requisistar pessoa por id por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorShowPersonToastVisible) {
        setErrorShowPersonToastVisible(false);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [errorShowPersonToastVisible]);

  // mostra toast de erro por 5 segs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorUpdatePersonToastVisible) {
        setErrorUpdatePersonToastVisible(false);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [errorUpdatePersonToastVisible]);

  // edita pessoa ajudada
  const onSubmit = ({ nu_telefone, tx_nome, leader, dt_nascimento }: SubmitFormData) => {
    let lider_id = auth.user.id;

    if (auth.isAdmin()) {
      if (leader) {
        lider_id = leader.value;
      }
    }

    const { dddPhoneNumber, phoneNumber } = separeDDDFromPhoneNumber(nu_telefone);
    api
      .put(`/v1/helpedPersons/${personId}`, {
        tx_nome,
        dt_nascimento,
        lider_id,
        phoneNumber,
        nu_telefone: phoneNumber,
        nu_ddd: dddPhoneNumber,
        id: personId,
      })
      .then(() => {
        setSuccessToastVisible(true);
      })
      .catch(err => {
        setErrorUpdatePersonToastVisible(true);
      });
  };

  if (loading) return <AppLoading />;

  // define o tipo de validaçao baseado no usuário logado
  const formikInitialState = auth.isAdmin() ? formSchemaForAdmin : formSchemaForLeader;

  // lógica de impressão dos valores do dropdown corretamente
  let dropdownItems = leaderList.map(leader => ({ label: leader.tx_nome, value: leader.id }));
  dropdownItems = dropdownItems.filter(leader => leader.value != person.lider_id.id);
  dropdownItems.unshift({ label: person.lider_id.tx_nome, value: person.lider_id.id });
  dropdownItems.unshift({ label: 'Selecione um líder', value: 0 });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Formik
          validationSchema={formikInitialState}
          onSubmit={onSubmit}
          initialValues={{
            tx_nome: person.tx_nome,
            nu_telefone: `(${person.nu_ddd}) ${person.nu_telefone}`,
            dt_nascimento: person.dt_nascimento,
            leader: { label: person.lider_id.tx_nome, value: person.lider_id.id },
          }}
        >
          {({ values, handleSubmit, errors, handleChange, setFieldValue, touched, setFieldTouched }) => (
            <Form title="Pessoa ajudada">
              {auth.isAdmin() && (
                <Card.Content style={[styles.cardContent, { marginBottom: 5 }]}>
                  <Text style={[styles.label, { marginBottom: 5 }]}>Líder</Text>

                  <DropDownPicker
                    items={dropdownItems}
                    onChangeItem={item => setFieldValue('leader', item || { value: 0, label: 'Selecione um líder' })}
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
                  style={[styles.input]}
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
                  style={[styles.input, { paddingLeft: 5 }]}
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
                  <Button onPress={() => handleSubmit()} title={'SALVAR'} />
                </View>
              </Card.Content>
            </Form>
          )}
        </Formik>
      </KeyboardAvoidingView>

      <Toast
        title="Não foi possível atualizar a pessoa"
        onDismiss={() => setErrorUpdatePersonToastVisible(false)}
        icon="x"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
        visible={errorUpdatePersonToastVisible}
      />

      <Toast
        title="Não foi possível mostrar a pessoa"
        onDismiss={() => setErrorShowPersonToastVisible(false)}
        icon="x"
        iconColor={AppColors.RED}
        backgroundColor={AppColors.RED}
        visible={errorShowPersonToastVisible}
      />

      <Toast
        title="Pessoa editada com sucesso"
        icon="check"
        iconColor={AppColors.GREEN}
        backgroundColor={AppColors.BLUE}
        visible={successToastVisible}
        onDismiss={() => {
          setSuccessToastVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BLUE,
  },

  // formulário estilos
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
