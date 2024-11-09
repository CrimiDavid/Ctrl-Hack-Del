import React from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

export default function MessagesScreen() {
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                flex: 1,
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    padding: 16
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Plus pressed');
                        }}
                    >
                        <FontAwesome name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}