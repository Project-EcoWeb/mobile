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

const CATEGORIES = [
  "Madeira",
  "Plástico",
  "Tecido",
  "Vidro",
  "Metal",
  "Eletrônicos",
];

export default function RegisterMaterialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requireAuthentication } = useAuthenticationGate();
  const [isPublishing, setIsPublishing] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [materialName, setMaterialName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/material/me");
  };

  const numericQuantity = Number(quantity.trim().replace(",", "."));
  const canRegister = Boolean(materialName.trim() && category && description.trim() && quantity.trim() && Number.isFinite(numericQuantity) && numericQuantity >= 1 && unit.trim() && location.trim());

  const handleRegister = async () => {
    if (isPublishing) return;
    if (!canRegister) {
      Alert.alert(
        "Campos Incompletos",
        "Informe nome, categoria, descrição, quantidade de pelo menos 1, unidade e local de retirada."
      );
      return;
    }
    if (imageUri?.trim() && !isHttpUrl(imageUri)) {
      Alert.alert("Link inválido", "Informe um link de imagem iniciado por http:// ou https://.");
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
        name: materialName.trim(),
        image: imageUri?.trim() || undefined,
        category,
        description: description.trim(),
        quantity: numericQuantity,
        unitOfMeasure: unit.trim(),
        location: location.trim(),
      };

      await api.post("/materials", payload);

      Alert.alert(
        "Sucesso!",
        "Seu material foi cadastrado e está disponível para a comunidade.",
        [{ text: "OK", onPress: () => router.replace("/material/me") }]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        getPublicContentError(error, "Não foi possível cadastrar o material. Tente novamente.")
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8, paddingLeft: insets.left + 16, paddingRight: insets.right + 16 }]}>
        <TouchableOpacity
          accessibilityLabel="Voltar para meus materiais"
          accessibilityRole="button"
          onPress={handleBack}
          style={styles.headerBackButton}
        >
          <Ionicons name="close-outline" size={32} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oferecer Material</Text>
        <TouchableOpacity
          style={[
            styles.publishButton,
            !canRegister && styles.publishButtonDisabled,
          ]}
          disabled={!canRegister || isPublishing}
          onPress={handleRegister}
        >
          {isPublishing ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.publishButtonText}>Cadastrar</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 32, paddingLeft: insets.left + 20, paddingRight: insets.right + 20 }]}>
        <Text style={styles.sectionTitle}>URL da Imagem (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Cole a URL da imagem do material"
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

        <Text style={styles.sectionTitle}>Nome do Material</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Paletes de Madeira PBR"
          value={materialName}
          onChangeText={setMaterialName}
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

        <Text style={styles.sectionTitle}>Quantidade Disponível</Text>
        <View style={styles.quantityContainer}>
          <TextInput
            style={[styles.input, styles.quantityInput]}
            placeholder="15"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.unitInput]}
            placeholder="Unidades"
            value={unit}
            onChangeText={setUnit}
          />
        </View>

        <Text style={styles.sectionTitle}>Local de Retirada</Text>
        <TextInput
          style={styles.input}
          placeholder="Endereço completo"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.sectionTitle}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Condição do material, frequência de descarte, etc."
          value={description}
          onChangeText={setDescription}
          multiline
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
    textAlign: "center",
    marginHorizontal: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
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
    paddingBottom: 40,
  },
  imagePicker: {
    height: 200,
    borderRadius: 15,
    backgroundColor: Colors.neutral,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.grayText,
    borderStyle: "dashed",
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
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
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
    marginTop: 24,
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
    minHeight: 120,
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
  quantityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  quantityInput: {
    flex: 2,
  },
  unitInput: {
    flex: 3,
  },
  headerBackButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
