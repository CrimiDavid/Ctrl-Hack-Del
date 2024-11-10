import React, { Suspense, useEffect } from 'react';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region, Geojson, MarkerPressEvent } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useUser } from '~/lib/context/userContext';
import { ActivityIndicator } from 'react-native';
import { getCommunityPins } from '~/lib/context/apiClient';

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

export default function Map() {
  // Use hook to get the user
  const { user } = useUser();
  // Get the initial location from the user context
  const initialLocation = user?.location;
  // Create a reference to the map view
  const mapRef = React.useRef<MapView>(null);

  const [communityPins, setCommunityPins] = React.useState<CommunityPin[]>([]);

  useEffect(() => {
    if (user?.location) {
      // Set the user's house pin
      const userPin = {
        id: "-1",
        type: "Custom" as const,
        description: "My House",
        city: user.location.city,
        region: user.location.region,
        country: user.location.country,
        latitude: user.location.latitude,
        longitude: user.location.longitude,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015
      };
  
      // Fetch community pins and combine with user pin
      getCommunityPins()
        .then(pins => {
          setCommunityPins([userPin, ...pins]);
        })
        .catch(error => {
          console.error('Failed to fetch community pins:', error);
          // Still show user's pin even if community pins fail
          setCommunityPins([userPin]);
        });
    }
  }, [user?.location]); // Depend on user location

  // If the user is loading the location, show a loading spinner
  if (!user || user.isLoadingLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onPressMarker = (event: MarkerPressEvent) => {
    console.log(event);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
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
        {communityPins.map(pin => {
          // Only render markers with valid coordinates
          if (pin.latitude && pin.longitude) {
            return (
              <Marker
                key={pin.id}
                coordinate={{
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                }}
                onPress={onPressMarker}
              >
                <View style={{ alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: 24 }}>📍</Text>
                  </View>
                  <Text>{pin.description}</Text>
                </View>
              </Marker>
            );
          }
          return null;
        })}
      </MapView>
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