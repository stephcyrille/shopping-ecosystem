import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.serializers.cart_serializer import CartSerializer, SetCartSerializer
from myproxy.utils.code_generator import generate_unique_code
from myproxy.utils.connector import APIConnector


class GetCartSessionViews(APIView):

    def get(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        cart_session_id = request.COOKIES.get('cart_session_id')
        if not cart_session_id:
            values = {"Ok": False}
            response = Response(values, status=status.HTTP_200_OK)
            return response
        else:
            if session_id:
                url = f'apis/cart/current?cart_session_id={cart_session_id}'
                res = conn.make_api_call(endpoint=url)
                res = res.get('result') if res.get('result') is not None else {}

                values = {
                    "responseCode": status.HTTP_200_OK,
                    "data": res,
                }
                return Response(values, status=status.HTTP_200_OK)
            else:
                values = {
                    "responseCode": status.HTTP_401_UNAUTHORIZED,
                    "description": "Unauthorized request",
                }
                return Response(values, status=status.HTTP_401_UNAUTHORIZED)
            
class AddProductCartSessionViews(APIView):

    def post(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        cart_session_id = request.COOKIES.get('cart_session_id')
        if not cart_session_id:
            values = {"Ok": False}
            response = Response(values, status=status.HTTP_200_OK)
            return response
        else:
            if session_id:
                serializer = CartSerializer(data=request.data)
                if serializer.is_valid():
                    url = '/apis/cart/update'
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    body = {
                        "params": {
                            "product_id": serializer.validated_data['product_id'],
                            "add_qty": serializer.validated_data['add_qty'],
                            "force_create": True,
                            "cart_ref": cart_session_id
                        }
                    }
                    res = conn.make_api_call(endpoint=url, method='POST', data=json.dumps(body), headers=headers)
                    try:
                        values = {
                            "responseCode": status.HTTP_200_OK,
                            "data": res,
                        }
                        return Response(values, status=status.HTTP_200_OK)
                    except Exception as e:
                        values = {
                            "code": status.HTTP_401_UNAUTHORIZED,
                            "errorMessage": "Failed to initialize payment",
                            "message": e.__str__()
                        }
                        return Response(values, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    values = {
                        "code": status.HTTP_400_BAD_REQUEST,
                        "errorMessage": "Bad request",
                        "message": serializer.errors,
                    }
                    return Response(values, status=status.HTTP_400_BAD_REQUEST)
            else:
                values = {
                    "responseCode": status.HTTP_401_UNAUTHORIZED,
                    "description": "Unauthorized request",
                }
                return Response(values, status=status.HTTP_401_UNAUTHORIZED)
            
class SetProductCartSessionViews(APIView):

    def post(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        cart_session_id = request.COOKIES.get('cart_session_id')
        if not cart_session_id:
            values = {"Ok": False}
            response = Response(values, status=status.HTTP_200_OK)
            return response
        else:
            if session_id:
                serializer = SetCartSerializer(data=request.data)
                if serializer.is_valid():
                    url = '/apis/cart/update'
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    body = {
                        "params": {
                            "product_id": serializer.validated_data['product_id'],
                            "line_id": serializer.validated_data['line_id'],
                            "set_qty": serializer.validated_data['set_qty'],
                            "cart_ref": cart_session_id,
                        }
                    }
                    if serializer.validated_data['is_delete']:
                        body = {
                            "params": {
                                "product_id": serializer.validated_data['product_id'],
                                "line_id": serializer.validated_data['line_id'],
                                "set_qty": serializer.validated_data['set_qty'],
                                "cart_ref": cart_session_id,
                            }
                        }
                    else:
                        body = {
                            "params": {
                                "product_id": serializer.validated_data['product_id'],
                                "line_id": serializer.validated_data['line_id'],
                                "set_qty": serializer.validated_data['set_qty'],
                                "cart_ref": cart_session_id,
                                "update_methode": serializer.validated_data['update_methode'],
                            }
                        }

                    res = conn.make_api_call(endpoint=url, method='POST', data=json.dumps(body), headers=headers)
                    try:
                        values = {
                            "responseCode": status.HTTP_200_OK,
                            "data": res.get('result'),
                        }
                        return Response(values, status=status.HTTP_200_OK)
                    except Exception as e:
                        values = {
                            "code": status.HTTP_401_UNAUTHORIZED,
                            "errorMessage": "Failed to initialize payment",
                            "message": e.__str__()
                        }
                        return Response(values, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    values = {
                        "code": status.HTTP_400_BAD_REQUEST,
                        "errorMessage": "Bad request",
                        "message": serializer.errors,
                    }
                    return Response(values, status=status.HTTP_400_BAD_REQUEST)
            else:
                values = {
                    "responseCode": status.HTTP_401_UNAUTHORIZED,
                    "description": "Unauthorized request",
                }
                return Response(values, status=status.HTTP_401_UNAUTHORIZED)
