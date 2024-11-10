import React from 'react';
import Social from '~/components/screens/Social';
import CreateEvent from '~/components/screens/CreateEvent';
import CreateCommunity from '~/components/screens/CreateCommunity';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function SocialStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Social" component={Social} />
        <Stack.Screen name="CreateEvent">
          {props => <CreateEvent {...props} onSuccess={() => {}} />}
        </Stack.Screen>
        <Stack.Screen name="CreateCommunity">
          {props => <CreateCommunity {...props} onSuccess={() => {}} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

export default function SocialScreen() {
    return <SocialStack />
}
