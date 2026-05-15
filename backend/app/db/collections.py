from app.db.repository import BaseRepository
from app.models.schemas import Creator, Content
from typing import List, Optional
from datetime import datetime

class CreatorRepository(BaseRepository[Creator]):
    def __init__(self):
        super().__init__("creators", Creator)

    def get_by_handle(self, handle: str) -> Optional[Creator]:
        results = self.list(filters=[("handle", "==", handle)], limit=1)
        return results[0] if results else None

class ContentRepository(BaseRepository[Content]):
    def __init__(self):
        super().__init__("content", Content)

    def get_feed(self, limit: int = 20, start_after: datetime = None) -> List[Content]:
        query = self.collection.order_by("timestamp", direction="DESCENDING")
        
        if start_after:
            query = query.start_after({"timestamp": start_after})
            
        query = query.limit(limit)
        docs = query.stream()
        
        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(Content(**data))
        return results

    def get_by_creator(self, creator_id: str, limit: int = 20) -> List[Content]:
        return self.list(filters=[("creator_id", "==", creator_id)], order_by="timestamp", limit=limit)
