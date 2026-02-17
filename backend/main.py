from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from services.ai_service import AIService
import pandas as pd
import io

from auth import router as auth_router
from payment import router as payment_router
from database import engine, Base, get_db
from models import User
from dependencies import check_upload_quota, increment_usage

# Create tables (if using simple SQL models without alembic for MVP)
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProductLogik API")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(payment_router, prefix="/api/subscription", tags=["subscription"])

# Enable CORS for Frontend (Vite runs on 5176 commonly, 5173 is default, 5180 is new dev port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins for dev to fix "Failed to fetch"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ProductLogik API is running"}

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...), 
    current_user: User = Depends(check_upload_quota),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        # Enforce Row Limit for Demo Plan
        if current_user.usage_quota and current_user.usage_quota.plan_tier == "demo":
            if len(df) > 100:
                raise HTTPException(status_code=400, detail="Demo plan is limited to 100 rows per file. Upgrade to Pro.")

        # Extract the first text column we find as our "feedback" source
        # This is a naive heuristic for the MVP
        text_column = None
        for col in df.columns:
            if df[col].dtype == 'object': # String column
                text_column = col
                break
        
        if not text_column:
             raise HTTPException(status_code=400, detail="No text column found in CSV")

        feedback_items = df[text_column].dropna().tolist()
        
        # Call AI Service
        analysis_result = await AIService.analyze_feedback(feedback_items)
        
        # Increment Usage Check
        increment_usage(current_user, db)
        
        return {
            "filename": file.filename,
            "rows_processed": len(feedback_items),
            "analysis": analysis_result
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
