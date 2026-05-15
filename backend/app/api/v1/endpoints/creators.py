from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.models.schemas import Creator, CreatorCreate, CreatorUpdate
from app.db.collections import CreatorRepository
from datetime import datetime
from app.tasks.ingestion_tasks import sync_single_creator_task
import uuid

router = APIRouter()
repo = CreatorRepository()

@router.post("", response_model=Creator, status_code=status.HTTP_201_CREATED)
async def create_creator(creator_in: CreatorCreate):
    existing = repo.get_by_handle(creator_in.handle)
    if existing:
        raise HTTPException(status_code=400, detail="Creator already exists")
    
    creator_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    creator_data = {
        **creator_in.model_dump(),
        "id": creator_id,
        "status": "active",
        "created_at": now,
        "last_sync": None,
        "avatar_url": None
    }
    
    return repo.create(creator_id, creator_data)

@router.get("", response_model=List[Creator])
async def list_creators():
    return repo.list(order_by="handle", descending=False)

@router.get("/{creator_id}", response_model=Creator)
async def get_creator(creator_id: str):
    creator = repo.get(creator_id)
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")
    return creator

@router.patch("/{creator_id}", response_model=Creator)
async def update_creator(creator_id: str, creator_in: CreatorUpdate):
    creator = repo.get(creator_id)
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")
    
    return repo.update(creator_id, creator_in)

@router.delete("/{creator_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_creator(creator_id: str):
    creator = repo.get(creator_id)
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")
    
    repo.delete(creator_id)
    return None
@router.post("/{creator_id}/sync", status_code=status.HTTP_202_ACCEPTED)
async def trigger_sync(creator_id: str):
    creator = repo.get(creator_id)
    if not creator:
        raise HTTPException(status_code=404, detail="Creator not found")
    
    sync_single_creator_task.delay(creator_id)
    return {"message": "Sync triggered", "creator_id": creator_id}
