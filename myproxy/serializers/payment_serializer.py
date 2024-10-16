# serializers.py
from rest_framework import serializers

class TransactionSerializer(serializers.Serializer):
    amount = serializers.IntegerField()
    description = serializers.CharField(max_length=255)
    reference = serializers.CharField(max_length=100)
    customer_email = serializers.EmailField()
    customer_name = serializers.CharField(max_length=100)
    customer_mobile = serializers.CharField(max_length=15)
    customer_street = serializers.CharField(max_length=255)
    customer_city = serializers.CharField(max_length=100)
    channel = serializers.CharField(max_length=100)
