import React, { Suspense } from 'react';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region, Geojson } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useUser } from '~/lib/context/userContext';
import { ActivityIndicator } from 'react-native';

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

  const mapRef = React.useRef<MapView>(null);

  if (!initialLocation) {
    return null;
  }

  // If the user is loading the location, show a loading spinner
  if (user?.isLoadingLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
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
      >

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