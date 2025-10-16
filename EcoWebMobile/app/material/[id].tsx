import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { imagesMaterials } from '../../assets/images/image.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMaterialById } from "../../src/services/materialService";

interface CompanyType {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  location: string; 
  responsibleName?: string;
  pickupHours?: string;
  pickupInstructions?: string;  
  isVerified?: boolean;
}

interface MaterialType {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  quantity: string;
  instructions: string;
  category: string;
  company: CompanyType; 
  rating: number;
}

const MOCK_COMPANY: CompanyType = {
  id: "c1",
  name: "Instituto Federal de Roraima (IFRR)",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNjd9KvVovzXePlPVdH90Gs0ZM2XS66QjiWQ&s",
  phone: "(95) 3621-1900",
  location: "Av. Glaycon de Paiva, 2496 - Pricumã, Boa Vista - RR",
  responsibleName: "Prof. George (TADS)",
  pickupHours: "Segunda a Sexta, 08h-12h e 14h-18h",
  pickupInstructions: "Procurar na Coordenação de Análise de Sistemas.",
  isVerified: true
};


const MOCK_MATERIALS: MaterialType[] = [
  { id: "m1", name: "Paletes de Pinho", image: imagesMaterials.paletes, description: "Em bom estado, ideal para móveis e projetos DIY.", location: "Boa Vista, RR - Bloco B", quantity: "15", category: "Madeira", rating: 4.8, company: MOCK_COMPANY, instructions: "Procurar na Coordenação de Análise de Sistemas." },
  { id: "m2", name: "Garrafas de Vidro Verdes", image: imagesMaterials.garrafas, description: "Limpos e sem rótulo, perfeitos para artesanato.", location: "Boa Vista, RR - Cantina", quantity: "5", category: "Vidro", rating: 4.5, company: MOCK_COMPANY, instructions: "Procurar na Coordenação de Análise de Sistemas." },
  { id: "m3", name: "Retalhos de Algodão Colorido", image: imagesMaterials.retalhos, description: "Diversas cores e tamanhos para projetos criativos.", location: "Boa Vista, RR - Sala de Artes", quantity: "5", category: "Tecido", rating: 4.2, company: { ...MOCK_COMPANY, isVerified: false }, instructions: "Procurar na Coordenação de Análise de Sistemas." },
  { id: 'm4', name: 'Sobras de Canos de PVC', image: imagesMaterials.canos, description: 'Diversos diâmetros.', location: 'Boa Vista, RR - Almoxarifado', quantity: '20', category: 'Plástico', rating: 3.2, company: MOCK_COMPANY, instructions: "Procurar na Coordenação de Análise de Sistemas." },
  { id: 'm5', name: 'Latas de Alumínio', image: imagesMaterials.latas, description: 'Amassadas para reciclagem.', location: 'Boa Vista, RR - Refeitório', quantity: '3', category: 'Metal', rating: 5.0, company: { ...MOCK_COMPANY, isVerified: false }, instructions: "Procurar na Coordenação de Análise de Sistemas." },
];

const InfoBlock = ({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string, onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.infoBlock}>
    <Ionicons name={icon} size={24} color={Colors.primary} />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, onPress ? styles.linkValue : null]}>{value}</Text>
    </View>
    {onPress && <Ionicons name="open-outline" size={18} color={Colors.primary} />}
  </TouchableOpacity>
);

const Rating = ({ rating }: { rating: number }) => (
  <View style={styles.ratingContainer}>
    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    {[1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={rating >= star ? 'star' : rating >= star - 0.5 ? 'star-half' : 'star-outline'}
        size={18}
        color="#FFC107"
      />
    ))}
  </View>
);

export default function MaterialDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [material, setMaterial] = useState<MaterialType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadMaterial = async () => {
      if (!id) {
        setError("ID do material não fornecido.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setMaterial(null);

      const mockMaterial = MOCK_MATERIALS.find(m => m.id === id);
      if (mockMaterial) {
        setMaterial(mockMaterial);
        setIsLoading(false);
        return;
      }

      try {
        const token = await AsyncStorage.getItem('@ecoweb_token');
        if (!token) {
          throw new Error("Usuário não autenticado.");
        }

        const response = await getMaterialById(id, token);
        const apiData = response.data;

        const normalizedMaterial: MaterialType = {
          id: apiData._id,
          name: apiData.name,
          image: apiData.image || (apiData.fotos ? apiData.fotos[0] : ''),
          description: apiData.description,
          location: apiData.location,
          quantity: `${apiData.quantity} ${apiData.unitOfMeasure}`,
          category: apiData.category,
          instructions: apiData.instructions || "Buscar com pessoa de contato",
          company: { 
            id: apiData.company._id,
            name: apiData.company.name,
            logo: apiData.company.logo,
            phone: apiData.company.phone,
            location: apiData.company.location, 
            responsibleName: apiData.company.responsibleName,
            pickupHours: apiData.company.pickupHours || "Segunda a Sexta, 08h-12h e 14h-18h",
            isVerified: apiData.company.isVerified || false, 
          },
          rating: apiData.rating || 4.0,
        };

        setMaterial(normalizedMaterial);

      } catch (err: any) {
        console.error("Falha ao buscar material:", err);
        setError("Não foi possível carregar este material.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterial();
  }, [id]);

  const onShare = async () => {
    Alert.alert('Função indisponivel')
   };

  const openMaps = (address: string) => {
    Alert.alert('Função indisponivel')
  };

  const openPhone = (phoneNumber: string) => {
    Alert.alert('Função indisponivel')
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, color: Colors.grayText }}>Carregando material...</Text>
      </View>
    ); 
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={Colors.grayText} />
        <Text style={{ marginTop: 10, fontSize: 16, color: Colors.grayText, textAlign: 'center' }}>{error}</Text>
      </View>
    ); 
  }

  if (!material) {
    return (
      <View style={styles.centerContainer}><Text>Material não encontrado!</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={{ uri: material.image }} style={styles.heroImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{material.category}</Text>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
                <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={28} color={isFavorited ? '#0D4D44' : Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onShare}>
                <Ionicons name="share-social-outline" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.title}>{material.name}</Text>
          <Rating rating={material.rating} />

          <Text style={styles.sectionTitle}>Logística e Quantidade</Text>
          <View style={styles.infoContainer}>
            <InfoBlock
              icon="location-outline"
              label="Local de Retirada"
              value={material.location}
              onPress={() => openMaps(material.company.location)}
            />
            <InfoBlock
              icon="cube-outline"
              label="Quantidade"
              value={material.quantity}
            />
          </View>

          <View style={styles.additionalInfoContainer}>
            {material.company.pickupHours && (
              <InfoBlock
                icon="time-outline"
                label="Horário para Retirada"
                value={material.company.pickupHours}
              />
            )}
            {material.company.pickupInstructions && (
              <InfoBlock
                icon="information-circle-outline"
                label="Instruções de Retirada"
                value={material.instructions}
              />
            )}
          </View>

          <Text style={styles.sectionTitle}>Sobre o Material</Text>
          <Text style={styles.description}>{material.description}</Text>

          <Text style={styles.sectionTitle}>Sobre o Doador</Text>

          <View style={styles.companyHeader}>
            {material.company.logo ? (
              <Image source={{ uri: material.company.logo }} style={styles.companyLogo} />
            ) : (
              <View style={[styles.companyLogo, styles.logoPlaceholder]}>
                <Ionicons name="business" size={30} color={Colors.primary} />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.companyName}>{material.company.name}</Text>
              {material.company.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                  <Text style={styles.verifiedText}>Doador Verificado</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.additionalInfoContainer}>
            {material.company.location && (
              <InfoBlock
                icon="location-outline"
                label="Endereço"
                value={material.company.location}
                onPress={() => openMaps(material.company.location)}
              />
            )}
            {material.company.responsibleName && (
              <InfoBlock
                icon="person-outline"
                label="Pessoa de Contato"
                value={material.company.responsibleName}
              />
            )}
            {material.company.phone && (
              <InfoBlock
                icon="call-outline"
                label="Telefone"
                value={material.company.phone}
                onPress={() => openPhone(material.company.phone)}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Alert.alert("Função indisponivel")}
          >
            <Text style={styles.linkButtonText}>Ver todos os materiais deste doador</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>

        </View>
      </ScrollView>

      <TouchableOpacity style={styles.ctaButton} onPress={() => router.push(`../chat/${'msg1'}`)}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.white} />
        <Text style={styles.ctaButtonText}>Tenho Interesse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: 320, backgroundColor: Colors.neutral },
  backButton: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  contentContainer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.background, marginTop: -20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryChip: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryChipText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 13
  },
  actionsRow: { flexDirection: 'row', gap: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginTop: 12 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 12 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginRight: 6 },
  infoContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral,
    minWidth: '48%',
  },
  infoLabel: { fontSize: 12, color: Colors.grayText },
  infoValue: { fontSize: 15, fontWeight: '600', color: Colors.text, marginTop: 2 },
  linkValue: { color: Colors.primary, textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginTop: 16, marginBottom: 12 },
  description: { fontSize: 16, color: Colors.text, lineHeight: 25, marginBottom: 16 },
  ctaButton: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: Colors.primary, padding: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', elevation: 8, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8 },
  ctaButtonText: { color: Colors.white, fontSize: 17, fontWeight: 'bold', marginLeft: 10, },

  additionalInfoContainer: {
    gap: 12,
    marginBottom: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 16,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.neutral,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  verifiedText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral,
    backgroundColor: Colors.white,
    marginTop: 8,
  },
  linkButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  }
});