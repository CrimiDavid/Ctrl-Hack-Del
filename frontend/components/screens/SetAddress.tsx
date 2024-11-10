import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useColorScheme } from '~/lib/useColorScheme';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { setUserLocation } from '~/lib/context/apiClient';
import { cn } from '~/lib/utils';

export default function SetAddress({ onLocationUpdate }: SetAddressProps) {
    const { isDarkColorScheme } = useColorScheme();
    
    const [location, updateLocation] = useState<Partial<UserLocation>>({});

    function extractLocationInfo(details: GooglePlaceDetail): Partial<UserLocation> {
        // Initialize return object with null values
        const locationInfo: Partial<UserLocation> = {
          city: null,
          region: null,
          country: null,
          latitude: null,
          longitude: null,
        };
      
        // Extract address components
        details.address_components.forEach(component => {
          // City (locality)
          if (component.types.includes('locality')) {
            locationInfo.city = component.long_name;
          }
          // Region (state/province)
          if (component.types.includes('administrative_area_level_1')) {
            locationInfo.region = component.long_name;
          }
          // Country
          if (component.types.includes('country')) {
            locationInfo.country = component.long_name;
          }
        });
      
        // Extract coordinates
        if (details.geometry && details.geometry.location) {
          locationInfo.latitude = details.geometry.location.lat;
          locationInfo.longitude = details.geometry.location.lng;
        }
      
        return locationInfo;
    }

    const handleSubmit = (_: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (!details) return;
        // Extract the relevant location information
        const locationInfo = extractLocationInfo(details);
        // Update the state with the new location
        updateLocation(locationInfo);
    };

    const handleUpdateLocation = async () => {
        // Update the user's location in the database
        await setUserLocation({ 
          city: location.city ?? null,
          region: location.region ?? null,
          country: location.country ?? null,
          latitude: location.latitude ?? null,
          longitude: location.longitude ?? null,
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421 
        });
        // Call the parent function to update the UI
        onLocationUpdate();
    }

    // Check if we have all required location fields
    const isLocationComplete = Boolean(
        location.city && 
        location.region && 
        location.country && 
        location.latitude && 
        location.longitude
    );

    // Dynamic styles based on theme
    const themeColors = {
      backgroundColor: isDarkColorScheme ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
      textColor: isDarkColorScheme ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
      placeholderColor: isDarkColorScheme ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)',
      borderColor: isDarkColorScheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
      itemBgColor: isDarkColorScheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)',
      footerBgColor: isDarkColorScheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)',
    };
  
    return (
      <ScrollView 
        keyboardShouldPersistTaps='always' 
        className="flex-1 bg-background p-4"
      >
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-lg font-medium mb-2">Enter Your Address</Text>
            <Text className="text-sm text-muted-foreground mb-4">
              Search for your address to set your location
            </Text>
          </View>
        </Card>
  
        <GooglePlacesAutocomplete
          placeholder=''
          onPress={handleSubmit}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
            language: 'en',
            components: 'country:can',
          }}
          disableScroll={true}
          fetchDetails={true}
          enablePoweredByContainer={true}
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              backgroundColor: themeColors.backgroundColor,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: themeColors.borderColor,
              paddingHorizontal: 8,
            },
            textInput: {
              height: 44,
              color: themeColors.textColor,
              fontSize: 16,
              backgroundColor: themeColors.backgroundColor,
            },
            predefinedPlacesDescription: {
              color: themeColors.textColor,
            },
            listView: {
              backgroundColor: themeColors.backgroundColor,
              borderRadius: 8,
              marginTop: 8,
            },
            row: {
              backgroundColor: themeColors.backgroundColor,
              padding: 13,
              height: 'auto',
              minHeight: 44,
            },
            separator: {
              height: 1,
              backgroundColor: themeColors.borderColor,
            },
            description: {
              color: themeColors.textColor,
            },
            poweredContainer: {
              backgroundColor: themeColors.footerBgColor,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderTopWidth: 1,
              borderColor: themeColors.borderColor,
              padding: 12,
            },
            powered: {
              // Keeping the Google attribution visible but styled
              height: 16,
              opacity: 0.7,
              tintColor: isDarkColorScheme ? '#ffffff' : undefined,
            },
            poweredText: {
              color: themeColors.textColor,
              opacity: 0.7,
              fontSize: 12,
            },
          }}
        />
        {/* Submit Button Card */}
        <Card>
          <View className="p-4">
            {isLocationComplete && (
              <View className="mb-4">
                <Text className="text-sm text-muted-foreground">
                  Selected Location: {location.city}, {location.region}
                </Text>
              </View>
            )}
            <Button
              className={cn(
                "w-full",
                !isLocationComplete && isDarkColorScheme && "bg-secondary hover:bg-secondary",
                !isLocationComplete && "opacity-50"
              )}
              disabled={!isLocationComplete}
              onPress={handleUpdateLocation}
            >
              <Text className={!isLocationComplete ? "text-muted-foreground" : "text-primary-foreground"}>
                Save Address
              </Text>
            </Button>
          </View>
        </Card>
      </ScrollView>
    );
  }