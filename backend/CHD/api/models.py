from django.db import models

# Create your models here.
class Community(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)

    def __str__(self):
        return f"Community name: {self.name}"
