
import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
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

# --- Lifespan ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logging.info("Database tables initialized successfully.")
    except Exception as e:
        logging.error(f"Error during database initialization: {e}")
        # Note: We continue startup even if DB fails so Render sees the app as "up"
    yield
    # Shutdown
    logging.info("Shutting down backend...")

app = FastAPI(title="ProductLogik API", lifespan=lifespan)

# Enable CORS
# Enable CORS
frontend_urls = [u.strip() for u in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",") if u.strip()]
origins = [
    "http://localhost:5173",
    "http://localhost:5180", 
    "http://localhost:5181",
    "http://localhost:8001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5180",
    "http://127.0.0.1:5181",
    "https://productlogik.com",
    "https://www.productlogik.com"
]

for u in frontend_urls:
    if u and u not in origins and u != "*":
        origins.append(u)

logging.info(f"CORS Allowed Origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app", # Permissive for any Vercel preview/deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug middleware to log origins
@app.middleware("http")
async def log_origin(request, call_next):
    origin = request.headers.get("origin")
    if origin:
        logging.info(f"Incoming Request Origin: {origin}")
    response = await call_next(request)
    return response

@app.get("/")
@app.head("/")
async def read_root():
    return {"status": "ProductLogik API is running"}

@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(payment_router, prefix="/api/subscription", tags=["subscription"])
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(analysis_router, prefix="/api", tags=["analysis"])
