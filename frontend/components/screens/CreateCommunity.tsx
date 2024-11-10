import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useColorScheme } from '~/lib/useColorScheme';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createCommunity } from '~/lib/context/apiClient';
import { useNavigation } from '@react-navigation/native';
import { cn } from '~/lib/utils';

interface CreateCommunityProps {
  onSuccess: () => void;
}

interface CommunityLocation {
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export default function CreateCommunity({ onSuccess }: CreateCommunityProps) {
    const navigation = useNavigation();
    const { isDarkColorScheme } = useColorScheme();
    const [communityName, setCommunityName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState<CommunityLocation>({
      region: null,
      country: null,
      latitude: null,
      longitude: null
    });

    function extractRegionInfo(details: GooglePlaceDetail): CommunityLocation {
        const locationInfo: CommunityLocation = {
          region: null,
          country: null,
          latitude: null,
          longitude: null,
        };
      
        details.address_components.forEach(component => {
          // Only extract region (state/province) and country
          if (component.types.includes('administrative_area_level_1')) {
            locationInfo.region = component.long_name;
          }
          if (component.types.includes('country')) {
            locationInfo.country = component.long_name;
          }
        });
      
        // Get the center coordinates of the region
        if (details.geometry && details.geometry.location) {
          locationInfo.latitude = details.geometry.location.lat;
          locationInfo.longitude = details.geometry.location.lng;
        }
      
        return locationInfo;
    }

    const handleRegionSelect = (_: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (!details) return;
        const regionInfo = extractRegionInfo(details);
        setLocation(regionInfo);
    };

    const handleCreateCommunity = async () => {
        // Update the community in the database
        await createCommunity({
            name: communityName,
            description: description,
            city: '',
            region: location.region ?? '',
            country: location.country ?? '',
            latitude: location.latitude ?? 0,
            longitude: location.longitude ?? 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
        });
        // Callback to parent component
        onSuccess();
        // Navigate back to the previous screen
        navigation.goBack();
    };

    const isFormComplete = Boolean(
        communityName &&
        description &&
        location.region &&
        location.country
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
            <Text className="text-lg font-medium mb-2">Create Community</Text>
            <Text className="text-sm text-muted-foreground mb-4">
              Start a new community in your region
            </Text>
          </View>
        </Card>

        {/* Community Name Input */}
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-sm font-medium mb-2">Community Name</Text>
            <Input
              placeholder="Enter community name"
              value={communityName}
              onChangeText={setCommunityName}
              className="mb-2"
            />
          </View>
        </Card>

        {/* Region Selection */}
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-sm font-medium mb-2">Region</Text>
            <GooglePlacesAutocomplete
              placeholder=''
              onPress={handleRegionSelect}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                language: 'en',
                components: 'country:can',
                types: '(regions)',
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
          </View>
        </Card>

        {/* Community Description */}
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-sm font-medium mb-2">Description</Text>
            <Textarea
              placeholder="Describe your community..."
              value={description}
              onChangeText={setDescription}
              className="min-h-[100px] mb-2"
              multiline
            />
          </View>
        </Card>

        {/* Submit Button */}
        <Card>
          <View className="p-4">
            {location.region && (
              <View className="mb-4">
                <Text className="text-sm text-muted-foreground">
                  Selected Region: {location.region}, {location.country}
                </Text>
              </View>
            )}
            <Button
              className={cn(
                "w-full",
                !isFormComplete && isDarkColorScheme && "bg-secondary hover:bg-secondary",
                !isFormComplete && "opacity-50"
              )}
              disabled={!isFormComplete}
              onPress={handleCreateCommunity}
            >
              <Text className={!isFormComplete ? "text-muted-foreground" : "text-primary-foreground"}>
                Create Community
              </Text>
            </Button>
          </View>
        </Card>
      </ScrollView>
    );
}