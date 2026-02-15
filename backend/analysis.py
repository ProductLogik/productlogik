from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Upload, AnalysisResult
from database import get_db
from auth import get_current_user
from models import User
from pydantic import BaseModel, EmailStr

router = APIRouter()

class ShareRequest(BaseModel):
    email: EmailStr

@router.get("/analysis/{upload_id}")
async def get_analysis(
    upload_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analysis results for a specific upload.
    
    Requires authentication. User must own the upload or have shared access.
    """
    from models import UploadShare
    from sqlalchemy import or_
    from sqlalchemy.sql import func
    
    # Get the upload
    upload = db.query(Upload).filter(Upload.id == upload_id).first()
    
    if not upload:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found"
        )
    
    # Check if user owns the upload
    is_owner = upload.user_id == current_user.id
    
    # Check if upload is shared with user
    has_shared_access = db.query(UploadShare).filter(
        UploadShare.upload_id == upload_id,
        UploadShare.shared_with_user_id == current_user.id,
        or_(
            UploadShare.expires_at.is_(None),
            UploadShare.expires_at > func.now()
        )
    ).first() is not None
    
    # Deny access if user doesn't own and doesn't have shared access
    if not is_owner and not has_shared_access:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You don't have permission to view this upload."
        )
    
    # Get analysis result
    analysis = db.query(AnalysisResult).filter(
        AnalysisResult.upload_id == upload_id
    ).first()
    
    if not analysis:
        return {
            "upload_id": upload_id,
            "filename": upload.filename,
            "row_count": upload.row_count,
            "status": "pending",
            "message": "Analysis not yet complete or failed. Check upload response for details."
        }
    
    # Check if analysis has actual themes or is an error placeholder
    has_themes = analysis.themes_json and len(analysis.themes_json) > 0
    
    return {
        "upload_id": upload_id,
        "filename": upload.filename,
        "row_count": upload.row_count,
        "status": "completed" if has_themes else "failed",
        "themes": analysis.themes_json,
        "executive_summary": analysis.executive_summary,
        "confidence_score": analysis.confidence_score,
        "processing_time_ms": analysis.processing_time_ms,
        "agile_risks": analysis.agile_risks_json,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
        "has_themes": has_themes
    }

@router.get("/uploads")
async def get_user_uploads(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all uploads for the current user with their analysis status.
    """
    uploads = db.query(Upload).filter(
        Upload.user_id == current_user.id
    ).order_by(Upload.created_at.desc()).limit(50).all()
    
    result = []
    for upload in uploads:
        # Check if analysis exists
        analysis = db.query(AnalysisResult).filter(
            AnalysisResult.upload_id == upload.id
        ).first()
        
        result.append({
            "upload_id": str(upload.id),
            "filename": upload.filename,
            "row_count": upload.row_count,
            "status": upload.status,
            "created_at": upload.created_at.isoformat() if upload.created_at else None,
            "has_analysis": analysis is not None,
            "theme_count": len(analysis.themes_json) if analysis and analysis.themes_json else 0
        })
    
    return {"uploads": result}

@router.post("/uploads/{upload_id}/share")
async def share_upload(
    upload_id: str,
    request: ShareRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Share an upload with another user by email.
    Only the owner can share their uploads.
    """
    from models import UploadShare
    from fastapi import HTTPException, status
    
    share_email = request.email
    
    # Verify upload belongs to current user (owner only can share)
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()
    
    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found or you don't own this upload"
        )
    
    # Can't share with yourself
    if share_email.lower() == current_user.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot share with yourself"
        )
    
    # Check if user exists
    shared_with_user = db.query(User).filter(User.email == share_email).first()
    
    # If user doesn't exist, create a pending invite
    if not shared_with_user:
        # Check if already invited
        existing_share = db.query(UploadShare).filter(
            UploadShare.upload_id == upload_id,
            UploadShare.invited_email == share_email
        ).first()
        
        if existing_share:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Already invited {share_email}"
            )
        
        # Create pending invite
        share = UploadShare(
            upload_id=upload.id,
            owner_id=current_user.id,
            invited_email=share_email,  # Store email for pending invite
            permission_level="view"
        )
        db.add(share)
        db.flush() # Get ID but don't commit yet
        
        # Send invitation email
        from services.email_service import email_service
        email_sent = email_service.send_invitation_email(
            to_email=share_email,
            from_user_name=current_user.full_name or current_user.email,
            upload_filename=upload.filename,
            share_id=str(share.id)
        )
        
        if not email_sent:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send invitation email. Share cancelled."
            )
            
        db.commit()
        db.refresh(share)
        
        return {
            "share_id": str(share.id),
            "upload_id": str(upload.id),
            "filename": upload.filename,
            "invited_email": share_email,
            "status": "pending",
            "permission": share.permission_level,
            "created_at": share.created_at.isoformat() if share.created_at else None,
            "message": f"Invitation sent to {share_email}.",
            "email_sent": True
        }
    
    # User exists - create immediate share
    # Check if already shared
    existing_share = db.query(UploadShare).filter(
        UploadShare.upload_id == upload_id,
        UploadShare.shared_with_user_id == shared_with_user.id
    ).first()
    
    if existing_share:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Already shared with {share_email}"
        )
    
    # Create share
    share = UploadShare(
        upload_id=upload.id,
        owner_id=current_user.id,
        shared_with_user_id=shared_with_user.id,
        permission_level="view"
    )
    db.add(share)
    db.flush() # Flush to check constraints/get ID
    
    # Send notification email
    from services.email_service import email_service
    email_sent = email_service.send_share_notification_email(
        to_email=shared_with_user.email,
        to_name=shared_with_user.full_name or shared_with_user.email,
        from_user_name=current_user.full_name or current_user.email,
        upload_filename=upload.filename,
        upload_id=str(upload.id)
    )
    
    if not email_sent:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send notification email. Share cancelled."
        )
        
    db.commit()
    db.refresh(share)
    
    return {
        "share_id": str(share.id),
        "upload_id": str(upload.id),
        "filename": upload.filename,
        "shared_with_email": share_email,
        "shared_with_name": shared_with_user.full_name,
        "status": "active",
        "permission": share.permission_level,
        "created_at": share.created_at.isoformat() if share.created_at else None,
        "email_sent": True
    }

@router.delete("/uploads/{upload_id}/share/{share_id}")
async def unshare_upload(
    upload_id: str,
    share_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Revoke shared access to an upload.
    Only the owner can revoke shares.
    """
    from models import UploadShare
    from fastapi import HTTPException, status
    
    # Verify upload belongs to current user
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()
    
    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found or you don't own this upload"
        )
    
    # Find and delete share
    share = db.query(UploadShare).filter(
        UploadShare.id == share_id,
        UploadShare.upload_id == upload_id,
        UploadShare.owner_id == current_user.id
    ).first()
    
    if not share:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Share not found"
        )
    
    db.delete(share)
    db.commit()
    
    return {"message": "Share revoked successfully"}

@router.get("/uploads/{upload_id}/shares")
async def get_upload_shares(
    upload_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get list of users an upload is shared with.
    Only the owner can view shares.
    """
    from models import UploadShare
    from fastapi import HTTPException, status
    
    # Verify upload belongs to current user
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()
    
    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found or you don't own this upload"
        )
    
    # Get all shares for this upload
    shares = db.query(UploadShare).filter(
        UploadShare.upload_id == upload_id
    ).all()
    
    result = []
    for share in shares:
        # Check if it's a pending invite or active share
        if share.invited_email:
            # Pending invite
            result.append({
                "share_id": str(share.id),
                "email": share.invited_email,
                "full_name": None,
                "status": "pending",
                "permission": share.permission_level,
                "shared_at": share.created_at.isoformat() if share.created_at else None,
                "expires_at": share.expires_at.isoformat() if share.expires_at else None
            })
        else:
            # Active share
            shared_user = db.query(User).filter(User.id == share.shared_with_user_id).first()
            result.append({
                "share_id": str(share.id),
                "email": shared_user.email if shared_user else "Unknown",
                "full_name": shared_user.full_name if shared_user else "Unknown",
                "status": "active",
                "permission": share.permission_level,
                "shared_at": share.created_at.isoformat() if share.created_at else None,
                "expires_at": share.expires_at.isoformat() if share.expires_at else None
            })
    
    return {"shares": result}

@router.get("/uploads/shared-with-me")
async def get_shared_uploads(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all uploads shared with the current user.
    """
    from models import UploadShare, AnalysisResult
    from sqlalchemy import or_
    
    # Get all shares for current user
    shares = db.query(UploadShare).filter(
        UploadShare.shared_with_user_id == current_user.id,
        or_(
            UploadShare.expires_at.is_(None),
            UploadShare.expires_at > func.now()
        )
    ).all()
    
    result = []
    for share in shares:
        upload = db.query(Upload).filter(Upload.id == share.upload_id).first()
        if not upload:
            continue
            
        owner = db.query(User).filter(User.id == upload.user_id).first()
        analysis = db.query(AnalysisResult).filter(
            AnalysisResult.upload_id == upload.id
        ).first()
        
        result.append({
            "upload_id": str(upload.id),
            "filename": upload.filename,
            "row_count": upload.row_count,
            "owner_email": owner.email if owner else "Unknown",
            "owner_name": owner.full_name if owner else "Unknown",
            "shared_at": share.created_at.isoformat() if share.created_at else None,
            "permission": share.permission_level,
            "has_analysis": analysis is not None,
            "theme_count": len(analysis.themes_json) if analysis and analysis.themes_json else 0
        })
    
    return {"uploads": result}
