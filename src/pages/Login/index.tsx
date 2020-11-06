import React, { useState } from 'react';
import { SafeAreaView, View, Dimensions, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import { HelperText, Switch, Text } from 'react-native-paper';
import { Icon } from 'native-base'

const Login: React.FC = () => {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.container}>
          {error &&
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
            <Icon type='FontAwesome' name='exclamation-circle' style={{ color: '#F2545B' }} />
            <View style={{ paddingLeft: 16 }}>
              <Text style={{ color: '#F2545B' }} children={'Login / Senha incorretos'} />
              <Text style={{ color: '#F2545B' }} children={'Tente novamente.'} />
            </View>
          </View>}
        <View style={style.content}>
          <Text numberOfLines={1} ellipsizeMode='clip' adjustsFontSizeToFit={true} style={{ color: '#3B8EA5', fontWeight: '700', marginTop: 24, marginBottom: 16, fontSize: 30 }} children={'ENGAJAMENTO'} />
          <Text style={{ marginBottom: 24, color: '#27242E' }} children={'Inicie uma nova sessão'} />
          <TextInput
            style={style.input}
            value={user}
            onChangeText={text => setUser(text)}
            placeholder={'E-mail'}
            autoCompleteType='email'
            keyboardType='email-address'
          />
          <TextInput
            style={style.input}
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder={'Senha'}
            secureTextEntry={true}
          />
          <View style={{ flexDirection: 'row', width: '90%', marginBottom: 32 }}>
            <Switch
              value={remember}
              onValueChange={() => setRemember(!remember)}
              color={'#82B865'}
            />
            <Text style={{ color: '#27242E' }} children={'Lembrar-me'} />
          </View>
          <TouchableHighlight onPress={() => { setError(!error) }} style={style.buttonSubmit} >
            <Text children={'ENTRAR'} style={style.textButton} />
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const style = StyleSheet.create({
  input: { width: '90%', borderWidth: 0.2, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 7, marginVertical: 8 },
  buttonSubmit: { marginBottom: 32, backgroundColor: '#3B8EA5', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30 },
  textButton: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  content: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: 16, width: Dimensions.get('screen').width * 0.9, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }
})

