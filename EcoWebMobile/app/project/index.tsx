import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import api from "../../src/services/api";
import { imagesProjects } from "../../assets/images/image";

interface ProjectType {
  id: string;
  titulo: string;
  autor: string;
  imagem: string;
  category: "Móveis" | "Decoração" | "Jardim" | "Moda";
  difficulty: "Fácil" | "Médio" | "Difícil";
}

const MOCK_ALL_PROJECTS: ProjectType[] = [
  {
    id: "p1",
    titulo: "Cadeira com Paletes",
    autor: "Joana Silva",
    imagem: imagesProjects.cadeira,
    category: "Móveis",
    difficulty: "Médio",
  },
  {
    id: "p2",
    titulo: "Vasos com Garrafa PET",
    autor: "Lucas Costa",
    imagem: imagesProjects.vaso,
    category: "Jardim",
    difficulty: "Fácil",
  },
  {
    id: "p3",
    titulo: "Bolsa de Retalhos",
    autor: "Mariana Costa",
    imagem: imagesProjects.bolsa,
    category: "Moda",
    difficulty: "Médio",
  },
  {
    id: "p4",
    titulo: "Luminária de Pote de Vidro",
    autor: "Pedro Alves",
    imagem: imagesProjects.luminaria,
    category: "Decoração",
    difficulty: "Fácil",
  },
  {
    id: "p5",
    titulo: "Horta Vertical de PVC",
    autor: "Ana Beatriz",
    imagem:
      imagesProjects.horta,
    category: "Jardim",
    difficulty: "Difícil",
  },
  {
    id: "p6",
    titulo: "Estante de Caixotes",
    autor: "Ricardo Lima",
    imagem: imagesProjects.estante,
    category: "Móveis",
    difficulty: "Fácil",
  },
];

const CATEGORIES: ProjectType["category"][] = [
  "Móveis",
  "Decoração",
  "Jardim",
  "Moda",
];

const ProjectGridCard = ({ item }: { item: ProjectType }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/project/${item.id}`)}
    >
      <Image source={{ uri: item.imagem }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.titulo}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AllProjectsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [apiProjects, setApiProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        const formattedProjects: ProjectType[] = response.data
          .filter((proj: any) => proj.title && proj.image && proj.category)
          .map((proj: any) => ({
            id: proj._id,
            titulo: proj.title,
            autor: proj.autor?.name || "Autor desconhecido",
            imagem: proj.image,
            category: proj.category,
            difficulty: formatDifficulty(proj.difficulty),
          }));

        function formatDifficulty(diff: string): ProjectType["difficulty"] {
          switch ((diff || "").toLowerCase()) {
            case "facil":
              return "Fácil";
            case "medio":
              return "Médio";
            case "dificil":
              return "Difícil";
            default:
              return "Fácil";
          }
        }

        setApiProjects(formattedProjects);
      } catch (error) {
        console.error("Erro ao buscar projetos da API:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const combinedProjects = [...MOCK_ALL_PROJECTS, ...apiProjects];

    return combinedProjects.filter((project) => {
      const matchesCategory =
        !activeCategory || project.category === activeCategory;

      const matchesSearch = (project.titulo ?? "")
        .toLowerCase()
        .includes((searchQuery ?? "").toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, apiProjects]);

  const ListHeader = (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={Colors.grayText} />
        <TextInput
          placeholder="Buscar em projetos..."
          placeholderTextColor={Colors.grayText}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Text style={styles.filterTitle}>Categorias</Text>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              activeCategory === item && styles.chipSelected,
            ]}
            onPress={() =>
              setActiveCategory((prev) => (prev === item ? null : item))
            }
          >
            <Text
              style={[
                styles.chipText,
                activeCategory === item && styles.chipTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ title: "Projetos Criativos" }} />
      <StatusBar style="dark" />
      <FlatList
        data={filteredProjects}
        renderItem={({ item }) => <ProjectGridCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={60} color={Colors.grayText} />
            <Text style={styles.emptyText}>Nenhum projeto encontrado.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    margin: 20,
    marginBottom: 0,
    borderColor: Colors.neutral,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    marginLeft: 10,
    color: Colors.text,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.grayText,
    marginHorizontal: 20,
    marginTop: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  chip: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: Colors.white,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1, 
    backgroundColor: Colors.neutral,
  },
  cardContent: {
    padding: 12,
  },
  cardCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.grayText,
    marginTop: 10,
  },
});
