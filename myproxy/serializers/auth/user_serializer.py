from djoser.serializers import UserCreateSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from myproxy.models import AydCustomUser


class CustomSignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])
    birthdate = serializers.DateField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = AydCustomUser
        fields = ['username', 'email', 'password', 'birthdate', 'first_name', 'last_name']

    def create(self, validated_data):
        # Create the user and hash their password
        user = AydCustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            birthdate=validated_data['birthdate'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_active=False
        )
        user.set_password(validated_data['password'])
        user.save()
        return user