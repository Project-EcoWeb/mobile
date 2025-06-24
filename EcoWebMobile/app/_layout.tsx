// app/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Colors } from '../constants/Colors'; // Vamos criar este arquivo a seguir

export default function RootLayout() {

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary, // Azul Cobalto
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'EcoLink', headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Cadastro', headerShown: false }} />
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Projetos',
          headerBackVisible: false, // Esconde o botão de voltar padrão
          headerRight: () => (
            <Pressable onPress={() => console.log('Abrir perfil')}>
              <Ionicons name="person-circle-outline" size={30} color="#fff" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="projeto/[id]"
        options={{
          title: 'Detalhes do Projeto',
          presentation: 'modal', // Abre a tela de baixo para cima
        }}
      />
    </Stack>
  );
}
