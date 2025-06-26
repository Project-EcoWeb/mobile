import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Bem-vindo ao EcoWeb',
    text: 'Conecte ideias criativas com materiais recicláveis.',
    image: require('../assets/images/onboarding1.jpg'),
  },
  {
    key: '2',
    title: 'Reaproveite com Inovação',
    text: 'Descubra projetos sustentáveis e compartilhe suas criações.',
    image: require('../assets/images/onboarding2.jpg'),
  },
  {
    key: '3',
    title: 'Juntos pelo Planeta',
    text: 'Transforme resíduos em soluções. Comece agora.',
    image: require('../assets/images/onboarding3.jpg'),
  },
];

const Onboarding = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '80%',
    height: 250,
    marginBottom: 20,
    borderRadius: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#263238',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00E5FF',
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  buttonText: {
    color: '#263238',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Onboarding;
