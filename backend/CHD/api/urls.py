from . import views
from django.urls import path


urlpatterns = [
    path('listUsers/<str:id>/', views.ListUsersView.as_view(), name=''),
    path('sendMessage/', views.SendMessageView.as_view(), name=''),
    path('getConversationMessages/<str:id>/', views.GetConversationMessagesView.as_view(), name=''),
    path('createConversation/', views.CreateConversationView.as_view(), name=''),
    path('loadConversations/<str:id>/', views.LoadConversationsView.as_view(), name=''),
    path('login/', views.LoginView.as_view(), name=''),
    path('setUserLocation/', views.SetUserLocationView.as_view(), name=''),
    path('createEvent/', views.CreateEventView.as_view(), name=''),
    path('getUserInfo/<str:id>/', views.GetUserInfoView.as_view(), name=''),
    path('getAvailableEvents/<str:id>/', views.GetAvailableEventsView.as_view(), name=''),
    path('joinEvent/', views.JoinEventView.as_view(), name='get_user_info'),
    path('getAllEventLocations/', views.GetAllEventLocationsView.as_view(), name=''),
    path('getAllUserLocations/<str:id>/', views.GetAllUserLocationsView.as_view(), name='')
]
