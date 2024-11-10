import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '~/lib/useColorScheme';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { createCommunityEvent } from '~/lib/context/apiClient';
import { useNavigation } from '@react-navigation/native';
import { cn } from '~/lib/utils';
import { useUser } from '~/lib/context/userContext';

interface CreateEventProps {
  onSuccess: () => void;
}

export default function CreateEvent({ onSuccess }: CreateEventProps) {
    const navigation = useNavigation();
    const { user } = useUser();
    const { isDarkColorScheme } = useColorScheme();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, updateLocation] = useState<Partial<UserLocation>>({});

    function extractLocationInfo(details: GooglePlaceDetail): Partial<UserLocation> {
        const locationInfo: Partial<UserLocation> = {
          city: null,
          region: null,
          country: null,
          latitude: null,
          longitude: null,
        };
      
        details.address_components.forEach(component => {
          if (component.types.includes('locality')) {
            locationInfo.city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            locationInfo.region = component.long_name;
          }
          if (component.types.includes('country')) {
            locationInfo.country = component.long_name;
          }
        });
      
        if (details.geometry && details.geometry.location) {
          locationInfo.latitude = details.geometry.location.lat;
          locationInfo.longitude = details.geometry.location.lng;
        }
      
        return locationInfo;
    }

    const handleSubmit = (_: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (!details) return;
        const locationInfo = extractLocationInfo(details);
        updateLocation(locationInfo);
    };

    const handleCreateEvent = async () => {
        // Update the event in the database
        await createCommunityEvent({
            event_name: eventName,
            date: eventDate.toISOString(),
            description: description,
            owner_id: user?.id,
            city: location.city,
            region: location.region,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
            latidideDelta: 0,
            longitudeDelta: 0,
        });
        // Callback to parent component
        onSuccess();
        // Navigate back to the previous screen
        navigation.goBack();
    };

    const isFormComplete = Boolean(
        eventName &&
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
            <Text className="text-lg font-medium mb-2">Create Community Event</Text>
            <Text className="text-sm text-muted-foreground mb-4">
              Fill out the details for your community event
            </Text>
          </View>
        </Card>

        {/* Event Name Input */}
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-sm font-medium mb-2">Event Name</Text>
            <Input
              placeholder="Enter event name"
              value={eventName}
              onChangeText={setEventName}
              className="mb-2"
            />
          </View>
        </Card>

        {/* Event Date Picker */}
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-sm font-medium mb-2">Event Date</Text>
            <Button
              onPress={() => setShowDatePicker(true)}
              variant="outline"
              className="w-full justify-start"
            >
              <Text className="text-foreground">
                {eventDate.toLocaleDateString()}
              </Text>
            </Button>
            
            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setEventDate(selectedDate);
                  }
                }}
                minimumDate={new Date()}
              />
            )}
          </View>
        </Card>

        {/* Location Search */}
        <Card className="mb-4">
          <View className="p-4">
            <Text className="text-sm font-medium mb-2">Event Location</Text>
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
              placeholder="Describe your event..."
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
            {location.city && (
              <View className="mb-4">
                <Text className="text-sm text-muted-foreground">
                  Selected Location: {location.city}, {location.region}
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
              onPress={handleCreateEvent}
            >
              <Text className={!isFormComplete ? "text-muted-foreground" : "text-primary-foreground"}>
                Create Event
              </Text>
            </Button>
          </View>
        </Card>
      </ScrollView>
    );
}