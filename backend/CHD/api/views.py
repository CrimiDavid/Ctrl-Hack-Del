from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Location, Address, User, Message, Conversation
from .serializers import LocationSerializer, AddressSerializer, UserSerializer, MessageSerializer, ConversationSerializer


# Create your views here.

class ListUsersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        excluded_id = self.kwargs['id']
        return User.objects.exclude(id=excluded_id)
     
class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    
    def post(self, request, *args, **kwargs):
        content = request.data.get("content")
        from_user_id = request.data.get("from_user_id")
        to_conversation_id = request.data.get("to_conversation_id")
        print(content)
        print(from_user_id)
        print(to_conversation_id)
        if not content or not from_user_id or not to_conversation_id:
            return Response({"error": "content, from_user_id, and to_conversation_id are required fields."},
                        status=status.HTTP_400_BAD_REQUEST)

        # Validate that the from_user_id and to_conversation_id are valid user IDs
        try:
            from_user_id = User.objects.get(id=from_user_id)
            to_conversation_id = Conversation.objects.get(id=to_conversation_id)
        except (User.DoesNotExist, Conversation.DoesNotExist):
            return Response({"error": "Invalid from_user_id or to_conversation_id."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create the Message instance
        message = Message(content=content, from_user_id=from_user_id, to_conversation_id=to_conversation_id)
        message.save()

        # Serialize the response
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
