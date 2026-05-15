from app.db.collections import CreatorRepository, ContentRepository
from app.providers.instagram import MockInstagramProvider
from app.models.schemas import Creator, ContentBase
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self):
        self.creator_repo = CreatorRepository()
        self.content_repo = ContentRepository()
        self.providers = {
            "instagram": MockInstagramProvider()
        }

    async def sync_creator(self, creator_id: str):
        creator = self.creator_repo.get(creator_id)
        if not creator or creator.status != "active":
            return
            
        provider = self.providers.get(creator.platform)
        if not provider:
            logger.error(f"Provider not found for platform: {creator.platform}")
            return

        try:
            # Update metadata if missing
            if not creator.avatar_url:
                metadata = await provider.get_creator_metadata(creator.handle)
                self.creator_repo.update(creator_id, metadata)

            # Fetch new content
            new_items = await provider.fetch_latest_content(creator.handle, creator.last_sync)
            
            for item in new_items:
                # Deduplication: Check if source link already exists
                # In production, we'd use a composite index or a hash of the source link
                existing = self.content_repo.list(filters=[("source_link", "==", item.source_link)], limit=1)
                if existing:
                    continue

                content_id = str(uuid.uuid4())
                content_data = {
                    **item.model_dump(),
                    "id": content_id,
                    "creator_id": creator_id,
                    "ingested_at": datetime.utcnow(),
                    "tags": [] # Could extract from caption
                }
                self.content_repo.create(content_id, content_data)

            # Update last sync time
            self.creator_repo.update(creator_id, {"last_sync": datetime.utcnow()})
            
        except Exception as e:
            logger.error(f"Error syncing creator {creator.handle}: {str(e)}")
            raise e

    async def sync_all_active(self):
        creators = self.creator_repo.list(filters=[("status", "==", "active")])
        for creator in creators:
            await self.sync_creator(creator.id)
