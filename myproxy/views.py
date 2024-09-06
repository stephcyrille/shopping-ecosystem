import json
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import requests


class TestView(APIView):
    renderer_classes = (JSONRenderer,)

    @staticmethod
    def get(request):
        print("========================================================")
        print("--------------- ATM MANUAL CASH OUT API ----------------")
        print("========================================================")

        path = 'apis/products'
        url = f"{settings.ODOO_SERVER_HOST}:{settings.ODOO_SERVER_PORT}/{path}"
        headers = {
            'Cookie': 'session_id=d5625551737baff830cb9df98229dd41d2a7fb82',
            'Content-Type': 'application/json'
        }
        try:
            response = requests.request('GET', url, headers=headers, timeout=3000)

            print("\n\n")
            print(response.status_code)
            # print(response.content)
            print(response.__dict__)
            print("\n\n")

            if 200 == response.status_code:
                values = {
                    "responseCode": response.status_code,
                    "description": json.loads(response.content),
                }
                return Response(values, status=status.HTTP_200_OK)
            if 404 == response.status_code:
                values = {
                    "responseCode": response.status_code,
                    "description": "Seems that your session expired please reinitialise a new session",
                }
                return Response(values, status=status.HTTP_200_OK)
            values = {
                "responseCode": response.status_code,
                "description": "Post executed but not well",
            }
            return Response(values, status=status.HTTP_200_OK)
        except Exception as e:
            values = {
                "responseCode": 400,
                "description": e.__str__(),
            }
            return Response(values, status=status.HTTP_400_BAD_REQUEST)
