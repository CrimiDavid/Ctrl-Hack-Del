import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

interface NewConversationModalProps {
    visible: boolean;
    onClose: () => void;
}

interface Chat {
    id: string;
    first_name: string;
}

export default function NewConversationModal({ visible, onClose }: NewConversationModalProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (visible) {
            fetchChats();
        }
    }, [visible]);

    const fetchChats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://161.35.248.173:8000/api/listUsers/1/');
            const chatsData = response.data.map((user: { first_name: string }, index: number) => ({
                id: index.toString(),
                first_name: user.first_name
            }));
            setChats(chatsData);
        } catch (err) {
            setError('Failed to load chats');
            console.error('Error fetching chats:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderChatItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
                console.log('Selected chat:', item);
                onClose();
            }}
        >
            <Text style={styles.chatTitle}>{item.first_name}</Text>
            <FontAwesome name="angle-right" size={20} color="#666" />
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>New Conversation</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.retryButton} onPress={fetchChats}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={chats}
                            renderItem={renderChatItem}
                            keyExtractor={(item) => item.id}
                            style={styles.chatList}
                            contentContainerStyle={styles.chatListContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxHeight: '80%'
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    chatList: {
        width: '100%',
    },
    chatListContent: {
        paddingVertical: 10
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%'
    },
    chatTitle: {
        fontSize: 16,
        color: '#333'
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8
    },
    retryText: {
        color: 'white'
    }
});
