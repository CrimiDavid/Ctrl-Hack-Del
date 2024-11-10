import React from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { H3, H4 } from '~/components/ui/typography';
import { SunIcon } from 'lucide-react-native'
import { useColorScheme } from '~/lib/useColorScheme';
import { useUser } from '~/lib/context/userContext';

const getWeather = () => '27 degrees and sunny';
const handleAsk = (input: string) => {
  // Handle asking about the input
}

export default function ProfileScreen() {
  const [askInput, setAskInput] = React.useState('');
  const weather = getWeather(); // Assume this function exists


  // Hooks
  const { user } = useUser();
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Hello Message */}
      <View className="flex-row items-center mb-4 ml-4">
        <H3 className="text-3xl font-bold">Hello {user?.firstName} 👋</H3>
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
            <Text className="text-2xl">😃</Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}