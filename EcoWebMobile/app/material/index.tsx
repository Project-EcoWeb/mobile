import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../components/PageHeader";
import { Colors } from "../../constants/Colors";
import { useAuthenticationGate } from "../../hooks/useAuthenticationGate";
import { getPublicContentError, listPublicMaterials, PublicMaterial } from "../../src/services/publicContentService";

const normalizeText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const MaterialCard = ({ item, isAuthenticated, onContact }: { item: PublicMaterial; isAuthenticated: boolean; onContact: () => void }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/material/${item._id}`)} activeOpacity={0.8}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}><Ionicons name="cube-outline" size={34} color={Colors.primary} /></View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.infoRow}><Ionicons name="location-outline" size={16} color={Colors.grayText} /><Text style={styles.infoText} numberOfLines={1}>{item.location}</Text></View>
        <View style={styles.infoRow}><Ionicons name="cube-outline" size={16} color={Colors.grayText} /><Text style={styles.infoText}>{item.quantity} {item.unitOfMeasure}</Text></View>
        <TouchableOpacity style={styles.contactButton} onPress={(event) => { event.stopPropagation(); onContact(); }}>
          <Ionicons name={isAuthenticated ? "chatbubble-ellipses-outline" : "lock-closed-outline"} size={16} color={Colors.white} style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>{isAuthenticated ? "Contatar fornecedor" : "Entrar para contatar"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function BrowseMaterialsScreen() {
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const { isAuthenticated, navigateWithAuthentication } = useAuthenticationGate();
  const [searchQuery, setSearchQuery] = useState(params.query ?? "");
  const [activeCategory, setActiveCategory] = useState<string | null>(params.category ?? null);
  const [materials, setMaterials] = useState<PublicMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMaterials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMaterials(await listPublicMaterials());
    } catch (loadError) {
      setError(getPublicContentError(loadError, "Não foi possível carregar os materiais."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- inicia a consulta pública ao montar a tela.
  useEffect(() => { void loadMaterials(); }, [loadMaterials]);

  const categories = useMemo(
    () => Array.from(new Set(materials.map((material) => material.category))).filter(Boolean),
    [materials]
  );

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());
    return materials.filter((material) => {
      const matchesCategory = !activeCategory || normalizeText(material.category) === normalizeText(activeCategory);
      const matchesSearch = !normalizedQuery || normalizeText(material.name).includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, materials]);

  const listHeader = (
    <>
      <View style={styles.header}><Text style={styles.headerTitle}>Encontre Materiais</Text></View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={Colors.grayText} />
        <TextInput placeholder="Buscar por nome do material..." placeholderTextColor={Colors.grayText} style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
      </View>
      {categories.length > 0 && (
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.chip, activeCategory === item && styles.chipSelected]} onPress={() => setActiveCategory((current) => current === item ? null : item)}>
              <Text style={[styles.chipText, activeCategory === item && styles.chipTextSelected]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <PageHeader title="Materiais" />
      <FlatList
        data={isLoading || error ? [] : filteredMaterials}
        renderItem={({ item }) => <MaterialCard item={item} isAuthenticated={isAuthenticated} onContact={() => navigateWithAuthentication(`/chat/${item._id}`)} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <><ActivityIndicator size="large" color={Colors.primary} /><Text style={styles.emptyText}>Carregando materiais...</Text></>
            ) : error ? (
              <><Ionicons name="cloud-offline-outline" size={60} color={Colors.grayText} /><Text style={styles.emptyText}>{error}</Text><TouchableOpacity style={styles.retryButton} onPress={loadMaterials}><Text style={styles.retryButtonText}>Tentar novamente</Text></TouchableOpacity></>
            ) : (
              <><Ionicons name="search-outline" size={60} color={Colors.grayText} /><Text style={styles.emptyText}>Nenhum material encontrado.</Text><Text style={styles.emptySubtext}>Tente ajustar sua busca ou filtros.</Text></>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: Colors.text },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 15, paddingHorizontal: 15, marginHorizontal: 20, borderColor: Colors.neutral, borderWidth: 1 },
  searchInput: { flex: 1, height: 50, fontSize: 16, marginLeft: 10, color: Colors.text },
  categoryScroll: { paddingHorizontal: 20, paddingVertical: 15, gap: 10 },
  chip: { backgroundColor: Colors.white, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.neutral },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.text, fontWeight: "600" },
  chipTextSelected: { color: Colors.white },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 16, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: Colors.neutral, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  cardImage: { width: 100, minHeight: 160, borderRadius: 12, backgroundColor: Colors.neutral },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: Colors.text },
  cardDescription: { fontSize: 14, color: Colors.grayText, marginVertical: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  infoText: { flex: 1, marginLeft: 6, fontSize: 13, color: Colors.grayText, fontWeight: "500" },
  contactButton: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10, marginTop: 10, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  contactIcon: { marginRight: 8 },
  contactButtonText: { color: Colors.white, fontWeight: "bold", fontSize: 14 },
  emptyContainer: { flex: 1, marginTop: 100, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  emptyText: { fontSize: 17, fontWeight: "600", color: Colors.grayText, marginTop: 10, textAlign: "center" },
  emptySubtext: { fontSize: 14, color: Colors.grayText, marginTop: 5 },
  retryButton: { marginTop: 18, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  retryButtonText: { color: Colors.white, fontWeight: "700" },
});
