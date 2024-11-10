import React, { useState } from 'react';
import "react-native-get-random-values"
import { FontAwesome } from '@expo/vector-icons';
import { RefreshCcw, Settings, View } from 'lucide-react-native'
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
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

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
            headerRight: () => (
              <View style={{ marginRight: 24 }}>
                <RefreshCcw 
                  color={colorScheme === 'dark' ? 'white' : 'black'} 
                  onPress={handleRefresh}
                />
              </View>
            ),
          }}
        >
          {props => <Social {...props} refresh={refresh} />}
        </Tabs.Screen>
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
            headerRight: () => (
              <View style={{ marginRight: 24 }}>
                <Settings 
                  color={colorScheme === 'dark' ? 'white' : 'black'} 
                  onPress={() => navigation.navigate('Settings' as never)}
                />
              </View>
            ),
          }}
          component={Profile}
        />
      </Tabs.Navigator>
  );
}