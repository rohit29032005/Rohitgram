from abc import ABC, abstractmethod
from typing import List
from app.models.schemas import ContentBase
from datetime import datetime

class ContentProvider(ABC):
    @property
    @abstractmethod
    def platform_name(self) -> str:
        pass

    @abstractmethod
    async def fetch_latest_content(self, handle: str, last_sync: datetime = None) -> List[ContentBase]:
        """
        Fetch latest public content for a given handle.
        """
        pass

    @abstractmethod
    async def get_creator_metadata(self, handle: str) -> dict:
        """
        Fetch creator metadata like name and avatar URL.
        """
        pass
