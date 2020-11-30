import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Card, Text, useTheme, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import Form from '@components/Form';
import Button from '@components/Button';
import Input from '@components/Input';
import AppLoading from '@components/AppLoading';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { AppColors } from '../../types';

const CreateLeader: React.FC = () => {
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <AppLoading />;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Form title="INFORMAÇÕES PESSOAIS">
          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Nome</Text>

            <Input placeholder="Nome completo" onChangeText={() => {}} theme={theme} />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Data de nascimento</Text>

            <Input
              disabled
              style={{ width: '45%' }}
              value={format(new Date(2000, 9, 10), 'd - M - yyyy', {
                locale: ptBR,
              })}
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
                  //   if (selectedDate) setFieldValue('day', selectedDate);
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
              //   error={errors.phone ? true : false}
              value={''}
              onChangeText={text => {}}
              //   onBlur={handleBlur('phone')}
              style={[styles.input, { width: '65%' }]}
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
              onChangeText={() => {}}
              theme={theme}
            />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Senha</Text>

            <Input secureTextEntry={true} placeholder="*********" onChangeText={() => {}} theme={theme} />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Confirmação de senha</Text>

            <Input secureTextEntry={true} placeholder="*********" onChangeText={() => {}} theme={theme} />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <View style={styles.buttonContainer}>
              <Button onPress={() => {}} title="ADICIONAR LÍDER" />
            </View>
          </Card.Content>
        </Form>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.BLUE,
    flex: 1,
  },
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

export default CreateLeader;
