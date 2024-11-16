import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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