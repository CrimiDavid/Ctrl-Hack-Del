import React, { Suspense, useEffect } from 'react';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region, Geojson, MarkerPressEvent } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useUser } from '~/lib/context/userContext';
import { useAuth } from '~/lib/context/authContext';
import { ActivityIndicator } from 'react-native';
import { getCommunityEventPins, getCommunityHousePins } from '~/lib/context/apiClient';
import MapInfoModal from '~/components/screens/MapInfoModal';

// This style removes most default map elements
const BLANK_MAP_STYLE = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [
      { visibility: 'on' }  // Removes all labels
    ]
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      { visibility: 'off' }  // Removes points of interest
    ]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      { visibility: 'off' }  // Removes transit stations
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'all',
    stylers: [
      { visibility: 'on' }  // Removes administrative regions
    ]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      { visibility: 'off' }  // Removes road labels
    ]
  }
];

export default function Map({ refresh }: { refresh: boolean }) {
  // Use hook to get the user
  const { user, initializeUser } = useUser();
  const { userId, signIn } = useAuth();
  // Get the initial location from the user context
  const initialLocation = user?.location;
  // Create a reference to the map view
  const mapRef = React.useRef<MapView>(null);
  console.log(refresh)
  const [communityPins, setCommunityPins] = React.useState<CommunityEventPin[]>([]);
  const [communityHouses, setCommunityHouses] = React.useState<CommunityHousePin[]>([]);
  const [selectedPin, setSelectedPin] = React.useState<CommunityEventPin | CommunityHousePin | null>(null);
  const [modalType, setModalType] = React.useState<'event' | 'house'>('event');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    if (user?.location) {
      // Fetch community pins and combine with user pin
      refreshCommunityEvents();
      refreshUserLocation();
    }
  }, [user?.location, refresh]); // Depend on user location

  const refreshCommunityEvents = () => {
    getCommunityEventPins()
      .then(pins => {
        console.log("Community Event Pins:", pins)
        setCommunityPins(pins);
      })
  }

  const refreshUserLocation = () => {
    getCommunityHousePins(userId!)
      .then(pins => {
        console.log("Community House Pins:", pins)
        setCommunityHouses(pins);
      })
  }

  // If the user is loading the location, show a loading spinner
  if (!user || user.isLoadingLocation || !communityPins || !communityHouses) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onPressMarker = (pin: CommunityEventPin | CommunityHousePin, type: 'event' | 'house') => {
    setSelectedPin(pin);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialLocation as Region}
        customMapStyle={BLANK_MAP_STYLE}
        showsPointsOfInterest={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        showsMyLocationButton={false}
        onLayout={() => {
          mapRef.current?.animateCamera({
            pitch: 45,
          })
        }}
      >
        {user && user.location && user.location.latitude && user.location.longitude && (
        <Marker
          key="custom-house"
          coordinate={{
            latitude: user.location.latitude,
            longitude: user.location.longitude,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 24 }}>📍</Text>
            </View>
            <Text>My House</Text>
          </View>
        </Marker>
        )}
        {communityPins.map(pin => {
          // Only render markers with valid coordinates
          if (pin.latitude && pin.longitude) {
            return (
              <Marker
                key={'event-marker-' + pin.event_id}
                coordinate={{
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                }}
                onPress={() => onPressMarker(pin, 'event')}
              >
                <View style={{ alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: 24 }}>📍</Text>
                  </View>
                  <Text>{pin.event_name}</Text>
                </View>
              </Marker>
            );
          }
          return null;
        })}
        {communityHouses.map(pin => {
          // Only render markers with valid coordinates
          if (pin.latitude && pin.longitude) {
            return (
              <Marker
                key={'event-marker-' + pin.user_id}
                coordinate={{
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                }}
                onPress={() => onPressMarker(pin, 'house')}
              >
                <View style={{ alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: 24 }}>🏠</Text>
                  </View>
                  <Text>{pin.owner_first_name}</Text>
                </View>
              </Marker>
            );
          }
          return null;
        })}
      </MapView>
      <MapInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPin(null);
        }}
        data={selectedPin}
        type={modalType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});