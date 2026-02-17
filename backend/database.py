import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get DB credentials from env
# Get DB credentials
DATABASE_URL = os.getenv("DATABASE_URL")

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
