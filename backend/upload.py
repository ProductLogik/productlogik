from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlalchemy.orm import Session
import pandas as pd
import io
from datetime import datetime

from database import get_db
from models import Upload, FeedbackEntry, User
from auth import get_current_user

router = APIRouter()

# Maximum file size: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
MAX_ROWS = 10000

@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a CSV file containing feedback data.
    
    - Validates file type and size
    - Parses CSV and extracts feedback text
    - Stores upload metadata and feedback entries in database
    - Returns upload ID for tracking
    """
    
    # Validate file extension
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a CSV file"
        )
    
    try:
        # Read file content
        content = await file.read()
        file_size = len(content)
        
        # Validate file size
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds {MAX_FILE_SIZE / (1024*1024)}MB limit"
            )
        
        # Parse CSV
        try:
            df = pd.read_csv(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid CSV format: {str(e)}"
            )
        
        # Validate row count
        if len(df) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV file is empty"
            )
        
        if len(df) > MAX_ROWS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {MAX_ROWS} rows allowed. Your file has {len(df)} rows."
            )
        
        # Find feedback text column
        # Priority: Description > Feedback > Summary > Subject > first text column
        feedback_column = None
        priority_columns = ['description', 'feedback', 'summary', 'subject', 'content', 'text', 'comment', 'message']
        
        # First, try priority columns (case-insensitive)
        for priority_col in priority_columns:
            for col in df.columns:
                if col.lower().strip() == priority_col:
                    feedback_column = col
                    break
            if feedback_column:
                break
        
        # If no priority column found, find first text column
        if not feedback_column:
            for col in df.columns:
                if df[col].dtype == 'object':  # String column
                    # Check if column has substantial text (not just IDs or short codes)
                    sample_text = df[col].dropna().iloc[0] if len(df[col].dropna()) > 0 else ""
                    if len(str(sample_text)) > 10:  # At least 10 characters
                        feedback_column = col
                        break
        
        if not feedback_column:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No feedback text column found in CSV. Please ensure your CSV contains a column with feedback text."
            )
        
        # Create Upload record
        upload = Upload(
            user_id=current_user.id,
            filename=file.filename,
            file_size_bytes=file_size,
            row_count=len(df),
            status="processing"
        )
        db.add(upload)
        db.flush()  # Get upload ID without committing
        
        # Extract and store feedback entries
        feedback_count = 0
        for index, row in df.iterrows():
            feedback_text = row[feedback_column]
            
            # Skip empty feedback
            if pd.isna(feedback_text) or str(feedback_text).strip() == "":
                continue
            
            # Extract metadata from other columns
            metadata = {}
            source = None
            
            for col in df.columns:
                if col != feedback_column:
                    value = row[col]
                    if not pd.isna(value):
                        # Check if this is a source column
                        if col.lower() in ['source', 'category', 'type', 'issue type']:
                            source = str(value)
                        metadata[col] = str(value)
            
            # Create feedback entry
            feedback_entry = FeedbackEntry(
                upload_id=upload.id,
                content=str(feedback_text).strip(),
                source=source,
                metadata_json=metadata if metadata else None
            )
            db.add(feedback_entry)
            feedback_count += 1
        
        # Update upload status
        upload.status = "completed"
        upload.row_count = feedback_count
        
        db.commit()
        db.refresh(upload)
        
        # Trigger AI analysis
        analysis_status = "completed"
        analysis_error = None
        
        try:
            from services.ai_service import ai_service
            from models import AnalysisResult
            
            # Get all feedback entries for this upload
            feedback_entries = db.query(FeedbackEntry).filter(
                FeedbackEntry.upload_id == upload.id
            ).all()
            
            # Convert to dict format for AI service
            feedback_data = [
                {
                    "content": entry.content,
                    "source": entry.source,
                    "metadata": entry.metadata_json
                }
                for entry in feedback_entries
            ]
            
            # Run AI analysis
            analysis_result = await ai_service.analyze_feedback(feedback_data, str(upload.id))
            
            # Check if analysis actually succeeded or returned an error
            if analysis_result.get('error'):
                # AI analysis failed
                analysis_status = "analysis_failed"
                analysis_error = analysis_result.get('error')
                print(f"❌ AI analysis failed: {analysis_error}")
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
                db.commit()
                print(f"✅ AI analysis completed using {analysis_result.get('model_used')}")
            
        except Exception as e:
            # Log error and mark analysis as failed
            analysis_status = "analysis_failed"
            analysis_error = str(e)
            print(f"❌ AI analysis exception: {analysis_error}")
        
        return {
            "upload_id": str(upload.id),
            "filename": upload.filename,
            "row_count": feedback_count,
            "status": upload.status,
            "analysis_status": analysis_status,
            "analysis_error": analysis_error,
            "message": f"Successfully uploaded {feedback_count} feedback entries. " + 
                      (f"AI analysis completed." if analysis_status == "completed" 
                       else f"AI analysis failed: {analysis_error}")
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Mark upload as failed if it was created
        if 'upload' in locals():
            upload.status = "failed"
            upload.error_message = str(e)
            db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )
