// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: '1',
    image: require('../assets/images/onboarding1.png'), // Crie imagens placeholder em assets/images
    title: 'Inspire-se e Crie',
    description: 'Descubra milhares de ideias para transformar resíduos em projetos incríveis.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding2.png'),
    title: 'Conecte-se com Empresas',
    description: 'Encontre materiais reutilizáveis doados por empresas parceiras na sua região.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding3.png'),
    title: 'Faça Parte da Mudança',
    description: 'Junte-se a uma comunidade que valoriza a sustentabilidade e a economia circular.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.replace('/login'); // Navega para a tela de login, substituindo a de onboarding
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      <Pressable style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Começar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
