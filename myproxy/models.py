from django.contrib.auth.models import AbstractUser
from django.db import models

class AydCustomUser(AbstractUser):
    birthdate = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username
