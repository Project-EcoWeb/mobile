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
import { imagesMaterials } from '../../assets/images/image.js';

interface CompanyMaterial {
  id: string;
  name: string;
  image: string;
  quantity: string;
  status: 'Ativo' | 'Reservado' | 'Concluído';
}

const MOCK_COMPANY_MATERIALS: CompanyMaterial[] = [
  { id: 'm1', name: 'Paletes de Pinho (Lote 12)', image: imagesMaterials.paletes, quantity: '15 unidades', status: 'Ativo' },
  { id: 'm2', name: 'Garrafas de Vidro Verdes', image: imagesMaterials.garrafas, quantity: '5 caixas', status: 'Reservado' },
  { id: 'm4', name: 'Sobras de Canos de PVC', image: imagesMaterials.canos, quantity: '20 peças', status: 'Ativo' },
  { id: 'm6', name: 'Tambores de Plástico 200L', image: imagesMaterials.tambores, quantity: '8 unidades', status: 'Concluído' },
];

const ManagementCard = ({ item, onEdit, onDelete }: { item: CompanyMaterial, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
    const statusColor = item.status === 'Ativo' ? Colors.primary : item.status === 'Reservado' ? '#FFA000' : Colors.grayText;

    return (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.cardQuantity}>{item.quantity}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.actionButton}>
                    <Ionicons name="pencil-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={22} color={'#D32F2F'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};


export default function ManageMaterialsScreen() {
    const router = useRouter();
    const [materials, setMaterials] = useState(MOCK_COMPANY_MATERIALS);

    const handleAddNew = () => {
        router.push('/material/register');
    };

    const handleDelete = (idToDelete: string) => {
        Alert.alert(
            "Excluir Material",
            "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => {
                    setMaterials(prev => prev.filter(m => m.id !== idToDelete));
                }}
            ]
        );
    };

    const handleEdit = (idToEdit: string) => {
        Alert.alert("Editar Material", `Navegando para editar o item ${idToEdit}.`);
    };

    const ListHeader = (
        <View style={styles.statsContainer}>
            <View style={styles.statBox}>
                <Text style={styles.statValue}>{materials.filter(m => m.status === 'Ativo').length}</Text>
                <Text style={styles.statLabel}>Materiais Ativos</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statBox}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Interessados</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ 
                title: 'Meus Materiais',
                headerRight: () => (
                    <TouchableOpacity onPress={handleAddNew} style={styles.headerButton}>
                        <Ionicons name="add" size={28} color={Colors.primary} />
                    </TouchableOpacity>
                )
            }} />
            <StatusBar style="dark" />
            <FlatList
                data={materials}
                renderItem={({ item }) => <ManagementCard item={item} onEdit={handleEdit} onDelete={handleDelete} />}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="file-tray-stacked-outline" size={60} color={Colors.grayText} />
                        <Text style={styles.emptyText}>Nenhum material cadastrado.</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
                            <Text style={styles.emptyButtonText}>Oferecer primeiro material</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, },
    headerButton: { marginRight: 10 },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        marginBottom: 20,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
    statLabel: { fontSize: 14, color: Colors.grayText, marginTop: 4 },
    statSeparator: { width: 1, backgroundColor: Colors.neutral },
    listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.neutral,
        alignItems: 'center'
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: Colors.neutral,
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    statusText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
    },
    cardQuantity: {
        fontSize: 14,
        color: Colors.grayText,
        marginTop: 4,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        backgroundColor: Colors.background,
        borderRadius: 20,
    },
    emptyContainer: {
        flex: 1,
        marginTop: 100,
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