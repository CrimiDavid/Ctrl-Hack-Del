import React from 'react';
import MapView, { Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useUser } from '~/lib/context/userContext';
import { ActivityIndicator } from 'react-native';

export default function App() {
  // Use hook to get the user
  const { user } = useUser();
  console.log(user)
  // Get the initial location from the user context
  const initialLocation = user?.location;

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
        style={styles.map}
        initialRegion={initialLocation as Region}
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