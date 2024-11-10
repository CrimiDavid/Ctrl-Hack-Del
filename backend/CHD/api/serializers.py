from rest_framework import serializers
from .models import Community, Location, Address, CommunityUser, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ["name", "description"]


class CommunityUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityUser
        fields = ["user_id", "community_id"]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["latitude", "longitude", "latitudeDelta", "longitudeDelta"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["city", "country", "postal_code"]
