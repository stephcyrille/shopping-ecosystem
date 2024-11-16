import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from myproxy.serializers.profile_serializer import ProfileUpdateSerializer
from myproxy.utils.connector import APIConnector


class GetCustomerAddressViews(APIView):
    permission_classes = [IsAuthenticated]

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
                url = f'apis/address/all?user={request.user.username}'
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

class GetCustomerProfileViews(APIView):
    permission_classes = [IsAuthenticated]

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
                url = f'apis/profile/get?user={request.user.username}'
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
            

class UpdateProfileViews(APIView):
    permission_classes = [IsAuthenticated]

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
                serializer = ProfileUpdateSerializer(data=request.data)
                if serializer.is_valid():
                    url = '/apis/profile/update'
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    res = conn.make_api_call(endpoint=url, method='POST', data=json.dumps(serializer.validated_data), headers=headers)
                    try:
                        if res.get('result').get('data') is not None:
                            return Response(res.get('result').get('data'), status=status.HTTP_200_OK)
                        else:
                            return Response(res.get('result'), status=status.HTTP_417_EXPECTATION_FAILED)
                    except Exception as e:
                        values = {
                            "code": status.HTTP_401_UNAUTHORIZED,
                            "errorMessage": "Failed to update user profile (PROXY)",
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