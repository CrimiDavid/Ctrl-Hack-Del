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


class GetConversationMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        conversation_id = self.kwargs['id']
        return Message.objects.filter(to_conversation_id=conversation_id)
     

class LoadConversationsView(generics.ListAPIView):
    serializer_class = ConversationSerializer

    def get_queryset(self):
        user_id = self.kwargs['id']
        # Filter conversations for the specific user
        return Conversation.objects.filter(users__id=user_id)

    def list(self, request, *args, **kwargs):
        # Call get_queryset() to get the filtered queryset
        queryset = self.get_queryset()

        conversations_data = []

        # Loop through each conversation to add additional data (e.g., last message preview)
        for convo in queryset:
            # Retrieve the most recent message for each conversation
            last_message = Message.objects.filter(to_conversation_id=convo.id).order_by('-timestamp').first()
            
            # Prepare the preview and timestamp for each conversation
            preview = last_message.content if last_message else "No messages yet"
            timestamp = last_message.timestamp if last_message else None

            conversations_data.append({
                'conversation_id': convo.id,
                'name': convo.name,
                'preview': preview,
                'timestamp': timestamp
            })
        
        # Return the custom response with conversations data
        return Response(conversations_data, status=status.HTTP_200_OK)
