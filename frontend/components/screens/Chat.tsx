import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

interface Message {
    id: string;
    text: string;
    isSent: boolean;
    timestamp: Date;
}

function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const navigation = useNavigation(); // Initialize navigation

    const sendMessage = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText.trim(),
                isSent: true,
                timestamp: new Date(),
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInputText('');
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageBubble,
            item.isSent ? styles.sentMessage : styles.receivedMessage
        ]}>
            <Text style={[
                styles.messageText,
                item.isSent ? styles.sentMessageText : styles.receivedMessageText
            ]}>
                {item.text}
            </Text>
            <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                inverted={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <TextInput
                    className="mb-2"
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    multiline
                />
                <TouchableOpacity
                    className="mb-2"
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!inputText.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        marginLeft: 'auto',
        marginRight: 10,
        padding: 8,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    messagesList: {
        padding: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
    },
    messageText: {
        fontSize: 16,
    },
    sentMessageText: {
        color: '#FFFFFF',
    },
    receivedMessageText: {
        color: '#000000',
    },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
        color: '#A0A0A0',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    input: {
        flex: 1,
        marginRight: 12,
        padding: 12,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        maxHeight: 100,
        color: '#000000',
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 20,
    },
    sendButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default Chat;
