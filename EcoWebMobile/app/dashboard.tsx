import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  FlatList,
  Image,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { imagesMaterials, imagesProjects } from '../assets/images/image.js';

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
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
}
interface QuickLinkType {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
}

const sectionsData: AppSection[] = [
  {
    title: "Projetos",
    type: "featured",
    data: [
      {
        id: "featured-items",
        items: [
          {
            id: "p1",
            titulo: "Cadeira com Paletes",
            imagem: imagesProjects.cadeira,
          },
          {
            id: "p2",
            titulo: "Vasos com Garrafa PET",
            imagem: imagesProjects.vaso,
          },
          {
            id: "p3",
            titulo: "Bolsa de Retalhos",
            imagem: imagesProjects.bolsa,
          },
        ],
      },
    ],
  },
  {
    title: "Categorias Populares",
    type: "categories",
    data: [
      {
        id: "categories-items",
        items: [
          { id: "c1", name: "Móveis", icon: "bed-outline" },
          { id: "c2", name: "Decoração", icon: "color-palette-outline" },
          { id: "c3", name: "Jardim", icon: "leaf-outline" },
          { id: "c4", name: "Moda", icon: "shirt-outline" },
        ],
      },
    ],
  },
  {
    title: "Materiais Chegando Agora",
    type: "material_list",
    data: [
      {
        id: "m1",
        nome: "Paletes de madeira",
        local: "Madeireira Verde",
        imagem: imagesMaterials.paletes,
      },
      {
        id: "m2",
        nome: "Garrafas de Vidro",
        local: "Restaurante Sabor",
        imagem: imagesMaterials.garrafas,
      },
    ],
  },
  {
    title: "Sua Jornada Criativa",
    type: "quick_links",
    data: [
      {
        id: "quick-links-items",
        items: [
          {
            id: "ql1",
            title: "Nova Postagem",
            icon: "add-circle-outline",
            route: "/project/register",
          },
          {
            id: "ql2",
            title: "Meus Projetos",
            icon: "hammer-outline",
            route: "/project/me",
          },
          {
            id: "ql3",
            title: "Favoritos",
            icon: "heart-outline",
            route: "/profile/favorites",
          },
          {
            id: "ql4",
            title: "Perfil",
            icon: "person-outline",
            route: "/profile",
          },
        ],
      },
    ],
  },
];

type HorizontalSectionWrapper<T> = {
    id: string;
    items: T[];
};

type SectionListItemT =
  | HorizontalSectionWrapper<ProjectType>
  | HorizontalSectionWrapper<CategoryType>
  | HorizontalSectionWrapper<QuickLinkType>
  | MaterialType;
  
interface FeaturedSection {
  title: string;
  type: "featured";
  data: HorizontalSectionWrapper<ProjectType>[]; 
}
interface CategoriesSection {
  title: string;
  type: "categories";
  data: HorizontalSectionWrapper<CategoryType>[]; 
}
interface MaterialListSection {
  title: string;
  type: "material_list";
  data: MaterialType[]; 
}
interface QuickLinksSection {
  title: string;
  type: "quick_links";
  data: HorizontalSectionWrapper<QuickLinkType>[]; 
}
type AppSection =
  | FeaturedSection
  | CategoriesSection
  | MaterialListSection
  | QuickLinksSection;


const CategoryCard = ({ item }: { item: CategoryType }) => (
  <TouchableOpacity style={styles.categoryCard}>
    <Ionicons name={item.icon} size={28} color={Colors.primary} />
    <Text style={styles.categoryCardText}>{item.name}</Text>
  </TouchableOpacity>
);

const QuickLink = ({ item, router }: { item: QuickLinkType; router: any }) => (
  <TouchableOpacity
    style={styles.quickLink}
    onPress={() => router.push(item.route)}
  >
    <Ionicons name={item.icon} size={24} color={Colors.primary} />
    <Text style={styles.quickLinkText}>{item.title}</Text>
  </TouchableOpacity>
);

const FeaturedCard = ({ item, router }: { item: ProjectType; router: any }) => (
  <TouchableOpacity
    style={styles.featuredCard}
    onPress={() => router.push(`/project/${item.id}`)}
  >
    <Image source={{ uri: item.imagem }} style={styles.featuredCardImage} />
    <View style={styles.featuredCardOverlay} />
    <Text style={styles.featuredCardTitle}>{item.titulo}</Text>
  </TouchableOpacity>
);

const MaterialRow = ({ item, router }: { item: MaterialType; router: any }) => (
  <TouchableOpacity
    style={styles.materialRow}
    onPress={() => router.push(`/material/${item.id}`)}
  >
    <Image source={{ uri: item.imagem }} style={styles.materialRowImage} />
    <View style={styles.materialRowContent}>
      <Text style={styles.materialRowTitle}>{item.nome}</Text>
      <Text style={styles.materialRowSubtitle}>{item.local}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
  </TouchableOpacity>
);

export default function ExplorarScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const adaptedSectionsData = React.useMemo(() => {

    const sections = JSON.parse(JSON.stringify(sectionsData)) as AppSection[];
    const quickLinksSection = sections.find((s) => s.type === "quick_links") as
      | QuickLinksSection
      | undefined;

    if (quickLinksSection && user?.userType === "company") {
      const links = quickLinksSection.data[0].items;

      const newPostLink = links.find(
        (l) => l.title === "Nova Postagem"
      );
      if (newPostLink) {
        newPostLink.title = "Novo Material";
        newPostLink.icon = "cube-outline";
        newPostLink.route = "/material/register";
      }

      const myProjectsLink = links.find(
        (l) => l.title === "Meus Projetos"
      );
      if (myProjectsLink) {
        myProjectsLink.title = "Meus Materiais";
        myProjectsLink.icon = "archive-outline"; 
        myProjectsLink.route = "/material/me"; 
      }
    }
    
    return sections;
  }, [user?.userType]);

  const renderItem = ({
    item,
    section,
  }: {
    item: SectionListItemT;
    section: AppSection;
  }) => {
    switch (section.type) {
      case "featured": {
        const featuredWrapper = item as HorizontalSectionWrapper<ProjectType>;
        return (
          <FlatList
            horizontal
            data={featuredWrapper.items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <FeaturedCard item={item} router={router} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContentContainer}
          />
        );
      }
      case "categories": {
        const categoriesWrapper =
          item as HorizontalSectionWrapper<CategoryType>;
        return (
          <FlatList
            horizontal
            data={categoriesWrapper.items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <CategoryCard item={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContentContainer}
          />
        );
      }
      case "material_list":
        return <MaterialRow item={item as MaterialType} router={router} />;
      case "quick_links": {
        const quickLinksWrapper =
          item as HorizontalSectionWrapper<QuickLinkType>;
        return (
          <FlatList
            data={quickLinksWrapper.items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item: link, index }) => (
              <View
                style={[
                  styles.quickLinkWrapperGrid,
                  { marginRight: index % 2 === 0 ? 12 : 0 }, 
                ]}
              >
                <QuickLink item={link} router={router} />
              </View>
            )}
            columnWrapperStyle={styles.quickLinkGridRow}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderSectionHeader = ({
    section: { title, type },
  }: {
    section: AppSection;
  }) => {
    const seeAllRoute =
      type === "featured"
        ? "/project"
        : type === "material_list"
          ? "/material"
          : null;

    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {seeAllRoute && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push(seeAllRoute)}
          >
            <Text style={styles.seeAllText}>Ver todos</Text>
            <Ionicons
              name="arrow-forward-outline"
              size={16}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SectionList
        sections={
          adaptedSectionsData as readonly SectionListData<
            SectionListItemT,
            AppSection
          >[]
        }
        keyExtractor={(item, index) =>
          "id" in item ? item.id : `section-list-item-${index}`
        }
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topHeaderRow}>
              <View>
                <Text style={styles.greeting}>Bem-vindo,</Text>
                <Text style={styles.username}>{user?.name || "User"} 👋</Text>
              </View>
              <TouchableOpacity
                style={styles.messagesButton}
                onPress={() => router.push("/profile/messages")}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={28}
                  color={Colors.text}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={Colors.grayText}
                style={{ marginRight: 8 }}
              />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: Colors.grayText,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  messagesButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginRight: 4,
  },
  flatListContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: "#000",
  },
  featuredCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    opacity: 0.8,
  },
  featuredCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
  },
  featuredCardTitle: {
    position: "absolute",
    bottom: 15,
    left: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
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
    fontWeight: "600",
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
    alignItems: "center",
    justifyContent: "center",
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  categoryCardText: {
    marginTop: 8,
    color: Colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  quickLinkGridRow: {
    justifyContent: 'space-between',
    marginBottom: 12
  },
  quickLinkWrapperGrid: {
    width: '48.5%',
  },
  quickLink: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral,
  },
  quickLinkText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});