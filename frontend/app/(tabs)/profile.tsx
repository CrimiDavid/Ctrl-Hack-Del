import React from 'react';
import Profile from '~/components/screens/Profile';
import Settings from '~/components/screens/Settings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ProfileStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    );
  }

export default function ProfileScreen() {
    return <ProfileStack />
}
