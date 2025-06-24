import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

// --- Tipos e Dados Mock ---
interface ProjectType {
  id: string;
  titulo: string;
  autor: string;
  imagem: string;
  category: 'Móveis' | 'Decoração' | 'Jardim' | 'Moda';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

const MOCK_ALL_PROJECTS: ProjectType[] = [
  { id: 'p1', titulo: 'Cadeira com Paletes', autor: 'Joana Silva', imagem: 'https://i.imgur.com/O7pzYcL.jpg', category: 'Móveis', difficulty: 'Médio' },
  { id: 'p2', titulo: 'Vasos com Garrafa PET', autor: 'Lucas Costa', imagem: 'https://i.imgur.com/WXJr9rJ.jpg', category: 'Jardim', difficulty: 'Fácil' },
  { id: 'p3', titulo: 'Bolsa de Retalhos', autor: 'Mariana Costa', imagem: 'https://i.imgur.com/Bm2cWYO.jpg', category: 'Moda', difficulty: 'Médio' },
  { id: 'p4', titulo: 'Luminária de Pote de Vidro', autor: 'Pedro Alves', imagem: 'https://i.imgur.com/L4A2a4A.jpg', category: 'Decoração', difficulty: 'Fácil' },
  { id: 'p5', titulo: 'Horta Vertical de PVC', autor: 'Ana Beatriz', imagem: 'https://i.pinimg.com/736x/87/4b/58/874b584d43610996841221e7847c23a5.jpg', category: 'Jardim', difficulty: 'Difícil' },
  { id: 'p6', titulo: 'Estante de Caixotes', autor: 'Ricardo Lima', imagem: 'https://i.imgur.com/6XyJqfH.jpg', category: 'Móveis', difficulty: 'Fácil' },
];

const CATEGORIES: ProjectType['category'][] = ['Móveis', 'Decoração', 'Jardim', 'Moda'];

// --- Componente do Card da Grid ---
const ProjectGridCard = ({ item }: { item: ProjectType }) => {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/project/${item.id}`)}>
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
            </View>
        </TouchableOpacity>
    );
};


// --- Tela Principal ---
export default function AllProjectsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredProjects = useMemo(() => {
        return MOCK_ALL_PROJECTS.filter(project => {
            const matchesCategory = !activeCategory || project.category === activeCategory;
            const matchesSearch = project.titulo.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    const ListHeader = (
        <View>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={22} color={Colors.grayText} />
                <TextInput
                    placeholder="Buscar em projetos..."
                    placeholderTextColor={Colors.grayText}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <Text style={styles.filterTitle}>Categorias</Text>
            <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.chip, activeCategory === item && styles.chipSelected]}
                        onPress={() => setActiveCategory(prev => prev === item ? null : item)}
                    >
                        <Text style={[styles.chipText, activeCategory === item && styles.chipTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ title: 'Projetos Criativos' }} />
            <StatusBar style="dark" />
            <FlatList
                data={filteredProjects}
                renderItem={({ item }) => <ProjectGridCard item={item} />}
                keyExtractor={(item) => item.id}
                numColumns={2} // A mágica da grid acontece aqui!
                ListHeaderComponent={ListHeader}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="sad-outline" size={60} color={Colors.grayText} />
                        <Text style={styles.emptyText}>Nenhum projeto encontrado.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}


// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    // --- Cabeçalho e Filtros ---
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        margin: 20,
        marginBottom: 0,
        borderColor: Colors.neutral,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        marginLeft: 10,
        color: Colors.text,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.grayText,
        marginHorizontal: 20,
        marginTop: 20,
    },
    categoryScroll: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    },
    chip: {
        backgroundColor: Colors.white,
        paddingHorizontal: 18,
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
    // --- Grid e Cards ---
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
        aspectRatio: 1, // Imagem quadrada para um grid uniforme
        backgroundColor: Colors.neutral,
    },
    cardContent: {
        padding: 12,
    },
    cardCategory: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
    },
    // --- Estado Vazio ---
    emptyContainer: {
        flex: 1,
        marginTop: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.grayText,
        marginTop: 10,
    },
});