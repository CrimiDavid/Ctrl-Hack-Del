from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .models import Location, Address, User
from .serializers import LocationSerializer, AddressSerializer, UserSerializer


# Create your views here.

class ListUsersView(generics.ListAPIView):
    serializer_class = UserSerializer

class CommunityView(generics.ListCreateAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    

class CommunityUserView(generics.ListCreateAPIView):
    queryset = CommunityUser.objects.all()
    serializer_class = CommunityUserSerializer


class LocationView(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class AddressView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    def get_queryset(self):
        excluded_id = self.kwargs['id']
        return User.objects.exclude(id=excluded_id)
