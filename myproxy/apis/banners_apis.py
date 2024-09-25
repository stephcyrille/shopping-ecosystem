from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.connector import APIConnector


class GetHomeBannerAPIViews(APIView):

    def get(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        # First check if we have a session key saved
        if session_id:
            url = 'apis/banners/home'
            res = conn.make_api_call(endpoint=url)

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


class GetShopBannerAPIViews(APIView):

    def get(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        # First check if we have a session key saved
        if session_id:
            url = 'apis/banners/shop'
            res = conn.make_api_call(endpoint=url)

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