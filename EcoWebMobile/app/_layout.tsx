import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// O Provider deve sempre ser o componente mais externo
export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

// O "Porteiro" que gerencia a navegação
function Layout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se ainda estamos carregando o status do usuário, não faça nada.
    if (isLoading) return;

    // `segments.length === 0` significa que estamos na raiz do app.
    // Se o usuário não está logado, ele deve ser enviado para o login.
    if (!user) {
      router.replace('/login');
    }
    // Se o usuário está logado, ele deve ser enviado para o dashboard.
    else if (user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]); // O efeito só precisa reagir à mudança de 'user' e 'isLoading'

  // Enquanto carrega, mostra uma tela de loading para uma melhor UX
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Renderiza o Stack que vai conter as telas (login ou dashboard)
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}