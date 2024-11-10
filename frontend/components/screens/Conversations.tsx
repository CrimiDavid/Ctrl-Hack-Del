// Conversations.tsx
import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    StyleSheet
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import NewConversationModal from '../modals/newChat';


export default function Conversations() {
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <FontAwesome name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>

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
        flex: 1
    },
    content: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16
    }
});
