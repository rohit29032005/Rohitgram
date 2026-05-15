from fastapi import APIRouter
from app.db.collections import CreatorRepository, ContentRepository
from app.db.firebase import get_db

router = APIRouter()
creator_repo = CreatorRepository()
content_repo = ContentRepository()

@router.get("")
async def get_dashboard_stats():
    db = get_db()
    
    # Get total creators
    creators = creator_repo.list()
    total_creators = len(creators)
    favorite_creators = len([c for c in creators if c.is_favorite])
    
    # Get total content count (approximate or via aggregation if possible)
    # For Firestore, we might need a counter or just count the collection
    # For now, we'll just return counts from recent docs or use firestore aggregation query
    content_ref = db.collection("content")
    count_query = content_ref.count()
    total_content = count_query.get()[0][0].value
    
    # Get last sync info
    last_syncs = [c.last_sync for c in creators if c.last_sync]
    latest_sync = max(last_syncs) if last_syncs else None
    
    return {
        "total_creators": total_creators,
        "favorite_creators": favorite_creators,
        "total_content": total_content,
        "latest_sync": latest_sync,
        "system_status": "operational"
    }
