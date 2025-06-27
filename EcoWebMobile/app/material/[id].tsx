import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';

// --- TIPO ATUALIZADO ---
// Reflete exatamente a estrutura do seu array de dados mock
interface MaterialType {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  quantity: string;
  category: string;
  rating: number;
  verified: boolean;
}

// Seus dados mock, agora dentro do componente para fácil referência
const MOCK_MATERIALS: MaterialType[] = [
  { id: "m1", name: "Paletes de Pinho", image: "https://i.imgur.com/y2v3fRU.jpg", description: "Em bom estado, ideal para móveis e projetos DIY.", location: "Boa Vista, RR", quantity: "15 unidades", category: "Madeira", rating: 4.8, verified: true },
  { id: "m2", name: "Garrafas de Vidro Verdes", image: "https://i.imgur.com/gD6yYJL.jpg", description: "Limpos e sem rótulo, perfeitos para artesanato.", location: "Boa Vista, RR", quantity: "5 caixas", category: "Vidro", rating: 4.5, verified: true },
  { id: "m3", name: "Retalhos de Algodão Colorido", image: "https://i.imgur.com/Bm2cWYO.jpg", description: "Diversas cores e tamanhos para projetos criativos.", location: "Boa Vista, RR", quantity: "Aprox. 5kg", category: "Tecido", rating: 4.2, verified: false },
  { id: 'm4', name: 'Sobras de Canos de PVC', image: 'https://reciclasampa.com.br/imagens/noticias/grandes/3257_destaque.jpg', description: 'Diversos diâmetros.', location: 'Boa Vista, RR', quantity: '20 peças', category: 'Plástico', rating: 3.2, verified: true},
  { id: 'm5', name: 'Latas de Alumínio', image: 'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2021/08/latas-de-aluminio.jpg', description: 'Amassadas para reciclagem.', location: 'Boa Vista, RR', quantity: '3 sacos grandes', category: 'Metal', rating: 5.0, verified: false },
  // ... adicione outros se necessário
];

// --- Componente de Bloco de Informação ---
const InfoBlock = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string }) => (
    <View style={styles.infoBlock}>
        <Ionicons name={icon} size={24} color={Colors.primary} />
        <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

// --- Componente de Avaliação (Estrelas) ---
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
  
  // MUDANÇA: Usando .find() para procurar o material no array
  const material = MOCK_MATERIALS.find(m => m.id === id);

  const [isFavorited, setIsFavorited] = useState(false);

  const onShare = async () => {
    // ... (função de compartilhar permanece a mesma)
  };

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
          
          <View style={styles.infoContainer}>
            <InfoBlock icon="location-outline" label="Local de Retirada" value={material.location} />
            <InfoBlock icon="cube-outline" label="Quantidade" value={material.quantity} />
          </View>
          
          <Text style={styles.sectionTitle}>Sobre o Material</Text>
          {material.verified && (
            <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
                <Text style={styles.verifiedText}>Fornecedor Verificado</Text>
            </View>
          )}
          <Text style={styles.description}>{material.description}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.ctaButton} onPress={() => Alert.alert('Interesse Registrado!', 'A funcionalidade de chat será implementada em breve.')}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.white} />
          <Text style={styles.ctaButtonText}>Tenho Interesse</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Estilos ---
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
  infoBlock: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.neutral },
  infoLabel: { fontSize: 12, color: Colors.grayText },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginTop: 16, marginBottom: 12 },
  verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.neutral,
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 12,
  },
  verifiedText: {
      color: Colors.primary,
      fontWeight: 'bold',
      marginLeft: 6,
  },
  description: { fontSize: 16, color: Colors.text, lineHeight: 25 },
  ctaButton: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: Colors.primary, padding: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', elevation: 8, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8 },
  ctaButtonText: { color: Colors.white, fontSize: 17, fontWeight: 'bold', marginLeft: 10, }
});