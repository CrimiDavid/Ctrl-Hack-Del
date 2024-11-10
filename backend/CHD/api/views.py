from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Location, Address, User, Message, Conversation
from .serializers import LocationSerializer, AddressSerializer, UserSerializer, MessageSerializer, ConversationSerializer
from django.contrib.auth import authenticate


# Create your views here.

class ListUsersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        excluded_id = self.kwargs['id']
        return User.objects.exclude(id=excluded_id)
     
class SendMessageView(generics.CreateAPIView):
    
    def post(self, request, *args, **kwargs):
        content = request.data.get("content")
        from_user_id = request.data.get("from_user_id")
        to_conversation_id = request.data.get("to_conversation_id")

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

        return Response(status=status.HTTP_201_CREATED)


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

class CreateConversationView(generics.CreateAPIView):
    
    def post(self, request, *args, **kwargs):
        content = request.data.get("content")
        from_user_id = request.data.get("from_user_id")
        to_user_ids = request.data.get("to_user_ids")  # List of user IDs to include in the conversation
        conversation_name = request.data.get("conversation_name")

        # Check if all required fields are provided
        if not content or not from_user_id or not to_user_ids or not conversation_name:
            return Response({"error": "content, from_user_id, to_user_ids, and conversation_name are required fields."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Validate the users
        try:
            from_user = User.objects.get(id=from_user_id)
            to_users = User.objects.filter(id__in=to_user_ids)
            if to_users.count() != len(to_user_ids):
                return Response({"error": "One or more user IDs are invalid."},
                                status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Invalid from_user_id."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create the conversation
        conversation = Conversation.objects.create(name=conversation_name)
        conversation.users.add(from_user, *to_users)  # Add all users to the conversation

        # Create the message in the newly created conversation
        message = Message(content=content, from_user_id=from_user, to_conversation_id=conversation)
        message.save()

        # Serialize and return the response
        serializer = self.get_serializer(message)
        
#Address and Location Views
class SetAddressView(generics.ListAPIView):
    
    def post(self, request, *args, **kwargs):
        city = request.data.get("city")
        country = request.data.get("country")
        postal_code = request.data.get("postal_code")
        
        
        if not city or not country or not postal_code:
                return Response({"error": "city, country, and postal_code are requied fields."},
                            status=status.HTTP_400_BAD_REQUEST)
                
        address = Address(city=city, country=country, postal_code=postal_code)
        address.save()
        
        return Response(status=status.HTTP_201_CREATED)
        
#Auth Views
class LoginView(generics.ListAPIView):

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
    
        # Check if both username and password are provided
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user using Django's built-in method
        user = authenticate(request, username=username, password=password)

        # If authentication is successful
        if user is not None:
        
            # Return the user's ID or any other data you want to return
            return Response({"user_id": user.id}, status=status.HTTP_200_OK)
        
        # If authentication fails
        return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)
