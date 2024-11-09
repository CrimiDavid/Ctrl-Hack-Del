from . import views
from django.urls import path


urlpatterns = [
    path('test/', views.Test.as_view(), name=''),
]
