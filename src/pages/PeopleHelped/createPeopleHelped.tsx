import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { Card, Text, useTheme, TextInput, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Form from '@components/Form';
import Input from '@components/Input';
import Button from '@components/Button';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { AppColors, Leader } from '../../types';

const leaders: Leader[] = [
  { id: Math.round(Math.random() * 1000000), name: 'Valdemir' },
  { id: Math.round(Math.random() * 1000000), name: 'Rafael' },
  { id: Math.round(Math.random() * 1000000), name: 'Thiago' },
];

const CreatePeopleHelped: React.FC = () => {
  const [showsDatePicker, setShowsDatePicker] = useState<boolean>(false);
  const [showsLeaderMenu, setShowsLeaderMenu] = useState<boolean>(false);
  const [leaderSelected, setLeaderSelected] = useState<Leader>({} as Leader);

  const theme = useTheme();

  const handleSubmit = () => {};

  const onSelectLeader = (leader: Leader) => {
    setLeaderSelected(leader);
    setShowsLeaderMenu(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <Form title="Pessoa ajudada">
          <Card.Content style={[styles.cardContent, { marginBottom: 0 }]}>
            <Text style={styles.label}>Líder</Text>

            <TextInput
              disabled
              placeholder={leaderSelected.name || 'Selecione um líder'}
              mode="outlined"
              theme={theme}
              style={[styles.input, { marginBottom: 0, marginLeft: 6 }]}
              right={<TextInput.Icon name="menu-down" onPress={() => setShowsLeaderMenu(true)} />}
            />
            <Menu
              visible={showsLeaderMenu}
              onDismiss={() => setShowsLeaderMenu(false)}
              anchor={<Text onPress={() => setShowsLeaderMenu(true)} children="" style={{ fontSize: 6 }} />}
              style={{ width: '85%' }}
            >
              {leaders.map(leader => (
                <Menu.Item
                  titleStyle={{ fontFamily: 'Montserrat_medium', fontSize: 12 }}
                  onPress={() => onSelectLeader(leader)}
                  title={leader.name}
                  key={leader.id}
                />
              ))}
            </Menu>
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Nome da pessoa</Text>
            <Input placeholder="Nome completo" theme={theme} />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Data de nascimento</Text>

            <Input
              disabled
              placeholder="15 - 12 - 2000"
              value={format(new Date(), 'd - MMM - yyyy', {
                locale: ptBR,
              })}
              style={[{ width: '45%' }, styles.input]}
              right={<TextInput.Icon name="calendar-month-outline" onPress={() => setShowsDatePicker(true)} />}
              theme={theme}
            />

            {showsDatePicker && (
              <DateTimePicker
                // value={values.day}
                value={new Date()}
                mode="date"
                is24Hour
                display="default"
                minimumDate={new Date()}
                onTouchCancel={() => setShowsDatePicker(false)}
                onChange={(e, selectedDate) => {
                  setShowsDatePicker(false);
                  //   if (selectedDate) setFieldValue('day', selectedDate);
                }}
              />
            )}
          </Card.Content>

          {/* 
            @TODO Input mask de telefone no campo abaixo de telefone
          */}
          <Card.Content style={styles.cardContent}>
            <Text style={styles.label}>Telefone</Text>
            <Input
              keyboardType="numeric"
              textContentType="telephoneNumber"
              style={{ width: '65%' }}
              placeholder="(__) _____  -  ____"
              theme={theme}
            />
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <View style={styles.buttonContainer}>
              <Button onPress={() => {}} title="ADICIONAR PESSOA" />
            </View>
          </Card.Content>
        </Form>
      </KeyboardAvoidingView>
    </View>
  );
};

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
