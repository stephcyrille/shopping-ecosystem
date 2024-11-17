# serializers.py
from rest_framework import serializers

class ProfileUpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    firstname = serializers.CharField()
    lastname = serializers.CharField()

class AddressUpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    state = serializers.CharField()
    city = serializers.CharField()
    street = serializers.CharField()
    phone = serializers.CharField()
    adressType = serializers.CharField()
    name = serializers.CharField()
    email = serializers.CharField()
    add = serializers.CharField()

