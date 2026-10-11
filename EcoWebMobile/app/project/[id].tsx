import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import YoutubeIframe from "react-native-youtube-iframe";
import { PageHeader } from "../../components/PageHeader";
import { Colors } from "../../constants/Colors";
import { useAuthenticationGate } from "../../hooks/useAuthenticationGate";
import { getAuthorName, getPublicContentError, getPublicProject, PublicProject } from "../../src/services/publicContentService";

const difficultyLabel: Record<PublicProject["difficulty"], string> = {
  Facil: "Fácil",
  Medio: "Médio",
  Dificil: "Difícil",
};

const extractYoutubeId = (url?: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/i);
  return match?.[1] ?? (/^[\w-]{11}$/.test(url) ? url : null);
};

const InfoBlock = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.infoBlock}>
    <Ionicons name={icon} size={24} color={Colors.primary} />
    <View style={styles.infoTextContainer}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>
  </View>
);

export default function ProjectDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, requireAuthentication } = useAuthenticationGate();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleBack = () => router.canGoBack() ? router.back() : router.replace("/project");

  const loadProject = useCallback(async () => {
    if (!id) {
      setError("Projeto não encontrado.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setProject(await getPublicProject(id));
    } catch (loadError) {
      setError(getPublicContentError(loadError, "Não foi possível carregar este projeto."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- inicia a consulta pública ao montar a tela.
  useEffect(() => { void loadProject(); }, [loadProject]);

  const toggleFavorite = () => {
    if (requireAuthentication()) setIsFavorited((value) => !value);
  };

  if (isLoading || error || !project) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <PageHeader title="Projeto" />
        <View style={styles.centerContainer}>
          {isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> : <Ionicons name="alert-circle-outline" size={60} color={Colors.grayText} />}
          <Text style={styles.stateText}>{isLoading ? "Carregando projeto..." : error ?? "Projeto não encontrado."}</Text>
          {!isLoading && <TouchableOpacity style={styles.retryButton} onPress={loadProject}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity>}
        </View>
      </SafeAreaView>
    );
  }

  const videoId = extractYoutubeId(project.video);
  const date = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: project.image }} style={styles.heroImage} />
          <TouchableOpacity accessibilityLabel="Voltar para projetos" accessibilityRole="button" style={[styles.backButton, { top: insets.top + 12 }]} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{project.title}</Text>
            <TouchableOpacity onPress={toggleFavorite} accessibilityLabel={isAuthenticated ? "Favoritar projeto" : "Entrar para favoritar"}>
              <Ionicons name={isFavorited ? "heart" : isAuthenticated ? "heart-outline" : "lock-closed-outline"} size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.author}>por {getAuthorName(project)}{date ? ` em ${date}` : ""}</Text>
          <View style={styles.infoContainer}>
            <InfoBlock icon="bookmark-outline" label="Categoria" value={project.category} />
            <InfoBlock icon="pulse-outline" label="Dificuldade" value={difficultyLabel[project.difficulty] ?? project.difficulty} />
          </View>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{project.description}</Text>
          <Text style={styles.sectionTitle}>Materiais Necessários</Text>
          {project.materials.map((material, index) => <View key={`${material}-${index}`} style={styles.materialItem}><Ionicons name="build-outline" size={20} color={Colors.primary} /><Text style={styles.materialText}>{material}</Text></View>)}
          <Text style={styles.sectionTitle}>Passo a Passo</Text>
          {project.stages.map((stage, index) => <View key={`${stage}-${index}`} style={styles.stageItem}><Text style={styles.stageNumber}>{index + 1}</Text><Text style={styles.stageText}>{stage}</Text></View>)}
          {videoId && (
            <><Text style={styles.sectionTitle}>Tutorial em Vídeo</Text><View style={styles.videoContainer}><YoutubeIframe height={200} play={playing} videoId={videoId} onChangeState={(state: string) => { if (state === "ended") setPlaying(false); }} /></View></>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28 },
  stateText: { marginTop: 12, color: Colors.grayText, textAlign: "center", fontSize: 16 },
  retryButton: { marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  retryText: { color: Colors.white, fontWeight: "700" },
  scrollContent: { paddingBottom: 60 },
  imageContainer: { width: "100%", height: 320 },
  heroImage: { width: "100%", height: "100%", backgroundColor: Colors.neutral },
  backButton: { position: "absolute", left: 20, backgroundColor: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 22 },
  contentContainer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.background, marginTop: -20 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  title: { flex: 1, fontSize: 28, fontWeight: "bold", color: Colors.text },
  author: { fontSize: 14, color: Colors.grayText, marginTop: 6, marginBottom: 20 },
  infoContainer: { flexDirection: "row", gap: 12, marginBottom: 8 },
  infoBlock: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.neutral },
  infoTextContainer: { marginLeft: 10, flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.grayText },
  infoValue: { fontSize: 15, fontWeight: "600", color: Colors.text, marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.text, marginTop: 22, marginBottom: 12 },
  description: { fontSize: 16, color: Colors.text, lineHeight: 25 },
  materialItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, padding: 12, borderRadius: 10, marginBottom: 8 },
  materialText: { flex: 1, marginLeft: 10, color: Colors.text, fontSize: 15 },
  stageItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  stageNumber: { width: 30, height: 30, borderRadius: 15, textAlign: "center", textAlignVertical: "center", paddingTop: 5, backgroundColor: Colors.primary, color: Colors.white, fontWeight: "bold" },
  stageText: { flex: 1, marginLeft: 12, color: Colors.text, fontSize: 15, lineHeight: 22 },
  videoContainer: { overflow: "hidden", borderRadius: 14, backgroundColor: "#000" },
});
