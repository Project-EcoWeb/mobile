import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Bem-vindo ao EcoWeb',
    text: 'Conecte ideias criativas com materiais recicláveis e faça parte de uma comunidade sustentável.',
    image: require('../assets/images/onboarding1.jpg'),
    backgroundColor: '#E8F5E8',
    primaryColor: '#2E7D32',
  },
  {
    key: '2',
    title: 'Reaproveite com Inovação',
    text: 'Descubra projetos sustentáveis incríveis e compartilhe suas próprias criações com o mundo.',
    image: require('../assets/images/onboarding2.jpg'),
    backgroundColor: '#E3F2FD',
    primaryColor: '#1565C0',
  },
  {
    key: '3',
    title: 'Juntos pelo Planeta',
    text: 'Transforme resíduos em soluções inovadoras. Sua jornada sustentável começa agora.',
    image: require('../assets/images/onboarding3.jpg'),
    backgroundColor: '#FFF3E0',
    primaryColor: '#F57C00',
  },
];

const Onboarding = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/login');
    }
  };

  const skip = () => {
    router.replace('/login');
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: slides[currentIndex].primaryColor,
                },
              ]}
              key={i.toString()}
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: typeof slides[0]; index: number }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.contentContainer}>
        
        <Text style={[styles.title, { color: item.primaryColor }]}>
          {item.title}
        </Text>
        
        <Text style={styles.text}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: slides[currentIndex].backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={slides[currentIndex].backgroundColor} />
      
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <Text style={[styles.skipText, { color: slides[currentIndex].primaryColor }]}>
          Pular
        </Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.bottomContainer}>
        <Paginator />
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: slides[currentIndex].primaryColor }]} 
          onPress={goToNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Começar Jornada' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
  },
  imageContainer: {
    flex: 0.6,
    position: 'relative',
    marginTop: 80,
  },
  image: {
    width: width * 0.85,
    height: '100%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: width * 0.075,
    right: width * 0.075,
    height: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    flex: 0.4,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
  },
  text: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: width * 0.7,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Onboarding;