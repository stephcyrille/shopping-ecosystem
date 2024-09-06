from django.conf import settings
from django.core.cache import cache
import requests


class APIConnector:
    BASE_URL = f"{settings.ODOO_SERVER_HOST}:{settings.ODOO_SERVER_PORT}"
    LOGIN_ENDPOINT = "web/session/authenticate"
    LOGIN_PAYLOAD = {
        'jsonrpc': '2.0',
        'method': 'call',
        'params': {
            'db': settings.ODOO_DB,
            'login': settings.ODOO_USER,
            'password': settings.ODOO_PASSWORD,
        }
    }

    def __init__(self, base_url=BASE_URL, session_key='session_id', cache_timeout=(60 * 60 * 24 * 2)):
        """
        Initializes the API connector.

        :param base_url: The base URL for the API
        :param session_key: The cache key where the session ID will be stored
        :param cache_timeout: How long the session ID will be cached (in seconds), default is 1 day (86400 seconds)
        """
        self.base_url = base_url
        self.session_key = session_key
        self.cache_timeout = cache_timeout
        self.session_id = None
    
    def connect(self, login_endpoint=LOGIN_ENDPOINT, payload=LOGIN_PAYLOAD):
        """
        Connect to the API and retrieve the session ID, store it in cache.
        
        :param login_endpoint: The endpoint to retrieve the session ID from
        :param payload: The data (credentials) to send to the API to get the session ID
        :return: The session ID or None if there's an error
        """
        # Check if session ID is already cached
        self.session_id = cache.get(self.session_key)
        if self.session_id:
            print(f"Session ID loaded from cache: {self.session_id}")
            return self.session_id
        
        # If not cached, connect to API
        print("Session ID not in cache, connecting to API...")
        try:
            response = requests.post(f"{self.base_url}/{login_endpoint}", json=payload)
            response.raise_for_status()
            response_data = response.json()

            # Assuming the session ID is returned in 'session_id'
            self.session_id = response_data.get('session_id')
            
            # Store session ID in cache
            if self.session_id:
                cache.set(self.session_key, self.session_id, timeout=self.cache_timeout)
                print(f"Session ID {self.session_id} saved to cache.")
            return self.session_id
        except requests.RequestException as e:
            print(f"Error connecting to API: {e}")
            return None
    
    def get_cached_session(self):
        """
        Retrieve the session ID from the cache.
        
        :return: The session ID from cache or None if not found
        """
        return cache.get(self.session_key)

    def make_api_call(self, endpoint, method='GET', data=None, headers=None):
        """
        Make a generic API call using the cached session ID.
        
        :param endpoint: The API endpoint
        :param method: HTTP method ('GET', 'POST', etc.)
        :param data: Payload for POST requests
        :param headers: Optional headers
        :return: The response from the API
        """
        if not self.session_id:
            print("No session ID found, please connect first.")
            return None
        
        url = f"{self.base_url}/{endpoint}"
        headers = headers or {}
        headers['Cookie'] = f"session_id={self.session_id}"

        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers)
            else:
                print(f"HTTP method {method} not supported.")
                return None

            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error making API call: {e}")
            return None

