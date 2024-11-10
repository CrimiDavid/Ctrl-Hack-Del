import React from 'react';
import { View } from 'react-native';
import { Dialog, DialogHeader, DialogFooter, DialogContent, DialogTitle, DialogOverlay } from '~/components/ui/dialog';
import { Text } from '~/components/ui/text';
import { Calendar, MapPin, Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { ScrollView } from 'react-native';
import { postJoinEvent } from '~/lib/context/apiClient';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/lib/context/authContext';

interface MapInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CommunityEventPin | CommunityHousePin | null;
  type: 'event' | 'house';
}

export default function MapInfoModal({ isOpen, onClose, data, type }: MapInfoModalProps) {
  if (!data) return null;
  const { userId } = useAuth();
  const renderEventContent = (event: CommunityEventPin) => {
    console.log(event.date)
    const handleJoinEvent = async () => {
      try {
        // Call your API to join the event
        await postJoinEvent(userId!, event.event_id);
        console.log("Joining event:", event.event_id);
        // Close the modal
        isOpen = false;
        onClose();
      } catch (error) {
        console.error("Failed to join event:", error);
      }
    };
  
    return (
      <View className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{event.event_name}</CardTitle>
            <CardDescription>
              Hosted by {event.owner_first_name} {event.owner_last_name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Date and Time */}
            <View className="flex-row items-center space-x-2">
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </View>
              <View>
                <Text className="font-medium">Date & Time</Text>
                <Text className="text-muted-foreground">
                  {format(new Date(event.date), 'PPP')}
                </Text>
              </View>
            </View>
  
            {/* Location */}
            <View className="flex-row items-center space-x-2">
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </View>
              <View>
                <Text className="font-medium">Location</Text>
                <Text className="text-muted-foreground">
                  {event.city}, {event.region}
                </Text>
              </View>
            </View>
  
            {/* Description */}
            <View>
              <Text className="font-medium mb-1">About</Text>
              <Text className="text-muted-foreground">
                {event.description}
              </Text>
            </View>
  
            {/* Attendees */}
            <View>
              <Text className="font-medium mb-2">Attendees ({event.users.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {event.users.map((user, index) => (
                    <View 
                      key={index} 
                      className="w-8 h-8 rounded-full bg-secondary items-center justify-center"
                    >
                      <Text className="text-xs">{user.charAt(0)}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </CardContent>
  
          <CardFooter>
            <Button 
              className="w-full"
              onPress={handleJoinEvent}
            >
              <Plus className="w-4 h-4 mr-2" />
              <Text className="text-primary-foreground">Join Event</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    );
  };

  const renderHouseContent = (house: CommunityHousePin) => (
    <View className="space-y-4">
      <View>
        <Text className="text-lg font-bold">
          {house.owner_first_name}'s House
        </Text>
      </View>
      
      <View>
        <Text className="font-medium">Location</Text>
        <Text className="text-muted-foreground">
          {house.city}, {house.region}
        </Text>
      </View>
    </View>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="bg-black/40" />
        <DialogContent className="p-6 bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {type === 'event' ? 'Event Details' : 'Community Member'}
            </DialogTitle>
          </DialogHeader>

          {type === 'event' 
            ? renderEventContent(data as CommunityEventPin)
            : renderHouseContent(data as CommunityHousePin)
          }

          <DialogFooter className="mt-6">
            <Button variant="outline" className="w-full" onPress={onClose}>
              <Text>Close</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}