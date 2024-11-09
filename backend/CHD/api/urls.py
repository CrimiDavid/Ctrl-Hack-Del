from . import views
from django.urls import path


urlpatterns = [
    path('test/', views.CommunityView.as_view(), name=''),
]
