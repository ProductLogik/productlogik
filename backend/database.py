import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env file
load_dotenv()

import sys

# Get DB credentials from env
# Get DB credentials
DATABASE_URL = os.getenv("DATABASE_URL")

print(f"DEBUG: DATABASE_URL is set: {bool(DATABASE_URL)}")

if DATABASE_URL:
    # Handle Render's postgres:// vs SQLAlchemy's postgresql://
    if DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    else:
        SQLALCHEMY_DATABASE_URL = DATABASE_URL
else:
    # Get DB credentials from env
    user = os.getenv("user")
    password = os.getenv("password")
    host = os.getenv("host")
    port = os.getenv("port")
    dbname = os.getenv("dbname")

    if not all([user, password, host, port, dbname]):
        print(f"CRITICAL ERROR: Missing DB credentials. User={bool(user)}, Pass={bool(password)}, Host={bool(host)}, Port={bool(port)}, DBName={bool(dbname)}")
        # We don't raise immediately to allow main.py to start and log this, 
        # but usage of models will fail.
        # Actually, let's raise but with a clear message that prints to stdout first
        sys.stdout.flush()
        raise ValueError("One or more database connection variables are missing in .env file")

    # Construct SQLAlchemy URL
    SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}"

# Create Engine
# pool_pre_ping=True helps handle dropped connections (common in cloud DBs)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
)

# Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
