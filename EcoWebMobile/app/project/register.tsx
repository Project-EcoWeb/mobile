import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
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

const CATEGORIES = ["Móveis", "Decoração", "Jardim", "Moda", "Brinquedos"];

export default function CreateProjectScreen() {
  const router = useRouter();
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

  const handlePublish = async () => {
    if (!title || !imageUri || !category) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("@ecoweb_token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const payload = {
        title,
        image: imageUri,
        category,
        difficulty,
        description,
        materials,
        stages: steps,
        video: youtubeUrl,
      };

      await api.post("/projects", payload);

      Alert.alert("Sucesso", "Projeto cadastrado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao cadastrar projeto", error);
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o projeto. Tente novamente."
      );
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

  const canPublish = title && imageUri && category && difficulty;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Novo Projeto</Text>
        <TouchableOpacity
          style={[
            styles.publishButton,
            !canPublish && styles.publishButtonDisabled,
          ]}
          disabled={!canPublish}
          onPress={handlePublish}
        >
          <Text style={styles.publishButtonText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  publishButton: {
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  materialTagText: {
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
