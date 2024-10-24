import hashlib
import uuid

def generate_unique_code():
    # Generate a random UUID (Universally Unique Identifier)
    unique_id = uuid.uuid4()
    
    # Create a SHA-1 hash of the UUID
    hash_object = hashlib.sha1(str(unique_id).encode())
    
    # Convert the hash to a hexadecimal string
    unique_code = hash_object.hexdigest()
    
    return unique_code