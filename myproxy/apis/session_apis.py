import json
from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import requests

from myproxy.utils import connect_to_odoo


class GetSessionIdViews(APIView):
    renderer_classes = (JSONRenderer,)

    def get(self, request):
        cached_data = cache.get('session_id')
        print(cached_data)

        if not cached_data:
            response = connect_to_odoo()
            if 'responseCode' in response:
                if 'data' in response:
                    try:
                        session_id = response.get('data').get('session_id')
                        cache.set('session_id', session_id, timeout=(60 * 60 * 24 * 2)) # Timeout for 2 days
                    except Exception as e:
                        print(f"Error when catching: {e.__str__()}")

                    values = {
                        "responseCode": status.HTTP_200_OK,
                        "description": "Authentication successed",
                    }
                    return Response(values, status=status.HTTP_200_OK)
                else:
                    message = ''
                    try:
                        message = response.get('message')
                    except Exception as e:
                        message = '(Status code : 400) Other error'

                    values = {
                        "responseCode": status.HTTP_401_UNAUTHORIZED,
                        "description": message,
                    }
                    return Response(values, status=status.HTTP_401_UNAUTHORIZED)
            else:
                values = {
                    "errorCode": 500,
                    "error": "Odoo server error",
                }
                if 'error' in response:
                    values['description'] = response['error']
                return Response(values, status=status.HTTP_200_OK)
        else:
            return Response({'message': f'Yo {cached_data}'})

        
        
        
