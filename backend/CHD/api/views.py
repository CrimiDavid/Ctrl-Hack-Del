from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .models import Location, Address, User
from .serializers import LocationSerializer, AddressSerializer, UserSerializer


# Create your views here.

class ListUsersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        excluded_id = self.kwargs['id']
        return User.objects.exclude(id=excluded_id)
