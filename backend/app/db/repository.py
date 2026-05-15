from google.cloud.firestore import Client
from typing import TypeVar, Generic, Type, List, Optional, Any
from pydantic import BaseModel
from app.db.firebase import get_db
from datetime import datetime

T = TypeVar("T", bound=BaseModel)

class BaseRepository(Generic[T]):
    def __init__(self, collection_name: str, model_class: Type[T]):
        self.db: Client = get_db()
        self.collection = self.db.collection(collection_name)
        self.model_class = model_class

    def get(self, id: str) -> Optional[T]:
        doc = self.collection.document(id).get()
        if doc.exists:
            data = doc.to_dict()
            data["id"] = doc.id
            return self.model_class(**data)
        return None

    def list(self, filters: List[tuple] = None, order_by: str = None, limit: int = None, descending: bool = True) -> List[T]:
        query = self.collection
        if filters:
            for field, op, value in filters:
                query = query.where(field, op, value)
        
        if order_by:
            direction = "DESCENDING" if descending else "ASCENDING"
            query = query.order_by(order_by, direction=direction)
        
        if limit:
            query = query.limit(limit)
            
        docs = query.stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(self.model_class(**data))
        return results

    def create(self, id: str, data: Any) -> T:
        if isinstance(data, BaseModel):
            data_dict = data.model_dump()
        else:
            data_dict = data
            
        # Ensure ID is not in the body if we are setting it manually
        if "id" in data_dict:
            del data_dict["id"]
            
        self.collection.document(id).set(data_dict)
        data_dict["id"] = id
        return self.model_class(**data_dict)

    def update(self, id: str, data: Any) -> Optional[T]:
        if isinstance(data, BaseModel):
            data_dict = data.model_dump(exclude_unset=True)
        else:
            data_dict = data
            
        self.collection.document(id).update(data_dict)
        return self.get(id)

    def delete(self, id: str) -> bool:
        self.collection.document(id).delete()
        return True
