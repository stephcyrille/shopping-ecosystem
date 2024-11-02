import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.connector import APIConnector
from myproxy.serializers.payment_serializer import TransactionSerializer


class MakePaymentAPIViews(APIView):

    def post(self, request):
        conn = APIConnector()
        session_id = conn.connect() 

        cart_session_id = request.COOKIES.get('cart_session_id')
        if not cart_session_id:
            values = {
                "code": status.HTTP_403_FORBIDDEN,
                "errorMessage": "Payment transaction not secured",
                "message": "Payment transaction not secured between the endpoints",
            }
            return Response(values, status=status.HTTP_403_FORBIDDEN)

        # First check if we have a session key saved
        if session_id:
            serializer = TransactionSerializer(data=request.data)
            if serializer.is_valid():
                url = '/apis/payment/init'
                headers = {
                    'Content-Type': 'application/json'
                }
                res = conn.make_api_call(endpoint=url, method='POST', data=json.dumps(serializer.validated_data), headers=headers)
                print('\n\n')
                print(res)
                print('\n\n')
                print(serializer.validated_data)
                print('\n\n')
                try:
                    if res.get('result').get('data') is not None:
                        payment_ref = res.get('result').get('data').get('reference') 
                        channel = serializer.validated_data.get('channel')
                        phone = serializer.validated_data.get('customer_mobile')
                        # email = serializer.validated_data.get('customer_email')
                        if payment_ref is not None:
                            if 'cm.orange' == channel or 'cm.mtn' == channel:
                                carrier_data = {
                                    "reference": payment_ref,
                                    "channel": channel,
                                    'phone': phone
                                }
                                url_proceed = "/apis/payment/proceed"
                                res_proceed = conn.make_api_call(endpoint=url_proceed, method='POST', data=json.dumps(carrier_data), headers=headers)
                                print('\n\n')
                                print(res_proceed)
                                print('\n\n')
                                if res_proceed.get('result').get('code') is not None and 400 == res_proceed.get('result').get('code'):
                                    return Response(res_proceed.get('result'), status=status.HTTP_400_BAD_REQUEST)

                                return Response(res_proceed.get('result'), status=status.HTTP_200_OK)
                            else:
                                values = {
                                    "code": status.HTTP_400_BAD_REQUEST,
                                    "errorMessage": "Bad Payment channel",
                                    "message": f"{channel} is not a valid payment channel",
                                }
                                return Response(values, status=status.HTTP_400_BAD_REQUEST)

                        else:
                            values = {
                                "code": status.HTTP_400_BAD_REQUEST,
                                "errorMessage": "Payment transaction error",
                                "message": "Payment transaction id is missing",
                            }
                            return Response(values, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response(res.get('result'), status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    values = {
                        "code": status.HTTP_401_UNAUTHORIZED,
                        "errorMessage": "Failed to initialize payment (PROXY)",
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
                "code": status.HTTP_401_UNAUTHORIZED,
                "errorMessage": "Unauthorized request",
                "message": "Unauthorized request",
            }
            return Response(values, status=status.HTTP_401_UNAUTHORIZED)