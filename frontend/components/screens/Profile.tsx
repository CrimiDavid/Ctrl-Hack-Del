import React from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { H3, H4 } from '~/components/ui/typography';
import { Car, SunIcon } from 'lucide-react-native'
import { useColorScheme } from '~/lib/useColorScheme';
import { useUser } from '~/lib/context/userContext';
import SetAddress from './SetAddress';

interface Event {
  name: string;
  date: string;
  address: string;
}

interface Community {
  community: string;
  memberCount: number;
}

const getWeather = () => '27 degrees and sunny';
const getEvents = () => [
  { name: 'Community Cleanup', date: 'Today', address: '123 Main St' },
  { name: 'Farmer\'s Market', date: 'Tomorrow', address: '456 Elm St' },
];
const getCommunities = () => [
  { community: 'Local Running Club', memberCount: 200 },
  { community: 'Neighborhood Watch', memberCount: 50 },
];
const handleAsk = (input: string) => {
  // Handle asking about the input
}

export default function ProfileScreen() {
  const [askInput, setAskInput] = React.useState('');
  const weather = getWeather(); // Assume this function exists
  const events = getEvents(); // Assume this function exists
  const communities = getCommunities(); // Assume this function exists

  // Hooks
  const { user } = useUser();
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Hello Message */}
      <View className="flex-row items-center mb-4 ml-4">
        <H3 className="text-3xl font-bold">Hello {user?.name} 👋</H3>
      </View>

      {/* Weather */}
      <Card className="mb-4">
        <CardHeader className="-mb-4">
          <CardDescription>
            Today's Weather Forecast:
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-row items-center py-6">
          <SunIcon color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className="text-lg"> {weather}</Text>
        </CardContent>
      </Card>

      {/* Events Near You */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Events Near You:</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="min-h-[120px]">
            {events && events.length > 0 ? (
              <ScrollView className="max-h-[200px]">
                {events.map((event: Event, index: number) => (
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
                <Text className="text-muted-foreground">No events found nearby</Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Ask About Community and Status */}
      <View className="flex-row gap-4 mb-4">
        <Card className="flex-1">
          <CardHeader className="-mb-4">
            <CardDescription>
              Ask Anything Local:
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <Input
              className="bg-secondary p-3 rounded-lg"
              placeholder="Best pizza places..."
              value={askInput}
              onChangeText={setAskInput}
              onSubmitEditing={() => handleAsk(askInput)}
            />
          </CardContent>
        </Card>
        <Card className="w-32">
          <CardHeader className="-mb-4">
            <CardDescription>
              My Status
            </CardDescription>
          </CardHeader>
          <CardContent className="items-center justify-center py-4">
            <Button
              variant="ghost"
              className="h-12 w-12"
              onPress={() => {
                // Handle status modal opening
              }}
            >
              <Text className="text-2xl">😂</Text>
            </Button>
          </CardContent>
        </Card>
      </View>

      {/* Communities Near Me */}
      <Card>
        <CardHeader>
          <CardTitle>Communities Near Me:</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="min-h-[120px]">
            {communities && communities.length > 0 ? (
              <ScrollView className="max-h-[200px]">
                {communities.map((community: Community, index: number) => (
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
        </CardContent>
      </Card>
    </ScrollView>
  );
}