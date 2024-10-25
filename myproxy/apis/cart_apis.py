from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.code_generator import generate_unique_code
from myproxy.utils.connector import APIConnector


class GetCartSessionViews(APIView):

    def get(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        cart_session_id = request.COOKIES.get('cart_session_id')
        if not cart_session_id:
            # TODO req for getting a new cart
            values = {"Ok": False}
            response = Response(values, status=status.HTTP_200_OK)

            # Set the HttpOnly cookie with the session_id
            # Send card session to the customer
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
            if session_id:
                url = f'apis/cart/current?cart_session_id={cart_session_id}'
                res = conn.make_api_call(endpoint=url)
                res = res.get('result')

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
