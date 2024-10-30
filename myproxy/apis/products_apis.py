from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.code_generator import generate_unique_code
from myproxy.utils.connector import APIConnector


class GetProductListAPIViews(APIView):

    def get(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        if session_id:
            url = 'apis/products'
            res = conn.make_api_call(endpoint=url)

            values = {
                "responseCode": status.HTTP_200_OK,
                "data": res,
            }
            # Create a response object
            response = Response(values, status=status.HTTP_200_OK)

            # Set the HttpOnly cookie with the session_id
            response.set_cookie(
                key='cart_session_id',  # Name of the cookie
                value=generate_unique_code(),  
                httponly=True,  # This makes the cookie HttpOnly
                secure=False,  # Set to True if using HTTPS in production
                samesite='Lax',  # Adjust based on your needs ('Lax', 'Strict', or 'None')
                max_age=(60 * 60 * 24 * 2),  # The cookie will expire in 2 days
            )

            return response
        else:
            values = {
                "responseCode": status.HTTP_401_UNAUTHORIZED,
                "description": "Unauthorized request",
            }
            return Response(values, status=status.HTTP_401_UNAUTHORIZED)

class GetSingleProductAPIViews(APIView):

    def get(self, request, *args, **kwargs):
        conn = APIConnector()
        session_id = conn.connect() 

        # First check if we have a session key saved
        if session_id:
            try:
                id = self.kwargs['id']
                if id is not None:
                    url = f'apis/products/single/{id}'
                    res = conn.make_api_call(endpoint=url)

                    values = {
                        "responseCode": status.HTTP_200_OK,
                        "data": res,
                    }
                    return Response(values, status=status.HTTP_200_OK)
            except:
                values = {
                    "responseCode": status.HTTP_404_NOT_FOUND,
                    "error": res,
                    "message": "No res",
                }
                return Response(values, status=status.HTTP_404_NOT_FOUND)
        else:
            values = {
                "responseCode": status.HTTP_401_UNAUTHORIZED,
                "description": "Unauthorized request",
            }
            return Response(values, status=status.HTTP_401_UNAUTHORIZED)