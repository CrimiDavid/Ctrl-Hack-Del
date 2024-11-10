from rest_framework import serializers
from .models import Location, Address, User, Message, Conversation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["content", "from_user_id", "to_conversation_id", "timestamp"]


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["name", "users"]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["latitude", "longitude", "latitudeDelta", "longitudeDelta"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["city", "country", "postal_code"]
