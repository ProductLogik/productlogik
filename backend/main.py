
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

from database import engine, Base
from auth import router as auth_router
from payment import router as payment_router
from upload import router as upload_router
from analysis import router as analysis_router

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("backend.log"),
        logging.StreamHandler()
    ]
)
logging.info("--- BACKEND STARTING ---")

# Create tables (if using simple SQL models without alembic for MVP)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProductLogik API")

# Enable CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost:5173",
    "http://localhost:5180", 
    "http://localhost:5181",
    "http://localhost:8001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5180",
    "http://127.0.0.1:5181",
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(payment_router, prefix="/api/subscription", tags=["subscription"])
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(analysis_router, prefix="/api", tags=["analysis"])

@app.get("/")
def read_root():
    return {"status": "ProductLogik API is running"}
