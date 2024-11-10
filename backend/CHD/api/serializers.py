from rest_framework import serializers
from .models import Location, User, Message, Conversation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["content", "from_user_id", "to_conversation_id", "timestamp", "sender_first_name"]




class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["name", "users"]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["latitude", "longitude", "latitudeDelta", "longitudeDelta"]
