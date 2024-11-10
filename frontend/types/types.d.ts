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