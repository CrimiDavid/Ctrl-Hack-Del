import { View, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { useAuth } from '~/lib/context/authContext';
import { useState } from 'react';

export default function Register() {
  // State for form inputs
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hooks
  const router = useRouter();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    try {
      // Reset states
      setIsLoading(true);
      setError('');
      // Attempt to sign up
      await signUp(name, username, password);
      // Redirect to home on success
      router.replace('/');
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 justify-center p-4">
        <Card className="p-4">
          <Text className="text-2xl font-bold text-center mb-6">Create Account</Text>
          <View className="space-y-4">
            <Input
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="mb-4"
            />
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="mb-4"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="mb-4"
            />

            {error ? <Text className="text-destructive text-sm">{error}</Text> : null}

            <Button onPress={handleRegister} disabled={isLoading || !name || !username || !password}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-primary-foreground">Sign Up</Text>
              )}
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                <Text className="text-primary">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}