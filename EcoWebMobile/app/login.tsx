import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EcoWebLogo } from "../components/logo";
import { useAuth } from "../context/AuthContext";
import api from "../src/services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [userType, setUserType] = useState<"creator" | "company">("creator");

  const router = useRouter();
  const { signIn } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      await AsyncStorage.setItem("@ecoweb_token", token);

      signIn(userType, user.name, user.email, user.id, token);
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message ||
        "Falha ao fazer login. Verifique seus dados.";
      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <EcoWebLogo size={120} showText={true} variant="light" />
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta</Text>
            <Text style={styles.welcomeSubtitle}>
              Entre na sua conta para continuar
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.userTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "creator" && styles.userTypeActive,
                ]}
                onPress={() => setUserType("creator")}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "creator" && styles.userTypeActiveText,
                  ]}
                >
                  Sou Criador
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "company" && styles.userTypeActive,
                ]}
                onPress={() => setUserType("company")}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "company" && styles.userTypeActiveText,
                  ]}
                >
                  Sou Empresa
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="#FFFFFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#FFFFFF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Senha"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={["#FFFFFF", "#F5F5F5"]}
                style={styles.loginButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#2E7D32" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Não tem uma conta?</Text>
              <Pressable onPress={() => router.push("./auth/register")}>
                <Text style={styles.registerLink}>Criar conta</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B5E20",
  },
  backgroundShapes: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  shape: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
  },
  shape1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
    transform: [{ rotate: "45deg" }],
  },
  shape2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
    transform: [{ rotate: "30deg" }],
  },
  shape3: {
    width: 100,
    height: 100,
    top: "40%",
    right: 20,
    borderRadius: 50,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  eyeButton: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#2E7D32", 
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.6)",
    paddingHorizontal: 20,
    fontSize: 14,
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginRight: 5,
  },
  registerLink: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  userTypeSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
    overflow: "hidden",
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  userTypeActive: {
    backgroundColor: "#FFFFFF", 
    borderRadius: 15, 
  },
  userTypeText: {
    color: "#FFFFFF", 
    fontSize: 16,
    fontWeight: "600",
  },
  userTypeActiveText: {
    color: "#1B5E20",
  },
});
