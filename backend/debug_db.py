
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import AnalysisResult, Upload
from database import SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
Session = sessionmaker(bind=engine)
db = Session()

print("--- RECENT UPLOADS ---")
uploads = db.query(Upload).order_by(Upload.created_at.desc()).limit(5).all()
for u in uploads:
    print(f"ID: {u.id}, Filename: {u.filename}, Status: {u.status}, Created: {u.created_at}")

print("\n--- RECENT ANALYSIS RESULTS ---")
results = db.query(AnalysisResult).order_by(AnalysisResult.created_at.desc()).limit(5).all()
for r in results:
    print(f"ID: {r.id}, Upload ID: {r.upload_id}, Created: {r.created_at}")
    print(f"Summary: {r.executive_summary[:500]}...")
    print("-" * 20)

db.close()
