from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.models.schemas import Content
from app.db.collections import ContentRepository
from datetime import datetime

router = APIRouter()
repo = ContentRepository()

@router.get("", response_model=List[Content])
async def get_feed(
    limit: int = Query(20, gt=0, le=100),
    cursor: Optional[datetime] = None,
    creator_id: Optional[str] = None
):
    if creator_id:
        return repo.get_by_creator(creator_id, limit=limit)
    
    return repo.get_feed(limit=limit, start_after=cursor)

@router.get("/{content_id}", response_model=Content)
async def get_content(content_id: str):
    content = repo.get(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content
