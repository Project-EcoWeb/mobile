import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { getMeProjects } from "../../src/services/projectServices";

interface UserProject {
  id: string;
  title: string;
  image: string;
  views: number;
  favorites: number;
}

const MyProjectCard = ({ item, onEdit, onDelete }: { item: UserProject, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
    const router = useRouter();
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push(`/project/${item.id}`)}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
            </TouchableOpacity>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                
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
    const { user } = useAuth();
    const [myProjects, setMyProjects] = useState<UserProject[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddNew = () => {
        router.push('/project/register');
    };

    const fetchProjects = useCallback(async () => {
        const token = user?.token;
        if (!token) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await getMeProjects(token);

            const mappedProjects = response.data.map((project: any) => ({
                id: project._id, 
                title: project.title,
                image: project.image,
                views: project.views || 0,
                favorites: project.favorites || 0, 
            }));

            setMyProjects(mappedProjects);
        } catch (error) {
            console.error("Erro detalhado ao buscar projetos:", error); 
            Alert.alert("Falha ao buscar projetos", "Não foi possível carregar seus projetos. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        if (!user?.token) {
            return;
        }

        const requestId = setTimeout(() => {
            void fetchProjects();
        }, 0);

        return () => clearTimeout(requestId);
    }, [user?.token, fetchProjects]);

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
        Alert.alert("Editar Projeto", `Função Indisponivel`);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar style="dark" />
                <PageHeader title="Meus Projetos" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Carregando seus projetos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />
            <PageHeader
                title="Meus Projetos"
                right={
                    <TouchableOpacity onPress={handleAddNew} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>+ Criar Novo</Text>
                    </TouchableOpacity>
                }
            />
            <FlatList
                data={myProjects}
                renderItem={({ item }) => <MyProjectCard item={item} onEdit={handleEdit} onDelete={handleDelete} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                onRefresh={fetchProjects}
                refreshing={isLoading}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <Text style={styles.listHeaderTitle}>Gerencie suas criações</Text>
                }
                ListEmptyComponent={
                    !isLoading && (<View style={styles.emptyContainer}>
                        <Ionicons name="bulb-outline" size={60} color={Colors.grayText} />
                        <Text style={styles.emptyText}>Você ainda não publicou nenhum projeto.</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
                            <Text style={styles.emptyButtonText}>Criar primeiro projeto</Text>
                        </TouchableOpacity>
                    </View>)
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.grayText,
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
