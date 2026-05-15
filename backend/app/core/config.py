from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "RohitGram API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Firebase
    FIREBASE_PROJECT_ID: str
    FIREBASE_PRIVATE_KEY: str
    FIREBASE_CLIENT_EMAIL: str
    
    # Redis
    REDIS_URL: str
    
    # Security
    ADMIN_EMAIL: str
    SECRET_KEY: str
    ADMIN_BYPASS_KEY: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Ingestion
    SYNC_INTERVAL_MINUTES: int = 60
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
