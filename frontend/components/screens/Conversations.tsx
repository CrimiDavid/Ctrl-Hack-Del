    import React, { useState, useEffect } from 'react';
    import {
        View,
        TouchableOpacity,
        SafeAreaView,
        Platform,
        StatusBar,
        StyleSheet,
        FlatList,
        Text,
        ActivityIndicator
    } from 'react-native';
    import { FontAwesome } from "@expo/vector-icons";
    import NewConversationModal from '../modals/newChat';
    import axios from "axios";
    import { useNavigation } from '@react-navigation/native';
    import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
    import {useUser} from "~/lib/context/userContext";

    interface Conversations {
        conversation_id: number;
        name: string;
        preview: string;
        timestamp: Date;
    }

    const ITEMS_PER_PAGE = 10;

    export default function Conversations() {
        const {user} = useUser()
        const id = user?.id;
        console.log(id)
        const navigation = useNavigation();
        const [modalVisible, setModalVisible] = useState<boolean>(false);
        const [conversations, setConversations] = useState<Conversations[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string>('');
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [hasMorePages, setHasMorePages] = useState<boolean>(true);

        const fetchConversations = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://161.35.248.173:8000/api/loadConversations/${id}/`);
                const sortedConversations = response.data.sort((a: Conversations, b: Conversations) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                setConversations(sortedConversations);
                setHasMorePages(sortedConversations.length > ITEMS_PER_PAGE);
                setCurrentPage(1); // Reset page for pagination
            } catch (err) {
                setError('Failed to load conversations');
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchConversations();
        }, []);

        const handleConversationPress = (conversationId: number) => {
            // @ts-ignore
            navigation.navigate('Chat', { conversation_id: conversationId });
        };

        const getPaginatedData = () => {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            return conversations.slice(startIndex, endIndex);
        };

        const handleLoadMore = () => {
            if (currentPage * ITEMS_PER_PAGE < conversations.length) {
                setCurrentPage(currentPage + 1);
            }
        };

        const renderConversation = ({ item }: { item: Conversations }) => (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => handleConversationPress(item.conversation_id)}
                activeOpacity={0.7}
            >
                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(item.timestamp).toLocaleDateString()}
                        </Text>
                    </View>
                    <Text style={styles.preview} numberOfLines={2}>{item.preview}</Text>
                </View>
            </TouchableOpacity>
        );

        const renderFooter = () => {
            if (!hasMorePages) return null;
            return (
                <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={handleLoadMore}
                >
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
            );
        };

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Conversations</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={fetchConversations}
                            >
                                <FontAwesome name="refresh" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setModalVisible(true)}
                            >
                                <FontAwesome name="plus" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator style={styles.loader} size="large" color="#0066cc" />
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <FlatList
                            data={getPaginatedData()}
                            keyExtractor={(item) => item.conversation_id.toString()}
                            renderItem={renderConversation}
                            ListFooterComponent={renderFooter}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <NewConversationModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white'
        },
        headerActions: {
            flexDirection: 'row'
        },
        refreshButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            marginRight: 10
        },
        addButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
        },
        listContainer: {
            padding: 8
        },
        conversationItem: {
            backgroundColor: 'white',
            borderRadius: 12,
            marginVertical: 6,
            marginHorizontal: 8,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
        },
        conversationContent: {
            padding: 16
        },
        conversationHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333'
        },
        preview: {
            fontSize: 14,
            color: '#666',
            lineHeight: 20
        },
        timestamp: {
            fontSize: 12,
            color: '#999'
        },
        errorText: {
            color: '#ff3b30',
            textAlign: 'center',
            marginTop: 20,
            fontSize: 16
        },
        loader: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        loadMoreButton: {
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 8,
            marginVertical: 16,
            marginHorizontal: 24,
            alignItems: 'center'
        },
        loadMoreText: {
            color: 'black',
            fontSize: 16,
            fontWeight: '600'
        }
    });
