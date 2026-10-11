import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../components/PageHeader";
import { Colors } from "../constants/Colors";
import { getPublicContentError, PublicMaterial, PublicProject, searchPublicContent } from "../src/services/publicContentService";

type ResultItem =
  | { type: "project"; data: PublicProject }
  | { type: "material"; data: PublicMaterial };

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query ?? "");
  const [submittedQuery, setSubmittedQuery] = useState(params.query ?? "");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (value: string) => {
    const normalizedQuery = value.trim().slice(0, 100);
    if (!normalizedQuery) {
      setResults([]);
      setSubmittedQuery("");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSubmittedQuery(normalizedQuery);
      const response = await searchPublicContent(normalizedQuery);
      setResults([
        ...response.results.projects.map((data): ResultItem => ({ type: "project", data })),
        ...response.results.materials.map((data): ResultItem => ({ type: "material", data })),
      ]);
    } catch (searchError) {
      setResults([]);
      setError(getPublicContentError(searchError, "Não foi possível realizar a busca."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- executa a consulta recebida pela navegação.
  useEffect(() => { if (params.query) void search(params.query); }, [params.query, search]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <PageHeader title="Buscar" />
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={Colors.grayText} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Projetos e materiais..."
          placeholderTextColor={Colors.grayText}
          returnKeyType="search"
          maxLength={100}
          onSubmitEditing={() => void search(query)}
          autoFocus={!params.query}
        />
        <TouchableOpacity onPress={() => void search(query)} accessibilityLabel="Buscar">
          <Ionicons name="arrow-forward-circle" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.data._id}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const title = item.type === "project" ? item.data.title : item.data.name;
          const subtitle = item.type === "project" ? item.data.category : `${item.data.quantity} ${item.data.unitOfMeasure} · ${item.data.location}`;
          const image = item.data.image;
          return (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/${item.type}/${item.data._id}`)} activeOpacity={0.8}>
              {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={[styles.image, styles.placeholder]}><Ionicons name="leaf-outline" size={28} color={Colors.primary} /></View>}
              <View style={styles.cardContent}>
                <Text style={styles.type}>{item.type === "project" ? "PROJETO" : "MATERIAL"}</Text>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={submittedQuery && !isLoading && !error ? <Text style={styles.resultSummary}>{results.length} resultado(s) para “{submittedQuery}”</Text> : null}
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <><ActivityIndicator size="large" color={Colors.primary} /><Text style={styles.emptyText}>Buscando...</Text></>
            ) : error ? (
              <><Ionicons name="cloud-offline-outline" size={56} color={Colors.grayText} /><Text style={styles.emptyText}>{error}</Text><TouchableOpacity style={styles.retryButton} onPress={() => void search(submittedQuery)}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity></>
            ) : (
              <><Ionicons name="search-outline" size={56} color={Colors.grayText} /><Text style={styles.emptyText}>{submittedQuery ? "Nenhum resultado encontrado." : "Digite o que você procura."}</Text></>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { flexDirection: "row", alignItems: "center", margin: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.neutral, borderRadius: 15, paddingHorizontal: 15 },
  searchInput: { flex: 1, height: 52, marginHorizontal: 10, fontSize: 16, color: Colors.text },
  listContent: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  resultSummary: { color: Colors.grayText, marginBottom: 12, fontWeight: "600" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.neutral, borderRadius: 16, padding: 12, marginBottom: 12 },
  image: { width: 78, height: 78, borderRadius: 12, backgroundColor: Colors.neutral },
  placeholder: { alignItems: "center", justifyContent: "center" },
  cardContent: { flex: 1, marginHorizontal: 12 },
  type: { fontSize: 11, color: Colors.primary, fontWeight: "800", marginBottom: 3 },
  title: { fontSize: 16, color: Colors.text, fontWeight: "700" },
  subtitle: { marginTop: 4, fontSize: 13, color: Colors.grayText },
  empty: { flex: 1, minHeight: 320, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  emptyText: { fontSize: 17, fontWeight: "600", color: Colors.grayText, textAlign: "center", marginTop: 12 },
  retryButton: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  retryText: { color: Colors.white, fontWeight: "700" },
});
