import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { imagesMaterials, imagesProjects } from '../../assets/images/image.js';
interface FavoriteItem {
  id: string;
  title: string; 
  image: string;
  type: 'project' | 'material';
}

const MOCK_FAVORITE_PROJECTS: FavoriteItem[] = [
  { id: 'p1', title: 'Cadeira com Paletes', image: imagesProjects.cadeira, type: 'project' },
  { id: 'p4', title: 'Luminária de Pote de Vidro', image: imagesProjects.luminaria, type: 'project' },
];

const MOCK_FAVORITE_MATERIALS: FavoriteItem[] = [
    { id: 'm2', title: 'Garrafas de Vidro Verdes', image: imagesMaterials.garrafas, type: 'material' },
];

const FavoriteCard = ({ item, onRemove }: { item: FavoriteItem, onRemove: (id: string) => void }) => {
    const router = useRouter();
    const route = `/${item.type}/${item.id}`;

    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(route as any)}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
                <Ionicons name="heart" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function FavoritesScreen() {
    const [activeTab, setActiveTab] = useState<'projetos' | 'materiais'>('projetos');
    const [favoriteProjects, setFavoriteProjects] = useState(MOCK_FAVORITE_PROJECTS);
    const [favoriteMaterials, setFavoriteMaterials] = useState(MOCK_FAVORITE_MATERIALS);

    const handleRemove = (idToRemove: string) => {
        Alert.alert(
            "Remover Favorito",
            "Tem certeza que deseja remover este item dos seus favoritos?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Remover", 
                    style: "destructive", 
                    onPress: () => {
                        if (activeTab === 'projetos') {
                            setFavoriteProjects(prev => prev.filter(p => p.id !== idToRemove));
                        } else {
                            setFavoriteMaterials(prev => prev.filter(m => m.id !== idToRemove));
                        }
                    } 
                },
            ]
        );
    };

    const data = activeTab === 'projetos' ? favoriteProjects : favoriteMaterials;
    const emptyMessage = activeTab === 'projetos' 
        ? "Você ainda não favoritou nenhum projeto." 
        : "Nenhum material salvo nos seus favoritos.";

    const Tab = ({ name, title }: { name: 'projetos' | 'materiais', title: string }) => (
        <TouchableOpacity onPress={() => setActiveTab(name)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>{title}</Text>
            {activeTab === name && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ title: 'Meus Favoritos' }} />
            <StatusBar style="dark" />

            <View style={styles.tabsContainer}>
                <Tab name="projetos" title="Projetos" />
                <Tab name="materiais" title="Materiais" />
            </View>

            <FlatList
                data={data}
                renderItem={({ item }) => <FavoriteCard item={item} onRemove={handleRemove} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                key={activeTab} 
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-dislike-outline" size={60} color={Colors.grayText} />
                        <Text style={styles.emptyText}>{emptyMessage}</Text>
                        <Text style={styles.emptySubtext}>Toque no ícone de coração para salvar.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 30,
        paddingHorizontal: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral
    },
    tab: {
        paddingBottom: 12,
    },
    tabText: {
        fontSize: 18,
        color: Colors.grayText,
        fontWeight: '600',
    },
    activeTabText: {
        color: Colors.primary,
    },
    activeTabIndicator: {
        height: 3,
        width: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
        position: 'absolute',
        bottom: 0,
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.neutral,
    },
    cardImage: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: Colors.neutral,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(233, 30, 99, 0.8)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
    },
    emptyContainer: {
        flex: 1,
        marginTop: 150,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.grayText,
        marginTop: 10,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.grayText,
        marginTop: 5,
        textAlign: 'center',
    }
});