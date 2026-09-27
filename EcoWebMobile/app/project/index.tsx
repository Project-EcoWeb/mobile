import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../components/PageHeader";
import { Colors } from "../../constants/Colors";
import { getPublicContentError, listPublicProjects, PublicProject } from "../../src/services/publicContentService";

const normalizeText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const formatCategory = (category: string) => {
  const labels: Record<string, string> = { moveis: "Móveis", decoracao: "Decoração", plastico: "Plástico" };
  return labels[normalizeText(category)] ?? category;
};

const ProjectGridCard = ({ item }: { item: PublicProject }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/project/${item._id}`)} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{formatCategory(item.category)}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AllProjectsScreen() {
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query ?? "");
  const [activeCategory, setActiveCategory] = useState<string | null>(params.category ?? null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProjects(await listPublicProjects());
    } catch (loadError) {
      setError(getPublicContentError(loadError, "Não foi possível carregar os projetos."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- inicia a consulta pública ao montar a tela.
  useEffect(() => { void loadProjects(); }, [loadProjects]);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))).filter(Boolean),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());
    return projects.filter((project) => {
      const matchesCategory = !activeCategory || normalizeText(project.category) === normalizeText(activeCategory);
      const matchesSearch = !normalizedQuery || normalizeText(project.title).includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, projects]);

  const listHeader = (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={Colors.grayText} />
        <TextInput placeholder="Buscar em projetos..." placeholderTextColor={Colors.grayText} style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      {categories.length > 0 && (
        <>
          <Text style={styles.filterTitle}>Categorias</Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.chip, activeCategory === item && styles.chipSelected]} onPress={() => setActiveCategory((current) => current === item ? null : item)}>
                <Text style={[styles.chipText, activeCategory === item && styles.chipTextSelected]}>{formatCategory(item)}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <PageHeader title="Projetos Criativos" />
      <FlatList
        data={isLoading || error ? [] : filteredProjects}
        renderItem={({ item }) => <ProjectGridCard item={item} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <><ActivityIndicator size="large" color={Colors.primary} /><Text style={styles.emptyText}>Carregando projetos...</Text></>
            ) : error ? (
              <><Ionicons name="cloud-offline-outline" size={60} color={Colors.grayText} /><Text style={styles.emptyText}>{error}</Text><TouchableOpacity style={styles.retryButton} onPress={loadProjects}><Text style={styles.retryButtonText}>Tentar novamente</Text></TouchableOpacity></>
            ) : (
              <><Ionicons name="search-outline" size={60} color={Colors.grayText} /><Text style={styles.emptyText}>Nenhum projeto encontrado.</Text></>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContainer: { paddingHorizontal: 10, paddingBottom: 24 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 15, paddingHorizontal: 15, margin: 20, marginBottom: 0, borderColor: Colors.neutral, borderWidth: 1 },
  searchInput: { flex: 1, height: 50, fontSize: 16, marginLeft: 10, color: Colors.text },
  filterTitle: { fontSize: 16, fontWeight: "600", color: Colors.grayText, marginHorizontal: 20, marginTop: 20 },
  categoryScroll: { paddingHorizontal: 20, paddingVertical: 10, gap: 10 },
  chip: { backgroundColor: Colors.white, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.neutral },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.text, fontWeight: "600" },
  chipTextSelected: { color: Colors.white },
  card: { flex: 1, margin: 10, backgroundColor: Colors.white, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: Colors.neutral },
  cardImage: { width: "100%", aspectRatio: 1, backgroundColor: Colors.neutral },
  cardContent: { padding: 12 },
  cardCategory: { fontSize: 12, color: Colors.primary, fontWeight: "bold", marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: Colors.text },
  emptyContainer: { flex: 1, marginTop: 100, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  emptyText: { fontSize: 17, fontWeight: "600", color: Colors.grayText, marginTop: 12, textAlign: "center" },
  retryButton: { marginTop: 18, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  retryButtonText: { color: Colors.white, fontWeight: "700" },
});
