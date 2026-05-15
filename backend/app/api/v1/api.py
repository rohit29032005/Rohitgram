from fastapi import APIRouter, Depends
from app.api.v1.endpoints import creators, feed, stats
from app.api.v1.deps import get_current_user

api_router = APIRouter(dependencies=[Depends(get_current_user)])
api_router.include_router(creators.router, prefix="/creators", tags=["creators"])
api_router.include_router(feed.router, prefix="/feed", tags=["feed"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
