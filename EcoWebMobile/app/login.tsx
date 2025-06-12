// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Lógica de Mock - futuramente, conectar com a API aqui
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    console.log('Login com:', { email, password });
    router.replace('/dashboard'); // Leva para a tela principal do app
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor={Colors.gray}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor={Colors.gray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/cadastro')}>
          <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
  },
  form: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.highlight,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
