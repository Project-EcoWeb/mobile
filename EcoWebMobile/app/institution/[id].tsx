import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../components/PageHeader";
import { Colors } from "../../constants/Colors";
import { getPublicContentError, getPublicInstitutionProfile, PublicInstitutionProfile } from "../../src/services/publicContentService";

export default function InstitutionProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicInstitutionProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      setProfile(await getPublicInstitutionProfile(id));
    } catch (loadError) {
      setError(getPublicContentError(loadError, "Não foi possível carregar este doador."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- inicia a consulta pública ao montar a tela.
  useEffect(() => { void loadProfile(); }, [loadProfile]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <PageHeader title="Doador" />
      {isLoading || error || !profile ? (
        <View style={styles.state}>
          {isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> : <Ionicons name="alert-circle-outline" size={56} color={Colors.grayText} />}
          <Text style={styles.stateText}>{isLoading ? "Carregando doador..." : error ?? "Doador não encontrado."}</Text>
          {!isLoading && <TouchableOpacity style={styles.retryButton} onPress={loadProfile}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity>}
        </View>
      ) : (
        <FlatList
          data={profile.materials}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.profileHeader}>
              {profile.logo ? <Image source={{ uri: profile.logo }} style={styles.logo} /> : <View style={[styles.logo, styles.placeholder]}><Ionicons name="business" size={36} color={Colors.primary} /></View>}
              <Text style={styles.name}>{profile.name}</Text>
              <View style={styles.locationRow}><Ionicons name="location-outline" size={18} color={Colors.grayText} /><Text style={styles.location}>{profile.location}</Text></View>
              <Text style={styles.sectionTitle}>Materiais disponíveis</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/material/${item._id}`)}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.cardImage} /> : <View style={[styles.cardImage, styles.placeholder]}><Ionicons name="cube-outline" size={28} color={Colors.primary} /></View>}
              <View style={styles.cardContent}><Text style={styles.cardTitle}>{item.name}</Text><Text style={styles.cardSubtitle} numberOfLines={2}>{item.quantity} {item.unitOfMeasure} · {item.location}</Text></View>
              <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<View style={styles.empty}><Ionicons name="cube-outline" size={48} color={Colors.grayText} /><Text style={styles.stateText}>Este doador não possui materiais publicados.</Text></View>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  state: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 },
  stateText: { marginTop: 12, fontSize: 16, color: Colors.grayText, textAlign: "center" },
  retryButton: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  retryText: { color: Colors.white, fontWeight: "700" },
  listContent: { padding: 20, flexGrow: 1 },
  profileHeader: { alignItems: "center" },
  logo: { width: 90, height: 90, borderRadius: 18, backgroundColor: Colors.neutral },
  placeholder: { alignItems: "center", justifyContent: "center" },
  name: { marginTop: 14, fontSize: 24, fontWeight: "800", color: Colors.text, textAlign: "center" },
  locationRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 8, paddingHorizontal: 12 },
  location: { flex: 1, marginLeft: 6, color: Colors.grayText, textAlign: "center" },
  sectionTitle: { width: "100%", marginTop: 28, marginBottom: 14, fontSize: 20, fontWeight: "700", color: Colors.text },
  card: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 12, backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.neutral },
  cardImage: { width: 70, height: 70, borderRadius: 10, backgroundColor: Colors.neutral },
  cardContent: { flex: 1, marginHorizontal: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  cardSubtitle: { marginTop: 5, color: Colors.grayText, fontSize: 13 },
  empty: { alignItems: "center", paddingVertical: 60 },
});
