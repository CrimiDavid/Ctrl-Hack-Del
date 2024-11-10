import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TextInput  // Import TextInput
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

interface SelectedUsers {
    [key: string]: boolean;
}

import { useNavigation } from '@react-navigation/native';

export default function NewConversationModal({ visible, onClose }: NewConversationModalProps) {
    const navigation = useNavigation();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<SelectedUsers>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [name, setName] = useState<string>('');       // Add name state
    const [content, setContent] = useState<string>(''); // Add content state

    useEffect(() => {
        if (visible) {
            fetchChats();
            setSelectedUsers({}); // Reset selections when modal opens
            setName('');          // Reset name when modal opens
            setContent('');       // Reset content when modal opens
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

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const getSelectedUsersCount = () => {
        return Object.values(selectedUsers).filter(Boolean).length;
    };

    const handleStartConversation = () => {
        const selectedUsersList = chats.filter(chat => selectedUsers[chat.id]);
        console.log('Starting conversation with:', selectedUsersList);
        console.log('Conversation Name:', name);
        console.log('Content:', content);
        const data = {
            conversation_name: name,
            from_user_id: 1, // Replace with the actual user ID
            to_user_ids: selectedUsersList.map(user => user.id),
            content: content,
        };
        // Make the POST request using Axios
        axios.post('http://161.35.248.173:8000/api/createConversation/', data)
            .then(response => {
                console.log('Conversation created:', response.data);
                // Navigate to the 'Chat' screen upon success
                navigation.navigate('Conversations' as never);
                onClose();
            })
            .catch(error => {
                console.error('Error creating conversation:', error);
                // Handle error appropriately
            });
        onClose();
    };

    const renderChatItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => toggleUserSelection(item.id)}
        >
            <View style={styles.chatItemContent}>
                <View style={styles.checkbox}>
                    {selectedUsers[item.id] && (
                        <FontAwesome name="check" size={16} color="#007AFF" />
                    )}
                </View>
                <Text style={styles.chatTitle}>{item.first_name}</Text>
            </View>
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

                    <TextInput
                        style={styles.input}
                        placeholder="Conversation Name"
                        placeholderTextColor="grey"
                        value={name}
                        onChangeText={setName}

                    />

                    <TextInput
                        style={styles.textArea}
                        placeholder="Content"
                        placeholderTextColor="grey"
                        value={content}
                        onChangeText={setContent}
                        multiline={true}
                    />

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
                        <>
                            <Text className="flex justify-end ">Community Members:</Text>
                            <FlatList
                                data={chats}
                                renderItem={renderChatItem}
                                keyExtractor={(item) => item.id}
                                style={styles.chatList}
                                contentContainerStyle={styles.chatListContent}
                                showsVerticalScrollIndicator={false}
                            />

                            {getSelectedUsersCount() > 0 && (
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        style={styles.startButton}
                                        onPress={handleStartConversation}
                                    >
                                        <Text style={styles.startButtonText}>
                                            Start Conversation ({getSelectedUsersCount()})
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 80,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
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
    chatItemContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 12,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
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
    },
    footer: {
        width: '100%',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 10
    },
    startButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center'
    },
    startButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
});
