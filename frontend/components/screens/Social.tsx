import React, { useState, useEffect } from 'react';
import { View, ScrollView } from "react-native";
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '~/components/ui/card';
import { useNavigation } from '@react-navigation/native';
import { getCommunityEvents } from '~/lib/context/apiClient';
import { useAuth } from '~/lib/context/authContext';
import { useColorScheme } from '~/lib/useColorScheme';

  const getCommunities = () => [
    { community: 'Local Running Club', memberCount: 200 },
    { community: 'Neighborhood Watch', memberCount: 50 },
  ];

export default function Social({ refresh }: { refresh: boolean }) {
    // Hooks / Context
    const { userId } = useAuth();
    const { colorScheme } = useColorScheme();
    const navigation = useNavigation();
    const communities = getCommunities(); // Assume this function exists
    const [events, setEvents] = useState<MapEvent[]>([]);

    useEffect(() => {
      // Fetch community events for the user
      getCommunityEvents(userId!).then((events) => setEvents(events));
    }, [refresh]); 

    return (
      <View>
        {/* Events Near You */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>
              Events Available To Join:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="min-h-[120px]">
              {events && events.length > 0 ? (
                <ScrollView className="max-h-[200px]">
                  {events.map((event: MapEvent, index: number) => (
                    <View
                      key={index}
                      className="flex-row justify-between items-center p-3 mb-2 bg-secondary rounded-lg"
                    >
                      <View className="flex-1">
                        <Text className="font-semibold">{event.name}</Text>
                        <Text className="text-muted-foreground">{event.date}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-muted-foreground">📍 {event.address}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-muted-foreground">No joinable events found nearby</Text>
                </View>
              )}
            </View>
            <View className="mt-4">
                <Button onPress={() => navigation.navigate('CreateEvent' as never)}>
                    <Text>Create Event</Text>
                </Button>
            </View>
          </CardContent>
        </Card>
        {/* Communities Near Me */}
        <Card>
          <CardHeader>
            <CardTitle>Communities Near You:</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="min-h-[120px]">
              {communities && communities.length > 0 ? (
                <ScrollView className="max-h-[200px]">
                  {communities.map((community: MapCommunity, index: number) => (
                    <View
                      key={index}
                      className="flex-row justify-between items-center p-3 mb-2 bg-secondary rounded-lg"
                    >
                      <Text className="font-semibold">{community.community}</Text>
                      <Text className="text-muted-foreground">
                        {community.memberCount} members
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-muted-foreground">No communities found nearby</Text>
                </View>
              )}
            </View>
            <View className="mt-4">
                <Button onPress={() => navigation.navigate('CreateCommunity' as never)}>
                    <Text>Create Community</Text>
                </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    );
}