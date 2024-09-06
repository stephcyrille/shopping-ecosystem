from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.connector import APIConnector


class GetSessionIdViews(APIView):

    def get(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        if session_id:
            values = {
                "responseCode": status.HTTP_200_OK,
                "description": f"Authentication session {session_id}",
            }
            return Response(values, status=status.HTTP_200_OK)
        else:
            values = {
                "responseCode": status.HTTP_401_UNAUTHORIZED,
                "description": "Unauthorized request",
            }
            return Response(values, status=status.HTTP_401_UNAUTHORIZED)

        
