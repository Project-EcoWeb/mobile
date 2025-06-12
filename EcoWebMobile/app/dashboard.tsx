// app/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors'; // Usando a paleta moderna que definimos
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- MOCK DATA ---
const FEED_ITEMS = [
    // ... cole os dados do FEED_ITEMS aqui
];

const CATEGORIES = ['Madeira', 'Plástico', 'Tecido', 'Vidro', 'Metal', 'Papel'];

type FeedItem = typeof FEED_ITEMS[0];

export default function DashboardScreen() {
    const router = useRouter();

    const renderCard = ({ item }: { item: FeedItem }) => {
        // Card de Projeto - Maior, com mais destaque
        if (item.type === 'project') {
            return (
                <Pressable style={styles.projectCard} onPress={() => router.push(`/projeto/${item.id}`)}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradient}
                    />
                    <View style={styles.projectCardContent}>
                        <Text style={styles.projectCardTitle}>{item.title}</Text>
                        <Text style={styles.projectCardAuthor}>por {item.author}</Text>
                    </View>
                </Pressable>
            );
        }
        // Card de Material - Design único para se diferenciar
        if (item.type === 'material') {
            return (
                <Pressable style={styles.materialCard}>
                    <Image source={{ uri: item.image }} style={styles.materialImage} />
                    <View style={styles.materialContent}>
                        <Text style={styles.materialTitle}>{item.material}</Text>
                        <Text style={styles.materialCompany}>{item.company}</Text>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Disponível</Text>
                        </View>
                    </View>
                </Pressable>
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={FEED_ITEMS}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.greeting}>Olá, Ruan!</Text>
                            <Text style={styles.headerTitle}>O que vamos transformar hoje?</Text>
                        </View>

                        <View style={styles.searchContainer}>
                            <Ionicons name="sparkles-outline" size={24} color={Colors.primary} />
                            <TextInput
                                placeholder="Comece com um material ou ideia..."
                                style={styles.searchInput}
                            />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                            {CATEGORIES.map((cat) => (
                                <Pressable key={cat} style={styles.categoryChip}>
                                    <Text style={styles.categoryText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </>
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
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 18,
        color: Colors.grayText,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        lineHeight: 38,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        borderColor: Colors.neutral,
        borderWidth: 1,
        height: 55,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        color: Colors.text,
    },
    categoryScroll: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        gap: 12,
    },
    categoryChip: {
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderColor: Colors.neutral,
        borderWidth: 1,
    },
    categoryText: {
        color: Colors.text,
        fontWeight: '600',
        fontSize: 15,
    },
    projectCard: {
        marginHorizontal: 20,
        marginBottom: 25,
        borderRadius: 20,
        backgroundColor: Colors.neutral,
    },
    cardImage: {
        width: '100%',
        aspectRatio: 16 / 10,
        borderRadius: 20,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
        borderRadius: 20,
    },
    projectCardContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    projectCardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
    projectCardAuthor: {
        fontSize: 14,
        color: Colors.white,
        opacity: 0.9,
    },
    materialCard: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 25,
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderColor: Colors.neutral,
        borderWidth: 1,
        padding: 15,
        alignItems: 'center',
    },
    materialImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
    },
    materialContent: {
        flex: 1,
        marginLeft: 15,
    },
    materialTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
    },
    materialCompany: {
        fontSize: 14,
        color: Colors.grayText,
        marginVertical: 4,
    },
    chip: {
        backgroundColor: Colors.accent,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        marginTop: 5,
    },
    chipText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
});
