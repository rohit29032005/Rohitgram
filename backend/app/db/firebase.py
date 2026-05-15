import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import settings
import json

def init_firebase():
    if not firebase_admin._apps:
        # Construct the service account info from environment variables
        # Replace escaped newlines in private key
        private_key = settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n")
        
        cred_dict = {
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key": private_key,
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)

init_firebase()

def get_db():
    return firestore.client()

def get_auth():
    return auth
