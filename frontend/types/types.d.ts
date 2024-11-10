interface UserLocation {
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
    username: string;
    location: UserLocation | null;
    isLoadingLocation: boolean;
}
  
interface UserContextType {
    user: UserState | null;
    error: Error | null;
    updateUser: (data: Partial<UserState>) => void;
    initializeLocation: () => Promise<void>;
}

interface AuthState {
    userId: string | null;
    isLoading: boolean;
}
  
interface AuthContextType {
    userId: string | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (name: string, username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

interface MapEvent {
    name: string;
    date: string;
    address: string;
}
  
interface MapCommunity {
    community: string;
    memberCount: number;
}

interface SetAddressProps {
    onLocationUpdate: () => void;
}