import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';

const CATEGORIES = ['Madeira', 'Plástico', 'Tecido', 'Vidro', 'Metal', 'Eletrônicos'];

export default function RegisterMaterialScreen() {
  const router = useRouter();
  
  // Estados do formulário
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [materialName, setMaterialName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [location, setLocation] = useState('');

  const handlePickImage = async () => {
    // A mesma função da tela de criar projeto
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Acesso à galeria é necessário.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const canRegister = imageUri && materialName && category && quantity && unit && location;

  const handleRegister = () => {
    if (!canRegister) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const formData = { imageUri, materialName, category, description, quantity, unit, location };
    console.log("Cadastrando material:", formData);
    Alert.alert('Sucesso!', 'Seu material foi cadastrado e está disponível para a comunidade.', [
        { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-outline" size={32} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oferecer Material</Text>
        <TouchableOpacity style={[styles.publishButton, !canRegister && styles.publishButtonDisabled]} disabled={!canRegister} onPress={handleRegister}>
          <Text style={styles.publishButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Foto do Material</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={40} color={Colors.grayText} />
              <Text style={styles.imagePickerText}>Adicionar foto</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Nome do Material</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Paletes de Madeira PBR"
          value={materialName}
          onChangeText={setMaterialName}
        />

        <Text style={styles.sectionTitle}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>{cat}</Text>
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

        <Text style={styles.sectionTitle}>Descrição (Opcional)</Text>
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

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
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
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  imagePicker: {
    height: 200,
    borderRadius: 15,
    backgroundColor: Colors.neutral,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.grayText,
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imagePickerText: {
    marginTop: 8,
    color: Colors.grayText,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 24,
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
      minHeight: 120,
      textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.white,
  },
  quantityContainer: {
      flexDirection: 'row',
      gap: 12,
  },
  quantityInput: {
      flex: 2,
  },
  unitInput: {
      flex: 3,
  }
});