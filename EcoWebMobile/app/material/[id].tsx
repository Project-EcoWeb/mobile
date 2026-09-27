import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PageHeader } from "../../components/PageHeader";
import { Colors } from "../../constants/Colors";
import { useAuthenticationGate } from "../../hooks/useAuthenticationGate";
import { getInstitution, getPublicContentError, getPublicMaterial, PublicMaterial } from "../../src/services/publicContentService";

const InfoBlock = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.infoBlock}>
    <Ionicons name={icon} size={24} color={Colors.primary} />
    <View style={styles.infoTextContainer}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>
  </View>
);

export default function MaterialDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, navigateWithAuthentication, requireAuthentication } = useAuthenticationGate();
  const [material, setMaterial] = useState<PublicMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBack = () => router.canGoBack() ? router.back() : router.replace("/material");

  const loadMaterial = useCallback(async () => {
    if (!id) {
      setError("Material não encontrado.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setMaterial(await getPublicMaterial(id));
    } catch (loadError) {
      setError(getPublicContentError(loadError, "Não foi possível carregar este material."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- inicia a consulta pública ao montar a tela.
  useEffect(() => { void loadMaterial(); }, [loadMaterial]);

  if (isLoading || error || !material) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <PageHeader title="Material" />
        <View style={styles.centerContainer}>
          {isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> : <Ionicons name="alert-circle-outline" size={60} color={Colors.grayText} />}
          <Text style={styles.stateText}>{isLoading ? "Carregando material..." : error ?? "Material não encontrado."}</Text>
          {!isLoading && <TouchableOpacity style={styles.retryButton} onPress={loadMaterial}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity>}
        </View>
      </SafeAreaView>
    );
  }

  const institution = getInstitution(material);
  const toggleFavorite = () => {
    if (requireAuthentication()) setIsFavorited((value) => !value);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {material.image ? (
          <Image source={{ uri: material.image }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}><Ionicons name="cube-outline" size={64} color={Colors.primary} /></View>
        )}
        <TouchableOpacity accessibilityLabel="Voltar para materiais" accessibilityRole="button" style={[styles.backButton, { top: insets.top + 12 }]} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.categoryChip}><Text style={styles.categoryChipText}>{material.category}</Text></View>
            <TouchableOpacity onPress={toggleFavorite} accessibilityLabel={isAuthenticated ? "Favoritar material" : "Entrar para favoritar"}>
              <Ionicons name={isFavorited ? "heart" : isAuthenticated ? "heart-outline" : "lock-closed-outline"} size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{material.name}</Text>
          <Text style={styles.sectionTitle}>Logística e Quantidade</Text>
          <View style={styles.infoContainer}>
            <InfoBlock icon="location-outline" label="Local de retirada" value={material.location} />
            <InfoBlock icon="cube-outline" label="Quantidade" value={`${material.quantity} ${material.unitOfMeasure}`} />
          </View>
          {material.instructions && <View style={styles.additionalInfoContainer}><InfoBlock icon="information-circle-outline" label="Instruções de retirada" value={material.instructions} /></View>}
          <Text style={styles.sectionTitle}>Sobre o Material</Text>
          <Text style={styles.description}>{material.description}</Text>
          {institution && (
            <>
              <Text style={styles.sectionTitle}>Sobre o Doador</Text>
              <View style={styles.companyHeader}>
                {institution.logo ? <Image source={{ uri: institution.logo }} style={styles.companyLogo} /> : <View style={[styles.companyLogo, styles.logoPlaceholder]}><Ionicons name="business" size={30} color={Colors.primary} /></View>}
                <View style={styles.companyText}><Text style={styles.companyName}>{institution.name}</Text><Text style={styles.companyLocation}>{institution.location}</Text></View>
              </View>
              <TouchableOpacity style={styles.linkButton} onPress={() => router.push(`/institution/${institution._id}` as never)}>
                <Text style={styles.linkButtonText}>Ver materiais deste doador</Text><Ionicons name="arrow-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.ctaButton} onPress={() => navigateWithAuthentication(`/chat/${material._id}`)}>
        <Ionicons name={isAuthenticated ? "chatbubble-ellipses-outline" : "lock-closed-outline"} size={22} color={Colors.white} />
        <Text style={styles.ctaButtonText}>{isAuthenticated ? "Tenho interesse" : "Entrar para demonstrar interesse"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28 },
  stateText: { marginTop: 12, color: Colors.grayText, textAlign: "center", fontSize: 16 },
  retryButton: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  retryText: { color: Colors.white, fontWeight: "700" },
  scrollContent: { paddingBottom: 120 },
  heroImage: { width: "100%", height: 320, backgroundColor: Colors.neutral },
  heroPlaceholder: { alignItems: "center", justifyContent: "center" },
  backButton: { position: "absolute", left: 20, backgroundColor: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 22 },
  contentContainer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.background, marginTop: -20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryChip: { backgroundColor: Colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  categoryChipText: { color: Colors.primary, fontWeight: "bold", fontSize: 13 },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.text, marginTop: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.text, marginTop: 22, marginBottom: 12 },
  infoContainer: { flexDirection: "row", gap: 12, marginBottom: 16 },
  infoBlock: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.neutral },
  infoTextContainer: { marginLeft: 10, flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.grayText },
  infoValue: { fontSize: 15, fontWeight: "600", color: Colors.text, marginTop: 2 },
  additionalInfoContainer: { marginBottom: 6 },
  description: { fontSize: 16, color: Colors.text, lineHeight: 25, marginBottom: 8 },
  companyHeader: { flexDirection: "row", alignItems: "center", gap: 15, backgroundColor: Colors.white, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.neutral },
  companyLogo: { width: 60, height: 60, borderRadius: 12, backgroundColor: Colors.neutral },
  logoPlaceholder: { justifyContent: "center", alignItems: "center" },
  companyText: { flex: 1 },
  companyName: { fontSize: 18, fontWeight: "bold", color: Colors.text },
  companyLocation: { color: Colors.grayText, marginTop: 4, lineHeight: 19 },
  linkButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.neutral, backgroundColor: Colors.white, marginTop: 12 },
  linkButtonText: { color: Colors.primary, fontSize: 16, fontWeight: "bold" },
  ctaButton: { position: "absolute", bottom: 30, left: 20, right: 20, backgroundColor: Colors.primary, padding: 18, borderRadius: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", elevation: 8, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8 },
  ctaButtonText: { color: Colors.white, fontSize: 16, fontWeight: "bold", marginLeft: 10 },
});
