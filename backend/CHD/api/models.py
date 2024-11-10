from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Conversation(models.Model):
    name = models.CharField(max_length=200)
    users = models.ManyToManyField(User, related_name="conversations")

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
    latitude = models.FloatField()
    longitude = models.FloatField()
    latitude_delta = models.FloatField()
    longitude_delta = models.FloatField()

    def __str__(self):
        return f"Location: {self.latitude}, {self.longitude}"


class Address(models.Model):
    city = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    postal_code = models.CharField(max_length=200)

    def __str__(self):
        return f"Address: {self.postal_code}"
    

class UserRefs(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE)
