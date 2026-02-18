from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
import pandas as pd
import io
from datetime import datetime
import logging

from database import get_db, SessionLocal
from models import Upload, FeedbackEntry, User, UsageQuota, AnalysisResult
from auth import get_current_user

router = APIRouter()

# Maximum file size: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
MAX_ROWS = 10000

logger = logging.getLogger(__name__)

async def run_ai_analysis(upload_id: str, db_session_factory):
    """Background task to run AI analysis and store results"""
    # Create a new DB session for the background task
    db = db_session_factory()
    try:
        from services.ai_service import ai_service
        logger.info(f"🚀 Starting Background AI Analysis for Upload {upload_id}...")
        
        # Get upload and quota
        upload = db.query(Upload).filter(Upload.id == upload_id).first()
        if not upload:
            logger.error(f"❌ Upload {upload_id} not found for background analysis")
            return
            
        quota = db.query(UsageQuota).filter(UsageQuota.user_id == upload.user_id).first()
        
        # Get feedback entries
        feedback_entries = db.query(FeedbackEntry).filter(
            FeedbackEntry.upload_id == upload.id
        ).all()
        
        feedback_data = [
            {"content": entry.content, "source": entry.source, "metadata": entry.metadata_json}
            for entry in feedback_entries
        ]
        
        # Run AI analysis
        analysis_result = await ai_service.analyze_feedback(feedback_data, str(upload.id))
        
        # Check if analysis actually succeeded or returned an error
        if analysis_result.get('error'):
            analysis_error = analysis_result.get('error')
            logger.error(f"❌ AI analysis failed for {upload.id}: {analysis_error}")
            
            # Create a failed result record
            analysis_record = AnalysisResult(
                upload_id=upload.id,
                executive_summary=f"Analysis failed: {analysis_error}",
                themes_json=[],
                confidence_score=0,
                processing_time_ms=analysis_result.get('processing_time_ms', 0)
            )
            db.add(analysis_record)
            db.commit()
        else:
            # Store successful analysis results
            analysis_record = AnalysisResult(
                upload_id=upload.id,
                themes_json=analysis_result.get('themes', []),
                executive_summary=analysis_result.get('executive_summary', ''),
                confidence_score=analysis_result.get('confidence_score', 0),
                processing_time_ms=analysis_result.get('processing_time_ms', 0),
                agile_risks_json=analysis_result.get('agile_risks', None)
            )
            db.add(analysis_record)
            
            # Increment usage quota (ONLY on success)
            if quota:
                quota.analyses_used += 1
            
            db.commit()
            logger.info(f"✅ AI analysis stored for {upload.id}. Quota used: {quota.analyses_used if quota else 'N/A'}")
        
    except Exception as e:
        logger.error(f"❌ Critical AI background task exception for {upload_id}: {str(e)}")
        # Try to record failure even if we hit a crash
        try:
            # Check if record already exists to avoid unique constraint error
            existing = db.query(AnalysisResult).filter(AnalysisResult.upload_id == upload_id).first()
            if not existing:
                analysis_record = AnalysisResult(
                    upload_id=upload_id,
                    executive_summary=f"Analysis failed due to system error: {str(e)}",
                    themes_json=[],
                    confidence_score=0
                )
                db.add(analysis_record)
                db.commit()
        except:
            pass
    finally:
        db.close()

@router.post("/upload")
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a CSV file containing feedback data.
    AI analysis runs in the background.
    """
    # 0. Check Usage Quota
    quota = db.query(UsageQuota).filter(UsageQuota.user_id == current_user.id).first()
    
    if not quota:
        quota = UsageQuota(user_id=current_user.id, plan_tier="demo", analyses_limit=3, analyses_used=0)
        db.add(quota)
        db.commit()
        db.refresh(quota)
        
    if quota.analyses_used >= quota.analyses_limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Usage limit reached ({quota.analyses_used}/{quota.analyses_limit}). Please upgrade your plan."
        )
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please upload a CSV file")
    
    try:
        content = await file.read()
        file_size = len(content)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
        
        try:
            df = pd.read_csv(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid CSV: {str(e)}")
        
        if len(df) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV is empty")
        
        # Priority columns
        feedback_column = None
        priority_columns = ['description', 'feedback', 'summary', 'subject', 'content', 'text', 'comment', 'message']
        for priority_col in priority_columns:
            for col in df.columns:
                if col.lower().strip() == priority_col:
                    feedback_column = col
                    break
            if feedback_column: break
        
        if not feedback_column:
            for col in df.columns:
                if df[col].dtype == 'object':
                    sample_text = df[col].dropna().iloc[0] if len(df[col].dropna()) > 0 else ""
                    if len(str(sample_text)) > 10:
                        feedback_column = col
                        break
        
        if not feedback_column:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No feedback text column found")
        
        # Create Upload record
        upload = Upload(
            user_id=current_user.id,
            filename=file.filename,
            file_size_bytes=file_size,
            row_count=len(df),
            status="completed"
        )
        db.add(upload)
        db.flush()
        
        feedback_count = 0
        for index, row in df.iterrows():
            feedback_text = row[feedback_column]
            if pd.isna(feedback_text) or str(feedback_text).strip() == "": continue
            
            metadata = {col: str(row[col]) for col in df.columns if col != feedback_column and not pd.isna(row[col])}
            source = metadata.get('source') or metadata.get('Source')
            
            feedback_entry = FeedbackEntry(
                upload_id=upload.id,
                content=str(feedback_text).strip(),
                source=source,
                metadata_json=metadata
            )
            db.add(feedback_entry)
            feedback_count += 1
        
        upload.row_count = feedback_count
        db.commit()
        
        # Trigger AI analysis as Background Task
        background_tasks.add_task(run_ai_analysis, str(upload.id), SessionLocal)
        
        return {
            "upload_id": str(upload.id),
            "filename": upload.filename,
            "row_count": feedback_count,
            "status": "completed",
            "message": "Upload successful. AI analysis is running in the background."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
