import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments, useRootNavigationState  } from 'expo-router';
import apiClient from './apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This hook can be used to restrict access to routes for authenticated users
function useProtectedRoute(userId: string | null) {
  // Get the current route segments and the router object
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    // Check if the user is authenticated and if they are trying to access an auth route
    const inAuthGroup = segments[0] === 'auth';
    // If the user is not authenticated and they are trying to access an auth route
    if (!userId && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/auth/login');
    } 
    else if (userId && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [userId, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize the state with the userId and loading status
  const [state, setState] = useState<AuthState>({ userId: null, isLoading: true });

  useProtectedRoute(state.userId);

  useEffect(() => {
    async function loadUserId() {
      try {
        // Attempt to load the userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Set the userId in the state
          setState(prev => ({ ...prev, userId, isLoading: false }));
        }
        else {
          // Set the loading status to false
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
      catch (error) {
        // Set the loading status to false
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
    // Load the userId when the component mounts
    loadUserId();
  }, []);

  // Define the authentication context
  const authContext = {
    // The userId and loading status
    userId: state.userId,
    isLoading: state.isLoading,
    // The sign-in function
    signIn: async (email: string, password: string) => {
      try {
        // Make a POST request to the login endpoint
        const response = await apiClient.post('/api/login/', { "username": email, password });
        // Get the userId and user from the response
        const { user_id } = response.data;
        // Store the userId in AsyncStorage
        await AsyncStorage.setItem('userId', user_id.toString());
        // Add the userId to the state
        setState(prev => ({ ...prev, userId: user_id }));
        // Return the user
        return user_id;
      }
      catch (error) {
        console.error(error);
        // Throw an error if the login fails
        throw new Error('Invalid email or password');
      }
    },
    // The sign-up function
    signUp: async (name: string, email: string, password: string) => {
      try {
        // Make a POST request to the register endpoint
        const response = await apiClient.post('/api/register', { name, email, password });
        // Get the userId and user from the response
        const { userId, user } = response.data;
        // Store the userId in AsyncStorage
        await AsyncStorage.setItem('userId', userId.toString());
        // Add the userId to the state
        setState(prev => ({ ...prev, userId }));
        // Return the user        
        return user;
      }
      catch (error) {
        // Throw an error if the registration fails
        throw new Error('Registration failed');
      }
    },
    // The sign-out function
    signOut: async () => {
      try {
        // Remove the userId from AsyncStorage
        await AsyncStorage.removeItem('userId');
        // Set the userId to null in the state
        setState(prev => ({ ...prev, userId: null }));
      }
      catch (error) {
        // Throw an error if the sign
        throw new Error('Sign out failed');
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {!state.isLoading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  // Get the authentication context
  const context = useContext(AuthContext);
  // Throw an error if the context is undefined
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  // Return the context
  return context;
}