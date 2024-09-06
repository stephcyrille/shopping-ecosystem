import http.client
import http.cookies
from html.parser import HTMLParser
import socket

# define constants
HOST, PORT = "localhost", 9600
DATABASE = 'RESTAYD'


# Define the class to extract CSRF token from HTML
class CSRFTokenParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.csrf_token = None

    def handle_starttag(self, tag, attrs):
        if tag == 'input':
            attrs_dict = dict(attrs)
            if attrs_dict.get('name') == 'csrf_token':
                self.csrf_token = attrs_dict.get('value')


def get_session_id(host:str = HOST, port:int = PORT, database:str = DATABASE):
    path = f"/web?db={database}"
    session_id, csrf_token = None, None

    try:
        # Create connection to Odoo server
        conn = http.client.HTTPConnection(host, port, timeout=20)
        conn.request("GET", path)
        response = conn.getresponse()
        html_content = response.read().decode()

        print(response.__dict__)

        # Parse cookies to get the session ID
        cookie_header = response.getheader("Set-Cookie")
        # If cookies are set in the header, extract the session_id
        session_id = None
        if cookie_header:
            cookie = http.cookies.SimpleCookie(cookie_header)
            session_id = cookie.get('session_id').value if 'session_id' in cookie else None

        # Parse the HTML to extract the CSRF token
        parser = CSRFTokenParser()
        parser.feed(html_content)
        csrf_token = parser.csrf_token

    except socket.timeout:
        print("The request timed out. The server took too long to respond.")
    except http.client.HTTPException as e:
        print("An HTTP error occurred:", str(e))
    except Exception as e:
        print("An unexpected error occurred:", str(e))
    finally:
        # Always close the connection to free up resources
        if 'conn' in locals():
            conn.close()

    return session_id, csrf_token


def check_auth(user_id: int, res_user_obj) -> bool:
    # Check if the user id is not none
    if user_id is not None:
        user = res_user_obj.browse(user_id)
        if user.exists():
            return True
    return False

