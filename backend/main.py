import logging
logging.basicConfig(filename='debug.log', level=logging.DEBUG, format='%(asctime)s %(message)s')
logging.info("--- BACKEND STARTING ---")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

from auth import router as auth_router
from upload import router as upload_router
from analysis import router as analysis_router
from database import engine, Base

# Create tables (if using simple SQL models without alembic for MVP)
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProductLogik API")

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(analysis_router, prefix="/api", tags=["analysis"])

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow ALL origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ProductLogik API is running"}
