import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SectionList,
  TextInput,
  SectionListData,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

// --- TIPOS ---
interface ProjectType {
  id: string;
  titulo: string;
  imagem: string;
}
interface MaterialType {
  id: string;
  nome: string;
  local: string;
  imagem: string;
}
interface CategoryType {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}
interface QuickLinkType {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
}

// --- ESTRUTURA DE DADOS ---
const sectionsData = [
  {
    title: 'Para Você',
    type: 'featured' as const,
    data: [ [ { id: 'p1', titulo: 'Cadeira com Paletes', imagem: 'https://i.imgur.com/O7pzYcL.jpg' }, { id: 'p2', titulo: 'Vasos com Garrafa PET', imagem: 'https://i.imgur.com/WXJr9rJ.jpg' }, { id: 'p3', titulo: 'Bolsa de Retalhos', imagem: 'https://i.imgur.com/Bm2cWYO.jpg' } ] ],
  },
  {
      title: 'Categorias Populares',
      type: 'categories' as const,
      data: [ [ { name: 'Móveis', icon: 'bed-outline' }, { name: 'Decoração', icon: 'color-palette-outline' }, { name: 'Jardim', icon: 'leaf-outline' }, { name: 'Moda', icon: 'shirt-outline' } ] ],
  },
  {
    title: 'Materiais Chegando Agora',
    type: 'material_list' as const,
    data: [
      { id: 'm1', nome: 'Paletes de madeira', local: 'Madeireira Verde', imagem: 'https://i.imgur.com/y2v3fRU.jpg' },
      { id: 'm2', nome: 'Garrafas de Vidro', local: 'Restaurante Sabor', imagem: 'https://i.imgur.com/gD6yYJL.jpg' },
    ],
  },
  // CORREÇÃO 1: Os dados dos links rápidos devem ser agrupados em pares (arrays dentro do array)
  {
      title: 'Sua Jornada Criativa',
      type: 'quick_links' as const,
      data: [
          [ // Primeiro par (linha 1 da grid)
            { title: 'Nova Postagem', icon: 'add-circle-outline', route: '/criar' },
            { title: 'Meus Projetos', icon: 'hammer-outline', route: '/meus-projetos' },
          ],
          [ // Segundo par (linha 2 da grid)
            { title: 'Favoritos', icon: 'heart-outline', route: '/favoritos' },
            { title: 'Perfil', icon: 'person-outline', route: '/perfil' },
          ]
      ],
  },
];

// --- COMPONENTES ---
const CategoryCard = ({ item }: { item: CategoryType }) => (
    <TouchableOpacity style={styles.categoryCard}>
        <Ionicons name={item.icon} size={28} color={Colors.primary} />
        <Text style={styles.categoryCardText}>{item.name}</Text>
    </TouchableOpacity>
);

const QuickLink = ({ item, router }: { item: QuickLinkType, router: any }) => (
    <TouchableOpacity style={styles.quickLink} onPress={() => router.push(item.route)}>
        <Ionicons name={item.icon} size={24} color={Colors.primary} />
        <Text style={styles.quickLinkText}>{item.title}</Text>
    </TouchableOpacity>
);

const FeaturedCard = ({ item, router }: { item: ProjectType, router: any }) => (
  <TouchableOpacity style={styles.featuredCard} onPress={() => router.push(`/projeto/${item.id}`)}>
    <Image source={{ uri: item.imagem }} style={styles.featuredCardImage} />
    <View style={styles.featuredCardOverlay} />
    <Text style={styles.featuredCardTitle}>{item.titulo}</Text>
  </TouchableOpacity>
);

const MaterialRow = ({ item, router }: { item: MaterialType, router: any }) => (
  <TouchableOpacity style={styles.materialRow} onPress={() => {/* Navegar para detalhe do material */}}>
    <Image source={{ uri: item.imagem }} style={styles.materialRowImage} />
    <View style={styles.materialRowContent}>
      <Text style={styles.materialRowTitle}>{item.nome}</Text>
      <Text style={styles.materialRowSubtitle}>{item.local}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function ExplorarScreen() {
  const router = useRouter();

  const renderItem = ({ item, section }: { item: any, section: SectionListData<any> }) => {
    if (section.type === 'featured' || section.type === 'categories') {
      const CardComponent = section.type === 'featured' ? FeaturedCard : CategoryCard;
      return (
        <FlatList
          horizontal
          data={item}
          renderItem={({ item: singleItem }) => <CardComponent item={singleItem} router={router} />}
          keyExtractor={(singleItem) => singleItem.id || singleItem.name}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        />
      );
    }

    if (section.type === 'material_list') {
      return <MaterialRow item={item} router={router} />;
    }

    // CORREÇÃO 2: Lógica para renderizar os pares de links em uma linha
    if (section.type === 'quick_links') {
      return (
        <View style={styles.quickLinkRow}>
          {item.map((link: QuickLinkType) => (
            <View key={link.title} style={styles.quickLinkWrapper}>
              <QuickLink item={link} router={router} />
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SectionList
        sections={sectionsData}
        keyExtractor={(item, index) => (item[0]?.title || item.id || index).toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        // CORREÇÃO 3: REMOVER AS PROPRIEDADES INVÁLIDAS DAQUI
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>Bem-vindo,</Text>
            <Text style={styles.username}>Ruan 👋</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={Colors.grayText} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por 'paletes', 'garrafas'..."
                placeholderTextColor={Colors.grayText}
              />
            </View>
          </View>
        }
      />
    </View>
  );
}

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: Colors.grayText,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8'
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: '#000',
  },
  featuredCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.8,
  },
  featuredCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  featuredCardTitle: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8'
  },
  materialRowImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  materialRowContent: {
    flex: 1,
    marginLeft: 12,
  },
  materialRowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  materialRowSubtitle: {
    fontSize: 14,
    color: Colors.grayText,
    marginTop: 4,
  },
  categoryCard: {
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 16,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: 110,
      height: 110,
      borderWidth: 1,
      borderColor: Colors.neutral,
  },
  categoryCardText: {
      marginTop: 8,
      color: Colors.text,
      fontWeight: '600',
      fontSize: 14,
  },
  quickLinkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginBottom: 12,
  },
  quickLinkWrapper: {
      width: '48.5%', // Ocupa quase metade, com um pequeno espaço no meio
  },
  quickLink: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.neutral,
  },
  quickLinkText: {
      marginLeft: 12,
      fontSize: 16,
      fontWeight: '600',
      color: Colors.text,
  }
});

const CCard = ({ item }: { item: CategoryType }) => <CategoryCard item={item} />;
const QLink = ({ item, router }: { item: QuickLinkType, router: any }) => <QuickLink item={item} router={router} />;
const FCard = ({ item, router }: { item: ProjectType, router: any }) => <FeaturedCard item={item} router={router} />;
const MRow = ({ item, router }: { item: MaterialType, router: any }) => <MaterialRow item={item} router={router} />;
