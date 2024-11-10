import React, { useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { useAuth } from '~/lib/context/authContext';

export default function Login() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hooks
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      // Reset states
      setIsLoading(true);
      setError('');
      // Attempt to sign in
      await signIn(username, password);
      // Redirect to home on success
      router.replace('/');
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 justify-center p-4">
        <Card className="p-4">
          <Text className="text-2xl font-bold text-center mb-6">Welcome Back 🤝</Text>
          <View className="space-y-4">
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

            {error ? <Text className="text-destructive text-sm mb-4">{error}</Text> : null}

            <Button onPress={handleLogin} disabled={isLoading || !username || !password}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-primary-foreground">Login</Text>
              )}
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/signup')}>
                <Text className="text-primary">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}