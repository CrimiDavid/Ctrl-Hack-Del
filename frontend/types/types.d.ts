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
    firstName: string;
    lastName: string;
    username: string;
    location: UserLocation | null;
    isLoadingLocation: boolean;
}
  
interface UserContextType {
    user: UserState | null;
    error: Error | null;
    updateUser: (data: Partial<UserState>) => void;
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

interface CommunityEventPin extends UserLocation {
    event_id: string;
    event_name: string;
    description: string;
    date: string;
    owner_first_name: string;
    owner_last_name: string;
    users: string[];
}

interface CommunityHousePin extends UserLocation {
    user_id: string;
    owner_first_name: string;
    owner_last_name: string;
}