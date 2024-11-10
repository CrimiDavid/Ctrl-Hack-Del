from . import views
from django.urls import path


urlpatterns = [
    path('test/', views.CommunityView.as_view(), name=''),
    path('listUsers/', views.UserView.as_view(), name=''),
    path('seeLocations/', views.LocationView.as_view(), name=''),
    path('seeAddresses/', views.AddressView.as_view(), name=''),
    path('seeCommunityUsers/', views.CommunityUserView.as_view(), name=''),
    
]
