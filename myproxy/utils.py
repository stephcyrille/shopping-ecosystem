from django.conf import settings 
import requests

def connect_to_odoo():

    path = "web/session/authenticate"
    session_url = f"{settings.ODOO_SERVER_HOST}:{settings.ODOO_SERVER_PORT}/{path}"
    data = {
        'jsonrpc': '2.0',
        'method': 'call',
        'params': {
            'db': settings.ODOO_DB,
            'login': settings.ODOO_USER,
            'password': settings.ODOO_PASSWORD,
        }
    }

    try:
        session_response = requests.post(session_url, json=data)
        session_data = session_response.json()

        if 200 == session_response.status_code:
            if session_data.get('result') and session_response.cookies.get('session_id'):
                session_id = session_response.cookies['session_id']
                values = {
                    "responseCode": session_response.status_code,
                    "data": {
                        "session_id": session_id
                    }
                }
                return values
            else:
                values = {
                    "responseCode": session_response.status_code,
                    "message": "Error: Failed to authenticate"
                }
                return values
        else:
            values = {
                "responseCode": session_response.status_code,
                "message": "Error: Odoo server request error"
            }
            return values
    except Exception as e:
        values = {
            "errorCode": 500,
            "error": e.__str__(),
        }
        return values