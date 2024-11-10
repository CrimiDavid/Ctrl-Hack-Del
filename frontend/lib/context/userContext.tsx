import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserLocation } from './apiClient';
import { useAuth } from './authContext';

// Create the global context that will store the user state within the app
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Initialize the user state with null and no errors
  const [user, setUser] = useState<UserState | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Auth hook
  const { userId } = useAuth();

  // Hook to update user data with partial data
  const updateUser = (data: Partial<UserState>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  useEffect(() => {
    async function initializeUser() {
      if (!userId) return;
      try {
        // Get the user data from the server
        const userData = await getUserLocation(userId);
        // Set the user data
        setUser({
          id: userData.user_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          username: userData.email,
          location: {
            city: userData.city,
            region: userData.region,
            country: userData.country,
            latitude: userData.latitude,
            longitude: userData.longitude,
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015
          },
          isLoadingLocation: false,
        });
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
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, error, updateUser }}>
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