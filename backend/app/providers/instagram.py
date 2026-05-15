from app.providers.base import ContentProvider
from app.models.schemas import ContentBase
from typing import List
from datetime import datetime, timedelta
import random

class MockInstagramProvider(ContentProvider):
    @property
    def platform_name(self) -> str:
        return "instagram"

    async def fetch_latest_content(self, handle: str, last_sync: datetime = None) -> List[ContentBase]:
        # Simulate fetching data
        items = []
        num_items = random.randint(1, 5)
        
        for i in range(num_items):
            timestamp = datetime.utcnow() - timedelta(hours=random.randint(1, 24))
            
            # Skip if already synced
            if last_sync and timestamp <= last_sync:
                continue
                
            item_type = random.choice(["image", "video", "reel"])
            items.append(ContentBase(
                creator_id="", # Will be set by service
                type=item_type,
                caption=f"This is a mock post {i} from {handle} #mock #rohitgram",
                media_url=f"https://picsum.photos/seed/{handle}{i}/1080/1350",
                thumbnail_url=f"https://picsum.photos/seed/{handle}{i}/400/500",
                source_link=f"https://instagram.com/p/mock_id_{i}",
                timestamp=timestamp
            ))
        return items

    async def get_creator_metadata(self, handle: str) -> dict:
        return {
            "name": handle.capitalize(),
            "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={handle}"
        }
