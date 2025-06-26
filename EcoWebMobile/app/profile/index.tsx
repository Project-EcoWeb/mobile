import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

// --- Tipos e Dados Mock ---
interface UserProfile {
    name: string;
    avatarUrl: string;
    userType: 'creator' | 'company'; // Para renderização condicional
    stats: {
        projects: number;
        favorites: number;
    };
}

// Simula os dados do usuário logado.
const MOCK_USER: UserProfile = {
    name: 'Ruan Oliveira',
    avatarUrl: 'https://github.com/ruanoliveiradev.png',
    userType: 'creator', // Mude para 'company' para ver o botão extra
    stats: {
        projects: 12,
        favorites: 37,
    }
};

// --- Componentes Reutilizáveis para a Tela ---

// Bloco de Estatística
const StatBox = ({ value, label }: { value: number, label: string }) => (
    <View style={styles.statBox}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// Linha de Ação/Navegação
const ProfileRow = ({ icon, title, onPress }: { icon: keyof typeof Ionicons.glyphMap, title: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.profileRow} onPress={onPress}>
        <View style={styles.rowIconContainer}>
            <Ionicons name={icon} size={22} color={Colors.primary} />
        </View>
        <Text style={styles.rowTitle}>{title}</Text>
        <Ionicons name="chevron-forward-outline" size={22} color={Colors.grayText} />
    </TouchableOpacity>
);


// --- Tela Principal ---
export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "Sair da Conta",
            "Você tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: () => router.replace('/') }, // Exemplo: volta para a tela inicial
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Cabeçalho do Perfil */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.profileName}>{MOCK_USER.name}</Text>
                </View>

                {/* Seção de Estatísticas */}
                <View style={styles.statsContainer}>
                    <StatBox value={MOCK_USER.stats.projects} label="Projetos" />
                    <View style={styles.statSeparator} />
                    <StatBox value={MOCK_USER.stats.favorites} label="Favoritos" />
                </View>
                
                {/* Menu de Ações */}
                <View style={styles.menuSection}>
                    <ProfileRow icon="person-outline" title="Editar Perfil" onPress={() => alert('Funçaõ Indisponivel')}/>
                </View>

                {/* Menu Condicional para Empresas */}
                {MOCK_USER.userType === 'company' && (
                    <View style={styles.menuSection}>
                        <ProfileRow icon="business-outline" title="Gerenciar Resíduos" onPress={() => router.push('/material/me')} />
                    </View>
                )}
                
                {/* Ação de Sair */}
                <View style={styles.menuSection}>
                    <ProfileRow icon="log-out-outline" title="Sair" onPress={handleLogout} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContainer: {
        paddingVertical: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.primary,
        marginBottom: 12,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.grayText,
        marginTop: 4,
    },
    statSeparator: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.neutral,
    },
    menuSection: {
        marginTop: 24,
        marginHorizontal: 20,
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden', // Para que a borda do último item não vaze
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral,
    },
    rowIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rowTitle: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
});