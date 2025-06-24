import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Colors } from '../../constants/Colors';

// CORREÇÃO 1: Definir uma interface para a estrutura de um projeto
interface ProjectDataType {
    id: string;
    titulo: string;
    autor: string;
    data: string;
    imagem: string;
    descricao: string;
    materiais: string[];
    youtubeVideoId: string;
}

// CORREÇÃO 2: Garantir que TODOS os projetos no mock tenham a propriedade 'data'
const MOCK_PROJECTS_DATA: { [key: string]: ProjectDataType } = { // Tipagem do objeto
  p1: {
      id: 'p1',
      titulo: 'Cadeira com Paletes',
      autor: 'Joana Silva',
      data: '10 de Jun, 2025',
      imagem: 'https://i.imgur.com/O7pzYcL.jpg',
      descricao: 'Uma cadeira de jardim confortável e estilosa, feita inteiramente com paletes de madeira reutilizados. Perfeita para áreas externas e varandas. O projeto é de dificuldade média e pode ser concluído em um final de semana.',
      materiais: ['2 Paletes de Madeira', 'Lixa para madeira', 'Verniz Incolor', 'Parafusos 5mm'],
      youtubeVideoId: 'wzgp4d542h8',
    },
    p2: {
        id: 'p2',
        titulo: 'Vasos com Garrafa PET',
        autor: 'Lucas Costa',
        data: '12 de Jun, 2025', // Propriedade adicionada
        imagem: 'https://i.imgur.com/WXJr9rJ.jpg',
        descricao: 'Aprenda a criar vasos autoirrigáveis para suas plantas usando apenas garrafas PET. Uma solução prática, barata e ecológica.',
        materiais: ['Garrafa PET de 2L', 'Barbante de algodão', 'Tesoura'],
        youtubeVideoId: '9yv_p9P_N5g'
    },
    p3: {
        id: 'p3',
        titulo: 'Bolsa de Retalhos',
        autor: 'Mariana Costa',
        data: '15 de Jun, 2025', // Propriedade adicionada
        imagem: 'https://i.imgur.com/Bm2cWYO.jpg',
        descricao: 'Dê vida nova aos seus retalhos de tecido criando uma bolsa tote bag exclusiva e colorida. Um projeto de costura criativa e sustentável.',
        materiais: ['Retalhos de tecido', 'Máquina de costura', 'Forro', 'Alças'],
        youtubeVideoId: 'u1S884wA_Nk'
    },
};


export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Agora o TypeScript sabe que 'id' é uma chave válida e que o resultado sempre terá a propriedade 'data'
  const project = MOCK_PROJECTS_DATA[id];

  const [isFavorited, setIsFavorited] = useState(false);
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  if (!project) {
    return (
      <View style={styles.centerContainer}>
        <Text>Projeto não encontrado!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: project.imagem }} style={styles.heroImage} />
             <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{project.titulo}</Text>
            <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={32}
                color={isFavorited ? '#0D4D44' : Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.author}>por {project.autor} em {project.data}</Text>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{project.descricao}</Text>

          <Text style={styles.sectionTitle}>Materiais Necessários</Text>
          {project.materiais.map((material, index) => (
            <View key={index} style={styles.materialItem}>
              <Ionicons name="build-outline" size={20} color={Colors.primary} />
              <Text style={styles.materialText}>{material}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Tutorial em Vídeo</Text>
            <View style={styles.videoContainer}>
                <YoutubeIframe
                    height={200}
                    play={playing}
                    videoId={project.youtubeVideoId}
                    onChangeState={onStateChange}
                />
            </View>

            <View style={{height: 50}} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.ctaButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.white} />
          <Text style={styles.ctaButtonText}>Enviar mensagem ao criador</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... Estilos (sem alteração)
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageContainer: {
        width: '100%',
        height: 320,
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
    },
    contentContainer: {
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: Colors.background,
      marginTop: -20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.text,
      flex: 1,
      marginRight: 16,
    },
    author: {
      fontSize: 15,
      color: Colors.grayText,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.text,
      marginTop: 16,
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: Colors.text,
      lineHeight: 25,
    },
    materialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.neutral
    },
    materialText: {
        fontSize: 16,
        color: Colors.text,
        marginLeft: 12,
    },
    videoContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#000'
    },
    ctaButton: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    ctaButtonText: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10,
    }
  });
