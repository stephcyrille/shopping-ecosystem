from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.connector import APIConnector
from myproxy.utils.code_generator import generate_unique_code


class GetUserCartSessionAPIViews(APIView):

    def get(self, request):
        cart_session_id = request.COOKIES.get('cart_session_id')
        print("\n\n\n")
        print(cart_session_id)
        print("\n\n\n")


        # if we don't have a cart_session_id we need to create it and share it with the client
        if not cart_session_id:
            values = {"Ok": True}
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
            values = {"Ok": True}
            response = Response(values, status=status.HTTP_200_OK)
            return response