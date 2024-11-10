from . import views
from django.urls import path


urlpatterns = [
    path('listUsers/<str:id>/', views.ListUsersView.as_view(), name=''),
    path('api/sendMessage/', views.SendMessageView.as_view(), name='')

    
]
