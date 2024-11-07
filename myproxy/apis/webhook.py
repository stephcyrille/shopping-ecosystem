import hashlib
import hmac
import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from myproxy.utils.connector import APIConnector


class WebHookPostApiView(APIView):

    def post(self, request):
        conn = APIConnector()
        session_id = conn.connect()
        
        if session_id:
            url = 'apis/payment/conf'
            res = conn.make_api_call(endpoint=url)

            try:
                private_key = res.get('result') # Private key from the backend
                # Signature from the request header
                signature = request.headers.get('x-notch-signature')

                # Start hashing ops
                secret_bytes = private_key.encode()
                body_bytes = request.body

                computed_hash = hmac.new(
                    secret_bytes,
                    body_bytes,
                    digestmod=hashlib.sha256
                )
                hash_digest = computed_hash.hexdigest()

                if not hmac.compare_digest(hash_digest, signature):
                    response = json.loads(request.body)
                    event = response.get('event')

                    url_proceed = '/apis/payment/confirm'
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    conn.make_api_call(endpoint=url_proceed, method='POST', data=request.body, headers=headers)
                    res = {
                        "code": 200,
                        "message": f"Transaction {event} {'success' if event == 'payment.complete' else ''}",
                        "messageBody": f"Transaction {'completed clearly' if event == 'payment.complete' else event}"
                    }
                    return Response(res, status=status.HTTP_200_OK)
                else:
                    res = {
                        "code": 401,
                        "message": "Unauthorized sender",
                        "messageBody": "The sender of the transaction is not reconized"
                    }
                    return Response(res, status=status.HTTP_200_OK)
            except Exception as e:
                res = {
                    "code": 400,
                    "message": f"Bad request body when grabbing key or from request",
                    "messageBody": e.__str__()
                }
                return Response(res, status=status.HTTP_400_BAD_REQUEST)

        else:
            values = {
                "responseCode": status.HTTP_401_UNAUTHORIZED,
                "description": "Unauthorized request",
            }
            return Response(values, status=status.HTTP_401_UNAUTHORIZED)
                
            
