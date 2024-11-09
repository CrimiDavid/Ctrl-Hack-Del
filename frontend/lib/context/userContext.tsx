import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region } from 'react-native-maps';

export interface UserLocation {
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  latitudeDelta: number | null;
  longitudeDelta: number | null;
}

interface UserState {
  id: string;
  name: string;
  email: string;
  location: UserLocation | null;
  isLoadingLocation: boolean;
}

interface UserContextType {
  user: UserState | null;
  error: Error | null;
  updateUser: (data: Partial<UserState>) => void;
  initializeLocation: () => Promise<void>;
}

// Create the global context that will store the user state within the app
const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock initial user location data
const MOCK_USER_LOCATION: UserLocation = {
  city: 'San Francisco',
  region: 'California',
  country: 'United States',
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Mock initial user data
const MOCK_USER_DATA: UserState = {
  id: '1',
  name: 'Will Siddeley',
  email: 'will.email@gmail.com',
  location: MOCK_USER_LOCATION,
  isLoadingLocation: true,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const initializeLocation = async () => {
    if (!user) return;

    try {
      // Set loading state to true to indicate location is loading
      setUser(prev => prev ? { ...prev, isLoadingLocation: true } : null);
      
      // Request location permissions from the device
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Throw error to be caught in the catch block
      if (status !== 'granted') throw new Error('Location permission denied');

      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      
      // Get location details (reverse geocoding)
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Create user location object
      const userLocation: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922, // Change defaults?
        longitudeDelta: 0.0421,
        city: geocode?.city,
        region: geocode?.region,
        country: geocode?.country,
      };

      // Update user with location
      setUser(prev => prev ? {
        ...prev,
        location: userLocation,
        isLoadingLocation: false,
      } : null);

      // Store location in AsyncStorage
      await AsyncStorage.setItem('userLocation', JSON.stringify(userLocation));
    } 
    catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get location'));
      setUser(prev => prev ? { ...prev, isLoadingLocation: false } : null);
    }
  };

  // Hook to update user data with partial data
  const updateUser = (data: Partial<UserState>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  useEffect(() => {
    async function initializeUser() {
      try {
        // REPLACE THIS WITH API CALL TO GET USER DATA
        setUser(MOCK_USER_DATA);
        // Try to get cached location from device store
        const cachedLocation = await AsyncStorage.getItem('userLocation');
        if (cachedLocation) {
          // Parse cached location from string to object
          const parsedLocation = JSON.parse(cachedLocation);
          // Update user with cached location
          setUser(prev => prev ? {
            ...prev,
            location: parsedLocation,
            isLoadingLocation: false,
          } : null);
        }
        // Get fresh location
        await initializeLocation();
      }
      catch (err) {
        // Set error state
        setError(err instanceof Error ? err : new Error('Failed to initialize user: ' + err));
      }
      finally {
        // Set loading state to false
        setUser(prev => prev ? { ...prev, isLoadingLocation: false } : null);
      }
    }
    // Initialize user data
    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, error, updateUser, initializeLocation }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  // Get the user context
  const context = useContext(UserContext);
  // Throw error if context is undefined
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  // Return the context to be used in any component
  return context;
}