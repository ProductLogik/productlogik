from database import SessionLocal
from sqlalchemy import text
import sys

def check_connection():
    try:
        db = SessionLocal()
        # Try a simple query
        result = db.execute(text("SELECT 1"))
        print("[SUCCESS] Database connection successful!")
        
        # Try to list tables (Postgres specific)
        result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result]
        print(f"[SUCCESS] Found tables: {tables}")
        
        # Check users count
        result = db.execute(text("SELECT count(*) FROM users"))
        count = result.scalar()
        print(f"[SUCCESS] User count: {count}")
        
        db.close()
        return True
    except Exception as e:
        print(f"[FAILED] Database connection failed: {e}")
        return False

if __name__ == "__main__":
    if check_connection():
        sys.exit(0)
    else:
        sys.exit(1)
