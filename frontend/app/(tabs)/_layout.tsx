import React from 'react';
import "react-native-get-random-values"
import { FontAwesome } from '@expo/vector-icons';
import { Settings } from 'lucide-react-native'
import { useColorScheme } from '~/lib/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '~/lib/context/authContext';
import { Redirect } from 'expo-router';
import Map from './index';
import Messages from './messages';
import Profile from './profile';
import Social from './social';

const Tabs = createBottomTabNavigator();

export default function TabLayout() {
  
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const { userId } = useAuth();

  // If no token, redirect to auth
  if (!userId) {
    return <Redirect href="/auth/login" />;
  }

  return (
      <Tabs.Navigator initialRouteName="map">
        <Tabs.Screen
          name="index"
          options={{
            title: 'Map',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="map" size={size} color={color} />
            ),
          }}
          component={Map}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="comment" size={size} color={color} />
            ),
          }}
          component={Messages}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: 'Social',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" size={size} color={color} />
            ),
          }}
          component={Social}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
            headerRightContainerStyle: {
              marginRight: 20,
            },
            headerRight: () => (
              <Settings 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
                onPress={() => navigation.navigate('Settings' as never)}
              />
            ),
          }}
          component={Profile}
        />
      </Tabs.Navigator>
  );
}