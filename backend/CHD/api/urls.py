from . import views
from django.urls import path


urlpatterns = [
    path('listUsers/<str:id>/', views.ListUsersView.as_view(), name=''),
    path('sendMessage/', views.SendMessageView.as_view(), name=''),
    path('getConversationMessages/<str:id>/', views.GetConversationMessagesView.as_view(), name=''),
    path('createConversation/', views.CreateConversationView.as_view(), name=''),
    path('loadConversations/<str:id>/', views.LoadConversationsView.as_view(), name='')
]
