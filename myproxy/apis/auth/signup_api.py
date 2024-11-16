import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.conf import settings as djoser_settings
from djoser.email import ActivationEmail
from myproxy.serializers.auth.user_serializer import CustomSignupSerializer
from myproxy.utils.connector import APIConnector


class CustomSignupView(APIView):
    def post(self, request, *args, **kwargs):
        conn = APIConnector()
        session_id = conn.connect() 
        serializer = CustomSignupSerializer(data=request.data)

        if serializer.is_valid():
            # Save the user
            user = serializer.save()
            if djoser_settings.SEND_ACTIVATION_EMAIL:
                # Send the activation email
                context = {"user": user}
                to_email = [user.email]
                ActivationEmail(context=context).send(to_email)
                if session_id:
                    url = '/apis/profile/update'
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    payload = {
                        "firstname": user.first_name,
                        "lastname": user.last_name,
                        "email": user.email,
                    }
                    res = conn.make_api_call(endpoint=url, method='POST', data=json.dumps(payload), headers=headers)
                    try:
                        if res.get('result').get('data') is not None:
                            answer = res.get('result').get('data')
                        else:
                            answer = res.get('result')
                    except Exception as e:
                        answer = {
                            "code": status.HTTP_401_UNAUTHORIZED,
                            "errorMessage": "Failed to update user profile (PROXY)",
                            "message": e.__str__()
                        }
                else:
                    answer = {
                        "responseCode": status.HTTP_401_UNAUTHORIZED,
                        "description": "Unauthorized request",
                    }

            data = {
                "message": "User registered successfully. Please check your email to activate your account.",
                "data": answer
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
