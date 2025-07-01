import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { imagesProjects } from '../../assets/images/image.js';

interface UserProject {
  id: string;
  titulo: string;
  imagem: string;
  views: number;
  favorites: number;
}


const MOCK_USER_PROJECTS: UserProject[] = [
  { id: 'p1', titulo: 'Cadeira com Paletes', imagem: imagesProjects.cadeira, views: 1250, favorites: 89 },
  { id: 'p2', titulo: 'Vasos com Garrafa PET', imagem: imagesProjects.vaso, views: 873, favorites: 56 },
  { id: 'p6', titulo: 'Estante de Caixotes', imagem: imagesProjects.estante, views: 2340, favorites: 152 },
];

const MyProjectCard = ({ item, onEdit, onDelete }: { item: UserProject, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
    const router = useRouter();
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push(`/project/${item.id}`)}>
                <Image source={{ uri: item.imagem }} style={styles.cardImage} />
            </TouchableOpacity>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
                
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={16} color={Colors.grayText} />
                        <Text style={styles.statText}>{item.views}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="heart-outline" size={16} color={Colors.grayText} />
                        <Text style={styles.statText}>{item.favorites}</Text>
                    </View>
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item.id)}>
                        <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item.id)}>
                        <Ionicons name="trash-outline" size={20} color={'#D32F2F'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default function MyProjectsScreen() {
    const router = useRouter();
    const [myProjects, setMyProjects] = useState(MOCK_USER_PROJECTS);

    const handleAddNew = () => {
        router.push('/project/register');
    };

    const handleDelete = (idToDelete: string) => {
        Alert.alert(
            "Excluir Projeto",
            "Você tem certeza? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => {
                    setMyProjects(prev => prev.filter(p => p.id !== idToDelete));
                }}
            ]
        );
    };

    const handleEdit = (idToEdit: string) => {
        Alert.alert("Editar Projeto", `Navegando para editar o projeto ${idToEdit}.`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ 
                title: 'Meus Projetos',
                headerRight: () => (
                    <TouchableOpacity onPress={handleAddNew} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>+ Criar Novo</Text>
                    </TouchableOpacity>
                )
            }} />
            <StatusBar style="dark" />
            <FlatList
                data={myProjects}
                renderItem={({ item }) => <MyProjectCard item={item} onEdit={handleEdit} onDelete={handleDelete} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <Text style={styles.listHeaderTitle}>Gerencie suas criações e acompanhe o engajamento.</Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bulb-outline" size={60} color={Colors.grayText} />
                        <Text style={styles.emptyText}>Você ainda não publicou nenhum projeto.</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
                            <Text style={styles.emptyButtonText}>Criar primeiro projeto</Text>
                        </TouchableOpacity>
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
    headerButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 10,
    },
    headerButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    listHeaderTitle: {
        fontSize: 16,
        color: Colors.grayText,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    card: {
        flex: 1,
        margin: 10,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.neutral,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },
    cardImage: {
        width: '100%',
        aspectRatio: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.neutral,
        paddingTop: 8,
        marginTop: 4,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 13,
        color: Colors.grayText,
        fontWeight: '500',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.background,
    },
    emptyContainer: {
        flex: 1,
        marginTop: 150,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.grayText,
        marginTop: 10,
        textAlign: 'center',
    },
    emptyButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 20,
    },
    emptyButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});