from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from app.core.config import settings

security = HTTPBearer(auto_error=False)

async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    # 1. Check for Admin Secret Header (Bypass for your custom login)
    admin_secret = request.headers.get("X-Admin-Secret")
    if admin_secret and admin_secret == getattr(settings, "ADMIN_BYPASS_KEY", None):
        return {"email": settings.ADMIN_EMAIL, "role": "admin"}

    # 2. Otherwise, check for Firebase Token
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        user_email = decoded_token.get("email")
        
        # In private mode, only allow the authorized admin email
        if user_email != settings.ADMIN_EMAIL:
            raise HTTPException(status_code=403, detail="Unauthorized admin access")
            
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
