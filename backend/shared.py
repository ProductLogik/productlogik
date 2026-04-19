from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Upload, AnalysisResult

router = APIRouter()


@router.get("/public/analysis/{upload_id}")
async def get_public_analysis(upload_id: str, db: Session = Depends(get_db)):
    """
    Public read-only endpoint. No authentication required.
    The upload_id UUID itself acts as the secret — cryptographically random, not guessable.
    """
    upload = db.query(Upload).filter(Upload.id == upload_id).first()
    if not upload:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

    analysis = db.query(AnalysisResult).filter(AnalysisResult.upload_id == upload_id).first()
    if not analysis or not analysis.themes_json or len(analysis.themes_json) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis results are not available for this link")

    return {
        "upload_id": upload_id,
        "filename": upload.filename,
        "row_count": upload.row_count,
        "themes": analysis.themes_json,
        "executive_summary": analysis.executive_summary,
        "confidence_score": analysis.confidence_score,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
    }
