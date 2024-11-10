from . import views
from django.urls import path


urlpatterns = [
    path('listUsers/<str:id>/', views.ListUsersView.as_view(), name=''),

    
]
