import { Stack } from 'expo-router'
import { Colors } from '../constants/Colors'; // se você estiver usando um arquivo de cores

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,         // remove fundo branco da barra
        headerTitle: '',                 // oculta título
        headerBackTitle: '',             // oculta texto da seta
        headerBackVisible: true,         // mantém a seta
        headerTintColor: Colors.text || '#1F2937', // seta escura visível
      }}
    />
  )
}
