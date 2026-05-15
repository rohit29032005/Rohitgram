from app.tasks.celery_app import celery_app
import app.tasks.ingestion_tasks  # Import to register tasks

if __name__ == "__main__":
    celery_app.worker_main()
