import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { EcoWebLogo } from '../../components/logo';
import api from '../../src/services/api';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

const handleCadastro = async () => {
  if (!nome || !email || !senha || !confirmarSenha) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    return;
  }

  if (!validateEmail(email)) {
    Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
    return;
  }

  if (!validatePassword(senha)) {
    Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert('Erro', 'As senhas não coincidem.');
    return;
  }

  if (!acceptTerms) {
    Alert.alert('Erro', 'Você deve aceitar os termos de uso.');
    return;
  }

  try {
    setLoading(true);

    await api.post('/auth/register', {
      name: nome,
      email,
      password: senha,
    });

    Alert.alert('Sucesso', 'Conta criada com sucesso!');
    router.replace('/login');
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    Alert.alert('Erro', 'Não foi possível cadastrar. Verifique os dados ou tente mais tarde.');
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#E8F5E8', '#F1F8E9', '#FFFFFF']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <EcoWebLogo size={100} showText={true} variant="dark" />
              
              <View style={styles.welcomeCard}>
                <Text style={styles.title}>Junte-se ao EcoWeb</Text>
                <Text style={styles.subtitle}>
                  Faça parte da maior comunidade de sustentabilidade digital do Brasil
                </Text>
                
                <View style={styles.benefitsContainer}>
                  <View style={styles.benefit}>
                    <Ionicons name="leaf" size={16} color="#4CAF50" />
                    <Text style={styles.benefitText}>Projetos sustentáveis</Text>
                  </View>
                  <View style={styles.benefit}>
                    <Ionicons name="people" size={16} color="#4CAF50" />
                    <Text style={styles.benefitText}>Comunidade ativa</Text>
                  </View>
                  <View style={styles.benefit}>
                    <Ionicons name="bulb" size={16} color="#4CAF50" />
                    <Text style={styles.benefitText}>Ideias inovadoras</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Criar sua conta</Text>
              
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#999"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                {email.length > 0 && (
                  <Ionicons 
                    name={validateEmail(email) ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={validateEmail(email) ? "#4CAF50" : "#F44336"} 
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Senha (mín. 6 caracteres)"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={senha}
                  onChangeText={setSenha}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                {confirmarSenha.length > 0 && (
                  <Ionicons 
                    name={senha === confirmarSenha ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={senha === confirmarSenha ? "#4CAF50" : "#F44336"} 
                    style={{ marginLeft: 5 }}
                  />
                )}
              </View>

              <TouchableOpacity 
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  Aceito os <Text style={styles.termsLink}>termos de uso</Text> e{' '}
                  <Text style={styles.termsLink}>política de privacidade</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.registerButton, (!acceptTerms || loading) && { opacity: 0.6 }]}
                onPress={handleCadastro}
                disabled={!acceptTerms || loading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.registerButtonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.registerButtonText}>Criar Conta</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginSection}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <Pressable onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Fazer login</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  benefit: {
    alignItems: 'center',
    flex: 1,
  },
  benefitText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});