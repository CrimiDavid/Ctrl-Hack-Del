from django.contrib import admin
from .models import Message, Conversation, Location, UserRefs, Event


# Register your models here.
admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(Location)
admin.site.register(UserRefs)
admin.site.register(Event)
