from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Conversation(models.Model):
    name = models.CharField(max_length=200)
    users = models.ManyToManyField(User, related_name="conversation")

    def __str__(self):
        return f"Conversation: {self.name}"


class Message(models.Model):
    content = models.TextField()
    from_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    to_conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message content: {self.content}"
    

class Location(models.Model):
    city = models.CharField(max_length=200, default="")
    country = models.CharField(max_length=200, default="")
    region = models.CharField(max_length=200, default="")
    latitude = models.FloatField()
    longitude = models.FloatField()
    latitude_delta = models.FloatField()
    longitude_delta = models.FloatField()

    def __str__(self):
        return f"Location: {self.latitude}, {self.longitude}"


class UserRefs(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)


class Event(models.Model):
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_events")
    name = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    users = models.ManyToManyField(User, related_name="event")
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)
