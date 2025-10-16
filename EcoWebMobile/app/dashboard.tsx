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
  <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
    <View style={styles.categoryIconContainer}>
      <Ionicons name={item.icon} size={32} color={Colors.primary} />
    </View>
    <Text style={styles.categoryCardText}>{item.name}</Text>
  </TouchableOpacity>
);

const QuickLink = ({ item, router }: { item: QuickLinkType; router: any }) => (
  <TouchableOpacity
    style={styles.quickLink}
    onPress={() => router.push(item.route)}
    activeOpacity={0.7}
  >
    <View style={styles.quickLinkIconContainer}>
      <Ionicons name={item.icon} size={26} color={Colors.primary} />
    </View>
    <Text style={styles.quickLinkText}>{item.title}</Text>
  </TouchableOpacity>
);

const FeaturedCard = ({ item, router }: { item: ProjectType; router: any }) => (
  <TouchableOpacity
    style={styles.featuredCard}
    onPress={() => router.push(`/project/${item.id}`)}
    activeOpacity={0.9}
  >
    <Image source={{ uri: item.imagem }} style={styles.featuredCardImage} />
    <View style={styles.featuredCardGradient} />
    <View style={styles.featuredCardContent}>
      <Text style={styles.featuredCardTitle}>{item.titulo}</Text>
      <View style={styles.featuredCardBadge}>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </View>
    </View>
  </TouchableOpacity>
);

const MaterialRow = ({ item, router }: { item: MaterialType; router: any }) => (
  <TouchableOpacity
    style={styles.materialRow}
    onPress={() => router.push(`/material/${item.id}`)}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.imagem }} style={styles.materialRowImage} />
    <View style={styles.materialRowContent}>
      <Text style={styles.materialRowTitle}>{item.nome}</Text>
      <View style={styles.materialRowLocationContainer}>
        <Ionicons name="location-outline" size={14} color={Colors.grayText} />
        <Text style={styles.materialRowSubtitle}>{item.local}</Text>
      </View>
    </View>
    <View style={styles.materialRowArrow}>
      <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
    </View>
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
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Ver todos</Text>
            <Ionicons
              name="arrow-forward"
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
                <Text style={styles.greeting}>Bem-vindo de volta,</Text>
                <Text style={styles.username}>{user?.name || "User"}</Text>
              </View>
              <TouchableOpacity
                style={styles.messagesButton}
                onPress={() => router.push("/profile/messages")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={24}
                  color={Colors.primary}
                />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={22}
                color={Colors.grayText}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar projetos, materiais..."
                placeholderTextColor={Colors.grayText}
              />
              <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                <Ionicons name="options-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
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
    backgroundColor: "#F8FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#F8FAFB",
  },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 15,
    color: Colors.grayText,
    fontWeight: "500",
    marginBottom: 4,
  },
  username: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  messagesButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F0F4F8",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginRight: 4,
  },
  flatListContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  featuredCard: {
    width: 300,
    height: 200,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: "#000",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredCardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  featuredCardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  featuredCardTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.3,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  featuredCardBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  materialRowImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#F0F4F8",
  },
  materialRowContent: {
    flex: 1,
    marginLeft: 16,
  },
  materialRowTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  materialRowLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  materialRowSubtitle: {
    fontSize: 14,
    color: Colors.grayText,
    marginLeft: 4,
    fontWeight: "500",
  },
  materialRowArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  categoryCardText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  quickLinkGridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  quickLinkWrapperGrid: {
    width: '48.5%',
  },
  quickLink: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 80,
  },
  quickLinkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLinkText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    letterSpacing: -0.2,
  },
});