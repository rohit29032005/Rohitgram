from app.tasks.celery_app import celery_app
from app.services.ingestion import IngestionService
import asyncio

@celery_app.task(name="tasks.sync_all_creators")
def sync_all_creators_task():
    service = IngestionService()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(service.sync_all_active())

@celery_app.task(name="tasks.sync_single_creator")
def sync_single_creator_task(creator_id: str):
    service = IngestionService()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(service.sync_creator(creator_id))
