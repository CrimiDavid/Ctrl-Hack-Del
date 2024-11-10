from django.contrib import admin
from .models import Message, Conversation


# Register your models here.
admin.site.register(Message)
admin.site.register(Conversation)
