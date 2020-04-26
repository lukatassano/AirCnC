import React, { useState, useEffect } from 'react';
import { View, AsyncStorage,KeyboardAvoidingView,Text, Image, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';

import api from "../services/api";

import logo from '../assets/logo.png';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');

  const [offset] = useState(new Animated.ValueXY({x: 500, y:0}));
  const [logoset] = useState(new Animated.ValueXY({x: 0, y:-500}));

  useEffect(() => {
    Animated.spring(offset.x, {
      toValue: 0,
      speed: 2,
      bounciness: 0
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(logoset.y, {
      toValue: 0,
      speed: 2,
      bounciness: 0,
    }).start();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        navigation.navigate('List');
      }
    })
  }, []);
  
  async function handleSubmit() {
    const response = await api.post('/sessions', {
      email
    })

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id);
    await AsyncStorage.setItem('techs', techs);
    
    navigation.navigate('List')
  }


  return <KeyboardAvoidingView behavior="padding" style={styles.container} >
    <Animated.View style={[
      {
        transform: [
          {translateY: logoset.y}
        ]
      }
    ]}>
      <Image source={logo} />
    </Animated.View>

    <Animated.View style={[
      styles.form,
      {
        transform: [
          {translateX: offset.x}
        ]
      }
      ]}
    >
      <Text style={styles.label}>SEU E-MAIL *</Text>
      <TextInput 
        style={styles.input}
        placeholder="Seu e-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />  

      <Text style={styles.label}>TECNOLOGIAS *</Text>
      <TextInput 
        style={styles.input}
        placeholder="Tecnologias de interesse"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={techs}
        onChangeText={setTechs}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Encontrar spots</Text>
      </TouchableOpacity>

    </Animated.View>
  </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 5,
  },

  button: {
    height: 42,
    backgroundColor: '#f05a5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  }
})
