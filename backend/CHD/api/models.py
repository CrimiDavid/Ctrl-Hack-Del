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
    timestamp = models.TimeField(auto_now_add=True)

    def __str__(self):
        return f"Message content: {self.content}"
    

class Location(models.Model):
    

    def __str__(self):
        return f"Location: {self.latitude}, {self.longitude}"


class Location(models.Model):
    city = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    region = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    latitude_delta = models.FloatField()
    longitude_delta = models.FloatField()

    def __str__(self):
        return f"Location: {self.city}"
    

class UserRefs(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)


class Event(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    users = models.ManyToManyField(User, related_name="event")
    
