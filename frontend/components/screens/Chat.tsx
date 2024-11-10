import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { useUser } from '~/lib/context/userContext';

interface Message {
    id: string;
    content: string;
    from_user_id: number;
    to_conversation_id: number;
    timestamp: string | null;
    isSent: boolean;
}

type RootStackParamList = {
    Chat: { conversation_id: number };
};

type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function Chat() {
    const { user } = useUser();
    const id = Number(user?.id); // Ensure id is a number
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const route = useRoute<ChatRouteProp>();
    const { conversation_id } = route.params;

    // Function to fetch messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `http://161.35.248.173:8000/api/getConversationMessages/${conversation_id}/`
            );
            const fetchedMessages = response.data.map((msg: any) => ({
                id: `${msg.from_user_id}-${Math.random()}`,
                content: msg.content,
                from_user_id: msg.from_user_id,
                to_conversation_id: msg.to_conversation_id,
                timestamp: msg.timestamp,
                isSent: msg.from_user_id === id,
            }));
            setMessages(fetchedMessages.reverse());
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to fetch messages when component mounts and set up polling
    useEffect(() => {
        fetchMessages(); // Initial fetch

        // Set up interval to fetch messages every second
        const intervalId = setInterval(() => {
            console.log("Its time")
            fetchMessages();
        }, 1000);

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, [conversation_id, id]);

    const sendMessage = async () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: `${id}-${Date.now()}`,
                content: inputText.trim(),
                from_user_id: id,
                to_conversation_id: conversation_id,
                timestamp: new Date().toISOString(),
                isSent: true,
            };

            try {
                await axios.post('http://161.35.248.173:8000/api/sendMessage/', {
                    content: inputText.trim(),
                    from_user_id: id,
                    to_conversation_id: conversation_id,
                });

                // Update the local state to include the new message
                setMessages((prevMessages) => [newMessage, ...prevMessages]);
                setInputText('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageBubble,
                item.isSent ? styles.sentMessage : styles.receivedMessage,
            ]}
        >
            <Text
                style={[
                    styles.messageText,
                    item.isSent ? styles.sentMessageText : styles.receivedMessageText,
                ]}
            >
                {item.content}
            </Text>
            {item.timestamp && (
                <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerText}></Text>
                </View>

                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    inverted
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor="#666"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={sendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 'auto',
        padding: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
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
        borderTopRightRadius: 0,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 0,
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
        alignSelf: 'flex-end',
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
        backgroundColor: '#FFFFFF',
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
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
});
