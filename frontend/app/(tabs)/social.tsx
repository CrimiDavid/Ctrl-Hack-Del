import React, { useEffect } from 'react';
import Social from '~/components/screens/Social';
import CreateEvent from '~/components/screens/CreateEvent';
import CreateCommunity from '~/components/screens/CreateCommunity';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function SocialStack({ refresh }: { refresh: boolean }) {

    useEffect(() => {
      // Logic to refresh items goes here
      console.log('Refreshing items in Social tab');
    }, [refresh]);

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Social">
          {props => <Social {...props} refresh={refresh} />}
        </Stack.Screen>
        <Stack.Screen name="CreateEvent">
          {props => <CreateEvent {...props} onSuccess={() => {}} />}
        </Stack.Screen>
        <Stack.Screen name="CreateCommunity">
          {props => <CreateCommunity {...props} onSuccess={() => {}} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

export default function SocialScreen({ refresh }: { refresh: boolean }) {
    return <SocialStack refresh={refresh} />
}
