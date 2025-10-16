import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { Colors } from "../../constants/Colors";
import { imagesProjects } from "../../assets/images/image.js";
import { getProjectById } from "../../src/services/projectServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProjectDataType {
  id: string;
  titulo: string;
  autor: string;
  data: string;
  imagem: string;
  descricao: string;
  materiais: string[];
  youtubeVideoId: string;
  category: string;
  difficulty: string;
  stages: string[];
}

const MOCK_PROJECTS_DATA: { [key: string]: ProjectDataType } = {
  p1: {
    id: "p1",
    titulo: "Cadeira com Paletes",
    autor: "Joana Silva",
    data: "10 de Jun, 2025",
    imagem: imagesProjects.cadeira,
    descricao:
      "Uma cadeira de jardim confortável e estilosa, feita inteiramente com paletes de madeira reutilizados. Perfeita para áreas externas e varandas. O projeto é de dificuldade média e pode ser concluído em um final de semana.",
    materiais: [
      "2 Paletes de Madeira",
      "Lixa para madeira",
      "Verniz Incolor",
      "Parafusos 5mm",
    ],
    youtubeVideoId: "wzgp4d542h8",
    category: "Móveis",
    difficulty: "Medio",
    stages: [
      "Lixe bem os paletes para remover farpas.",
      "Corte um palete ao meio para fazer o assento e encosto.",
      "Use as tábuas do segundo palete para fazer os pés e braços.",
      "Parafuse todas as partes firmemente.",
      "Aplique verniz para proteção.",
    ],
  },
  p2: {
    id: "p2",
    titulo: "Vasos com Garrafa PET",
    autor: "Lucas Costa",
    data: "12 de Jun, 2025",
    imagem: imagesProjects.vaso,
    descricao:
      "Aprenda a criar vasos autoirrigáveis para suas plantas usando apenas garrafas PET. Uma solução prática, barata e ecológica.",
    materiais: ["Garrafa PET de 2L", "Barbante de algodão", "Tesoura"],
    youtubeVideoId: "9yv_p9P_N5g",
    category: "Decoração",
    difficulty: "Fácil",
    stages: [
      "Lave bem a garrafa PET e remova o rótulo.",
      "Corte a garrafa ao meio, separando a parte superior da inferior.",
      "Faça um furo na tampa e passe o barbante de algodão por ele.",
      "Enrosque a tampa novamente e encaixe a parte superior da garrafa invertida dentro da parte inferior.",
      "Adicione água na parte de baixo e terra com a planta na parte de cima — o barbante fará a irrigação automática."
    ]
  },
  p3: {
    id: "p3",
    titulo: "Bolsa de Retalhos",
    autor: "Mariana Costa",
    data: "15 de Jun, 2025",
    imagem: imagesProjects.bolsa,
    descricao:
      "Dê vida nova aos seus retalhos de tecido criando uma bolsa tote bag exclusiva e colorida. Um projeto de costura criativa e sustentável.",
    materiais: ["Retalhos de tecido", "Máquina de costura", "Forro", "Alças"],
    youtubeVideoId: "u1S884wA_Nk",
    category: "Decoração",
    difficulty: "Difícil",
    stages: [
      "Separe os retalhos de tecido em cores e estampas que combinem entre si.",
      "Corte os retalhos em quadrados ou retângulos do mesmo tamanho.",
      "Una os pedaços costurando-os lado a lado até formar o tecido principal da bolsa.",
      "Corte o forro do mesmo tamanho e costure junto ao tecido principal.",
      "Adicione as alças e finalize as bordas com costura reforçada para maior durabilidade."
    ]
  },
  p4: {
    id: "p4",
    titulo: "Luminária de Pote de Vidro",
    autor: "Pedro Alves",
    data: "15 de Jun, 2025",
    imagem: imagesProjects.luminaria,
    descricao: "",
    materiais: [],
    youtubeVideoId: "",
    category: "Decoração",
    difficulty: "Difícil",
    stages: [
      "Lave e seque bem o pote de vidro, removendo rótulos e resíduos.",
      "Faça um pequeno furo na tampa do pote para passar o fio do LED.",
      "Insira as luzes dentro do pote e puxe o fio pelo furo feito na tampa.",
      "Fixe o fio com fita isolante e feche bem a tampa.",
      "Ligue as luzes e aproveite sua luminária artesanal feita com reaproveitamento!"
    ]
  },
  p5: {
    id: "p5",
    titulo: "Horta Vertical de PVC",
    autor: "Ana Beatriz",
    data: "15 de Jun, 2025",
    imagem: imagesProjects.horta,
    descricao: "",
    materiais: [],
    youtubeVideoId: "",
    category: "Jardinagem",
    difficulty: "Médio",
    stages: [
      "Corte os canos de PVC em seções de aproximadamente 1 metro.",
      "Faça aberturas ovais na parte frontal de cada cano, onde as plantas serão colocadas.",
      "Feche as extremidades com tampas de PVC e faça pequenos furos no fundo para drenagem da água.",
      "Fixe os canos na parede usando suportes metálicos ou estrutura de madeira.",
      "Preencha com terra adubada e plante suas mudas. Regue regularmente e aproveite sua horta vertical!"
    ]
  },
  p6: {
    id: "p6",
    titulo: "Estante de Caixotes",
    autor: "Ricardo Lima",
    data: "15 de Jun, 2025",
    imagem: imagesProjects.estante,
    descricao: "",
    materiais: [],
    youtubeVideoId: "",
    category: "Decoração",
    difficulty: "Fácil",
    stages: [
      "Lixe bem os caixotes para remover farpas e sujeira.",
      "Pinte ou envernize os caixotes de acordo com o estilo desejado e deixe secar.",
      "Monte a disposição da estante empilhando ou fixando os caixotes entre si.",
      "Parafuse os caixotes uns aos outros para dar estabilidade à estrutura.",
      "Decore e organize seus objetos nas prateleiras personalizadas!"
    ]
  },
};

const extractYoutubeId = (url: string) => {
  return url;
};

const normalizeApiProject = (apiData: any): ProjectDataType => {
  return {
    id: apiData._id,
    titulo: apiData.title,
    autor: apiData.user?.name || "Usuário da EcoWeb",
    data: new Date(apiData.createdAt).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
    }),
    imagem: apiData.image,
    descricao: apiData.description,
    materiais: apiData.materials || [],
    youtubeVideoId: extractYoutubeId(apiData.video || "https://youtube.com"),
    category: apiData.category || "Não categorizado",
    difficulty: apiData.difficulty || "Não definido",
    stages: apiData.stages || [],
  };
};

const InfoBlock = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string }) => (
  <View style={styles.infoBlock}>
    <Ionicons name={icon} size={24} color={Colors.primary} />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);


export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<ProjectDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError("ID do projeto não fornecido.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setProject(null);

      const mockProject = MOCK_PROJECTS_DATA[id];
      if (mockProject) {
        setProject(mockProject);
        setIsLoading(false);
        return;
      }

      try {
        const token = await AsyncStorage.getItem("@ecoweb_token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await getProjectById(id, token);
        const normalizedProject = normalizeApiProject(response.data);
        setProject(normalizedProject);

      } catch (err: any) {
        console.error("Falha ao buscar projeto:", err);
        setError("Não foi possível carregar este projeto.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, color: Colors.grayText }}>Carregando projeto...</Text>
      </View>
    );
  }

  if (error || !project) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={Colors.grayText} />
        <Text style={{ marginTop: 10, fontSize: 16, color: Colors.grayText }}>
          {error || "Projeto não encontrado!"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: project.imagem }} style={styles.heroImage} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
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
                color={isFavorited ? "#0D4D44" : Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.author}>
            por {project.autor} em {project.data}
          </Text>

          <View style={styles.infoContainer}>
            <InfoBlock icon="bookmark-outline" label="Categoria" value={project.category} />
            <InfoBlock icon="pulse-outline" label="Dificuldade" value={project.difficulty} />
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{project.descricao}</Text>

          <Text style={styles.sectionTitle}>Materiais Necessários</Text>
          {project.materiais.map((material, index) => (
            <View key={index} style={styles.materialItem}>
              <Ionicons name="build-outline" size={20} color={Colors.primary} />
              <Text style={styles.materialText}>{material}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Passo a Passo</Text>
          {project.stages.map((stage, index) => (
            <View key={index} style={styles.stageItem}>
              <Text style={styles.stageNumber}>{index + 1}</Text>
              <Text style={styles.stageText}>{stage}</Text>
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

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 320,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
    marginRight: 16,
  },
  author: {
    fontSize: 15,
    color: Colors.grayText,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  materialText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  videoContainer: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  ctaButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  ctaButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },

  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.grayText,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  stageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  stageText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
});