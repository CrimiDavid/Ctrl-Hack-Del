import React from 'react';
import { View, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParamListBase, RouteProp, useNavigation } from '@react-navigation/native';
import { ChevronRight } from 'lucide-react-native';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Switch } from '~/components/ui/switch';
import { useColorScheme } from '~/lib/useColorScheme';
import SetAddress, { SetAddressProps } from './SetAddress';

const Stack = createNativeStackNavigator();

function Settings() {
  const navigation = useNavigation();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-background p-4">
      <Card>
        <View className="divide-y divide-border">
          {/* Theme Toggle */}
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-base">Dark Theme</Text>
            <Switch
              checked={isDarkColorScheme}
              onCheckedChange={toggleColorScheme}
            />
          </View>

          {/* Address Setting */}
          <Pressable
            onPress={() => navigation.navigate('SetAddress' as never)}
            className="flex-row items-center justify-between p-4 active:bg-muted/50"
          >
            <Text className="text-base">Set Address</Text>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Pressable>
        </View>
      </Card>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'System',
        },
      }}
    >
        <Stack.Screen 
          name="SettingsMain" 
          component={Settings}
          options={{
            title: 'Settings',
          }}
        />
        <Stack.Screen 
          name="SetAddress" 
          options={{
            title: 'Set Address',
            presentation: 'modal',
          }}
        >
            {props => <SetAddress {...props} onLocationUpdate={() => {}} />}
        </Stack.Screen>
    </Stack.Navigator>
  );
}