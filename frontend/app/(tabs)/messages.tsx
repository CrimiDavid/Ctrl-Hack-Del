// MessagesScreen.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Conversations from '../../components/screens/Conversations';
import Chat from "~/components/screens/Chat";

const Stack = createNativeStackNavigator();

export default function MessagesScreen(){
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen
                name="Conversations"
                component={Conversations}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>

    );
}
