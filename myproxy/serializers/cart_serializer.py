# serializers.py
from rest_framework import serializers

class CartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    add_qty = serializers.IntegerField()
    size = serializers.CharField()

class SetCartSerializer(serializers.Serializer):
    line_id = serializers.IntegerField()
    product_id = serializers.IntegerField()
    set_qty = serializers.IntegerField()
    update_methode = serializers.CharField(max_length=10, required=False)
    is_delete = serializers.BooleanField(default=False)
    size = serializers.CharField()
