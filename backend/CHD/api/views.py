from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .models import Community
from .serializers import CommunitySerializer


# Create your views here.


class CommunityView(generics.ListCreateAPIView):

    queryset = Community.objects.all()
    serializer_class = CommunitySerializer


# class FindCommunityByNameView(generics.)    
