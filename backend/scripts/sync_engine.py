import os
import json
import uuid
import logging
import requests
import instaloader
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore, storage

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Config from Environment
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL")
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", f"{FIREBASE_PROJECT_ID}.appspot.com")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate({
        "project_id": FIREBASE_PROJECT_ID,
        "private_key": FIREBASE_PRIVATE_KEY,
        "client_email": FIREBASE_CLIENT_EMAIL,
        "type": "service_account",
        "token_uri": "https://oauth2.googleapis.com/token",
    })
    firebase_admin.initialize_app(cred, {'storageBucket': STORAGE_BUCKET})

db = firestore.client()
bucket = storage.bucket()

def send_alert(message):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Telegram config missing, skipping alert.")
        return
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": f"🚨 RohitGram Sync: {message}"})
    except Exception as e:
        logger.error(f"Failed to send alert: {e}")

class RohitSync:
    def __init__(self):
        self.L = instaloader.Instaloader(
            download_pictures=False, 
            download_videos=True, 
            download_video_thumbnails=True,
            download_geotags=False, 
            download_comments=False,
            save_metadata=False,
            compress_json=False
        )

    def upload_to_storage(self, file_path, destination_path):
        blob = bucket.blob(destination_path)
        blob.upload_from_filename(file_path)
        blob.make_public()
        return blob.public_url

    def sync_all(self):
        creators_ref = db.collection("creators").where("status", "==", "active").stream()
        
        sync_stats = {"new": 0, "failed": 0, "errors": []}

        for doc in creators_ref:
            creator = doc.to_dict()
            creator['id'] = doc.id
            logger.info(f"Syncing @{creator['handle']}...")
            
            try:
                profile = instaloader.Profile.from_username(self.L.context, creator['handle'])
                posts = profile.get_posts()
                
                count = 0
                for post in posts:
                    if count >= 10: break # Only check latest 10
                    
                    # Check if already exists
                    existing = db.collection("content").where("source_link", "==", f"https://www.instagram.com/p/{post.shortcode}/").limit(1).get()
                    if len(existing) > 0:
                        count += 1
                        continue

                    # Download and Cache
                    logger.info(f"New post found: {post.shortcode}. Caching...")
                    
                    # Target filename
                    target_dir = f"temp_{post.shortcode}"
                    self.L.download_post(post, target=target_dir)
                    
                    # Find video file
                    video_file = None
                    for f in os.listdir(target_dir):
                        if f.endswith(".mp4"):
                            video_file = os.path.join(target_dir, f)
                            break
                    
                    if video_file:
                        # Upload to Firebase Storage
                        storage_path = f"reels/{creator['handle']}/{post.shortcode}.mp4"
                        public_url = self.upload_to_storage(video_file, storage_path)
                        
                        # Save to Firestore
                        content_id = str(uuid.uuid4())
                        db.collection("content").document(content_id).set({
                            "id": content_id,
                            "creator_id": creator['id'],
                            "type": "video",
                            "caption": post.caption,
                            "media_url": public_url,
                            "source_link": f"https://www.instagram.com/p/{post.shortcode}/",
                            "timestamp": post.date_utc,
                            "ingested_at": datetime.utcnow(),
                            "platform": "instagram"
                        })
                        sync_stats["new"] += 1
                    
                    # Cleanup temp files
                    import shutil
                    if os.path.exists(target_dir):
                        shutil.rmtree(target_dir)
                    count += 1

                # Update creator last_sync
                db.collection("creators").document(creator['id']).update({
                    "last_sync": datetime.utcnow()
                })

            except Exception as e:
                logger.error(f"Failed to sync @{creator['handle']}: {e}")
                sync_stats["failed"] += 1
                sync_stats["errors"].append(f"@{creator['handle']}: {str(e)}")

        # Log Sync Result
        db.collection("sync_logs").add({
            "timestamp": datetime.utcnow(),
            "status": "success" if sync_stats["failed"] == 0 else "partial_failure",
            "new_items": sync_stats["new"],
            "failed_count": sync_stats["failed"],
            "errors": sync_stats["errors"]
        })

        if sync_stats["failed"] > 0 or sync_stats["new"] > 0:
            msg = f"Completed. New: {sync_stats['new']}, Failed: {sync_stats['failed']}"
            if sync_stats["failed"] > 0:
                msg += f"\nErrors: {', '.join(sync_stats['errors'])}"
            send_alert(msg)

if __name__ == "__main__":
    sync = RohitSync()
    sync.sync_all()
