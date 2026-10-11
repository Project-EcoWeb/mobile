import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import api from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthenticationGate } from "../../hooks/useAuthenticationGate";
import { isHttpUrl } from "../../src/utils/validation";
import { getPublicContentError } from "../../src/services/publicContentService";

const CATEGORIES = ["Móveis", "Decoração", "Jardim", "Moda", "Brinquedos"];

export default function CreateProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requireAuthentication } = useAuthenticationGate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [difficulty, setDifficulty] = useState<
    "Facil" | "Medio" | "Dificil" | ""
  >("");

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/project/me");
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    if (!canPublish) {
      Alert.alert(
        "Atenção",
        "Informe título, imagem, categoria, dificuldade, descrição, ao menos um material e um passo."
      );
      return;
    }
    if (!isHttpUrl(imageUri) || (youtubeUrl.trim() && !isHttpUrl(youtubeUrl))) {
      Alert.alert("Link inválido", "Informe links completos iniciados por http:// ou https://.");
      return;
    }
    if (!requireAuthentication()) return;

    try {
      setIsPublishing(true);
      const token = await AsyncStorage.getItem("@ecoweb_token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const payload = {
        title: title.trim(),
        image: imageUri?.trim(),
        category,
        difficulty,
        description: description.trim(),
        materials,
        stages: steps.map((step) => step.trim()).filter(Boolean),
        video: youtubeUrl.trim() || undefined,
      };

      await api.post("/projects", payload);

      Alert.alert("Sucesso", "Projeto cadastrado com sucesso!");
      router.replace("/project/me");
    } catch (error) {
      Alert.alert(
        "Erro",
        getPublicContentError(error, "Não foi possível cadastrar o projeto. Tente novamente.")
      );
    } finally {
      setIsPublishing(false);
    }
  };


  const handleAddMaterial = () => {
    if (
      currentMaterial.trim() !== "" &&
      !materials.includes(currentMaterial.trim())
    ) {
      setMaterials([...materials, currentMaterial.trim()]);
      setCurrentMaterial("");
    }
  };

  const handleRemoveMaterial = (materialToRemove: string) => {
    setMaterials(materials.filter((material) => material !== materialToRemove));
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleStepChange = (text: string, index: number) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const canPublish = Boolean(title.trim() && imageUri?.trim() && category && difficulty && description.trim() && materials.length && steps.some((step) => step.trim()));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8, paddingLeft: insets.left + 16, paddingRight: insets.right + 16 }]}>
        <TouchableOpacity
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          onPress={handleBack}
          style={styles.headerBackButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Projeto</Text>
        <TouchableOpacity
          style={[
            styles.publishButton,
            !canPublish && styles.publishButtonDisabled,
          ]}
          disabled={!canPublish || isPublishing}
          onPress={handlePublish}
        >
          {isPublishing ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.publishButtonText}>Publicar</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 32, paddingLeft: insets.left + 20, paddingRight: insets.right + 20 }]}>
        <Text style={styles.sectionTitle}>URL da Imagem</Text>
        <TextInput
          style={styles.input}
          placeholder="Cole a URL da imagem principal do projeto"
          value={imageUri ?? ""}
          onChangeText={setImageUri}
          autoCapitalize="none"
          keyboardType="url"
        />
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Título do seu projeto"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.sectionTitle}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === cat && styles.chipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Nível de Dificuldade</Text>
        <View style={styles.categoryContainer}>
          {["Facil", "Medio", "Dificil"].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.chip, difficulty === level && styles.chipSelected]}
              onPress={() => setDifficulty(level as any)}
            >
              <Text
                style={[
                  styles.chipText,
                  difficulty === level && styles.chipTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Materiais Utilizados</Text>
        <View style={styles.materialInputContainer}>
          <TextInput
            style={styles.materialInput}
            placeholder="Ex: Garrafa PET"
            value={currentMaterial}
            onChangeText={setCurrentMaterial}
            onSubmitEditing={handleAddMaterial}
          />
          <TouchableOpacity
            style={styles.addMaterialButton}
            onPress={handleAddMaterial}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.materialsList}>
          {materials.map((mat, index) => (
            <View key={index} style={styles.materialTag}>
              <Text style={styles.materialTagText}>{mat}</Text>
              <TouchableOpacity onPress={() => handleRemoveMaterial(mat)}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o que torna seu projeto especial..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.sectionTitle}>Passo a Passo</Text>
        {steps.map((step, index) => (
          <TextInput
            key={index}
            style={[styles.input, styles.textArea, { marginBottom: 10 }]}
            placeholder={`Passo ${index + 1}`}
            value={step}
            onChangeText={(text) => handleStepChange(text, index)}
            multiline
          />
        ))}
        <TouchableOpacity style={styles.addStepButton} onPress={handleAddStep}>
          <Ionicons name="add-outline" size={20} color={Colors.primary} />
          <Text style={styles.addStepButtonText}>Adicionar Passo</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tutorial em Vídeo (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Cole o link do YouTube aqui"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  headerTitle: {
    flex: 1,
    minWidth: 0,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  headerBackButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButton: {
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: Colors.neutral,
  },
  publishButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 20,
  },
  imagePicker: {
    height: 200,
    borderRadius: 15,
    backgroundColor: Colors.neutral,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.grayText,
    borderStyle: "dashed",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  imagePickerText: {
    marginTop: 8,
    color: Colors.grayText,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  input: {
    minWidth: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderColor: Colors.neutral,
    borderWidth: 1,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
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
  materialInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  materialInput: {
    flex: 1,
    minWidth: 0,
    color: Colors.text,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderColor: Colors.neutral,
    borderWidth: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  addMaterialButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  materialsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  materialTag: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  materialTagText: {
    flexShrink: 1,
    color: Colors.primary,
    fontWeight: "bold",
    marginRight: 6,
  },
  addStepButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 20, 
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  addStepButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});
