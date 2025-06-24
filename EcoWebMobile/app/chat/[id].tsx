import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

// --- Tipos e Dados Mock ---
const CURRENT_USER_ID = 'me'; // Simula o nosso ID de usuário

interface Message {
    id: string;
    text: string;
    senderId: string;
}

const MOCK_CHAT_HISTORY: { [key: string]: Message[] } = {
    chat1: [
        { id: 'msg4', text: 'Olá! Sim, os paletes ainda estão disponíveis.', senderId: 'supplier1' },
        { id: 'msg3', text: 'Obrigado!', senderId: CURRENT_USER_ID },
        { id: 'msg2', text: 'Boa tarde! Gostaria de saber mais sobre os paletes anunciados.', senderId: CURRENT_USER_ID },
        { id: 'msg1', text: '...', senderId: 'supplier1' },
    ]
};

// --- Componente da Bolha de Mensagem ---
const MessageBubble = ({ item }: { item: Message }) => {
    const isSender = item.senderId === CURRENT_USER_ID;
    return (
        <View style={[
            styles.messageRow,
            isSender ? styles.senderRow : styles.receiverRow
        ]}>
            <View style={[
                styles.messageBubble,
                isSender ? styles.senderBubble : styles.receiverBubble
            ]}>
                <Text style={isSender ? styles.senderText : styles.receiverText}>{item.text}</Text>
            </View>
        </View>
    )
};


// --- Tela Principal ---
export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const messages = MOCK_CHAT_HISTORY[id] || [];
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim() === '') return;
        console.log('Enviando:', newMessage);
        // Aqui você adicionaria a lógica para enviar a mensagem para a API
        setNewMessage('');
    };
    
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
             <Stack.Screen options={{ title: 'Madeireira Verde' }} />
             <StatusBar style="dark" />
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <FlatList
                    style={styles.chatList}
                    data={messages}
                    renderItem={MessageBubble}
                    keyExtractor={(item) => item.id}
                    inverted // Começa a lista de baixo para cima, essencial para chat!
                />
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="arrow-up-circle" size={38} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    chatList: { flex: 1, paddingHorizontal: 12 },
    // Estilos das bolhas de mensagem
    messageRow: { flexDirection: 'row', marginVertical: 8 },
    senderRow: { justifyContent: 'flex-end' },
    receiverRow: { justifyContent: 'flex-start' },
    messageBubble: { maxWidth: '75%', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20 },
    senderBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 5 },
    receiverBubble: { backgroundColor: Colors.neutral, borderBottomLeftRadius: 5 },
    senderText: { color: Colors.white, fontSize: 16 },
    receiverText: { color: Colors.text, fontSize: 16 },
    // Estilos do campo de digitação
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: Colors.neutral },
    textInput: { flex: 1, backgroundColor: Colors.neutral, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, maxHeight: 100 },
    sendButton: { marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
});