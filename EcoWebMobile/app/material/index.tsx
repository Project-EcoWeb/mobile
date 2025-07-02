import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState , useEffect } from "react";
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
import { imagesMaterials } from "../../assets/images/image.js";
interface MaterialType {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  quantity: string;
  category: "Madeira" | "Plástico" | "Tecido" | "Vidro" | "Metal";
}

const MOCK_MATERIALS: MaterialType[] = [
  {
    id: "m1",
    name: "Paletes de Pinho",
    image: imagesMaterials.paletes ,
    description: "Em bom estado, ideal para móveis.",
    location: "Boa Vista, RR",
    quantity: "15 unidades",
    category: "Madeira",
  },
  {
    id: "m2",
    name: "Garrafas de Vidro Verdes",
    image: imagesMaterials.garrafas,
    description: "Limpos e sem rótulo.",
    location: "Boa Vista, RR",
    quantity: "5 caixas",
    category: "Vidro",
  },
  {
    id: "m3",
    name: "Retalhos de Algodão Colorido",
    image: imagesMaterials.retalhos,
    description: "Diversas cores e tamanhos.",
    location: "Boa Vista, RR",
    quantity: "Aprox. 5kg",
    category: "Tecido",
  },
  {
    id: "m4",
    name: "Sobras de Canos de PVC",
    image: imagesMaterials.canos,
    description: "Diversos diâmetros.",
    location: "Boa Vista, RR",
    quantity: "20 peças",
    category: "Plástico",
  },
  {
    id: "m5",
    name: "Latas de Alumínio",
    image: imagesMaterials.latas,
    description: "Amassadas para reciclagem.",
    location: "Boa Vista, RR",
    quantity: "3 sacos grandes",
    category: "Metal",
  },
];

const CATEGORIES: MaterialType["category"][] = [
  "Madeira",
  "Plástico",
  "Tecido",
  "Vidro",
  "Metal",
];

const MaterialCard = ({
  item,
  router,
}: {
  item: MaterialType;
  router: any;
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => router.push(`/material/${item.id}`)}
    activeOpacity={0.8}
  >
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={Colors.grayText} />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="cube-outline" size={16} color={Colors.grayText} />
        <Text style={styles.infoText}>{item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.contactButton}
        onPress={(e) => {
          e.stopPropagation(); 
          router.push(`../chat/${item.id}`); 
        }}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={16}
          color={Colors.white}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.contactButtonText}>Contatar Fornecedor</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function BrowseMaterialsScreen() {
  const router = useRouter(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [apiMaterials, setApiMaterials] = useState<MaterialType[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/materials");
        const formattedMaterials: MaterialType[] = response.data.map(
          (mat: any) => ({
            id: mat._id || mat.id,
            name: mat.name,
            image: mat.image,
            description: mat.description,
            location: mat.location,
            quantity: mat.quantity,
            category: mat.category,
          })
        );
        setApiMaterials(formattedMaterials);
      } catch (error) {
        console.error("Erro ao buscar materiais da API:", error);
      }
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = useMemo(() => {
    const combinedMaterials = [...MOCK_MATERIALS, ...apiMaterials];

    return combinedMaterials.filter((material) => {
      const matchesCategory =
        !activeCategory || material.category === activeCategory;
      const matchesSearch = material.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, apiMaterials]);

  const ListHeader = (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Encontre Materiais</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={Colors.grayText} />
        <TextInput
          placeholder="Buscar por nome do material..."
          placeholderTextColor={Colors.grayText}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View>
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
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <FlatList
        data={filteredMaterials}
        renderItem={({ item }) => <MaterialCard item={item} router={router} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={60} color={Colors.grayText} />
            <Text style={styles.emptyText}>Nenhum material encontrado.</Text>
            <Text style={styles.emptySubtext}>
              Tente ajustar sua busca ou filtros.
            </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: 20,
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
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardImage: {
    width: 100,
    height: "100%",
    borderRadius: 12,
    backgroundColor: Colors.neutral,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.grayText,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.grayText,
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row", 
    justifyContent: "center",
  },
  contactButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.grayText,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.grayText,
    marginTop: 5,
  },
});
