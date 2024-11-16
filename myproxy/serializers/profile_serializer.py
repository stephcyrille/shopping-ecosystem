# serializers.py
from rest_framework import serializers

class ProfileUpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    firstname = serializers.CharField()
    lastname = serializers.CharField()

