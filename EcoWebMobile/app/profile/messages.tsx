import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { imagesPerfilMessages } from "../../assets/images/image";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "chat1",
    name: "Madeireira Verde",
    avatar: imagesPerfilMessages.madeireira,
    lastMessage: "Olá! Sim, os paletes ainda estão disponíveis.",
    timestamp: "10:30",
    unreadCount: 1,
  },
  {
    id: "chat2",
    name: "Joana Silva",
    avatar: imagesPerfilMessages.mulherUser,
    lastMessage: "Adorei a ideia da cadeira! Teria mais fotos?",
    timestamp: "Ontem",
    unreadCount: 0,
  },
  {
    id: "chat3",
    name: "Ateliê Ponto a Ponto",
    avatar: imagesPerfilMessages.atelie,
    lastMessage: "Combinado. Pode buscar amanhã.",
    timestamp: "17/06",
    unreadCount: 0,
  },
];

const ConversationRow = ({ item }: { item: Conversation }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`../chat/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Mensagens" }} />
      <StatusBar style="dark" />
      <FlatList
        data={MOCK_CONVERSATIONS}
        renderItem={({ item }) => <ConversationRow item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Suas Conversas</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContainer: { paddingVertical: 10 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  textContainer: { flex: 1, justifyContent: "center" },
  name: { fontSize: 17, fontWeight: "600", color: Colors.text },
  lastMessage: { fontSize: 15, color: Colors.grayText, marginTop: 4 },
  metaContainer: { alignItems: "flex-end" },
  timestamp: { fontSize: 13, color: Colors.grayText, marginBottom: 8 },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: { color: Colors.white, fontWeight: "bold", fontSize: 12 },
  separator: { height: 1, backgroundColor: Colors.neutral, marginLeft: 95 },
});
