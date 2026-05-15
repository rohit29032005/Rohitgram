from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class CreatorBase(BaseModel):
    handle: str
    name: str
    platform: str = "instagram"
    category: Optional[str] = None
    is_favorite: bool = False

class CreatorCreate(CreatorBase):
    pass

class CreatorUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    is_favorite: Optional[bool] = None
    status: Optional[str] = None

class Creator(CreatorBase):
    id: str
    avatar_url: Optional[str] = None
    status: str = "active"
    last_sync: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ContentBase(BaseModel):
    creator_id: str
    type: str  # image, video, reel
    caption: Optional[str] = None
    media_url: str
    thumbnail_url: Optional[str] = None
    source_link: str
    timestamp: datetime

class Content(ContentBase):
    id: str
    ingested_at: datetime
    tags: List[str] = []

    class Config:
        from_attributes = True
