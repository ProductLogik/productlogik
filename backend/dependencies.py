from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, UsageQuota
from auth import get_current_user
from datetime import datetime

async def check_upload_quota(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to check if the user has remaining upload quota.
    Returns the user if allowed, raises 429 if limit reached.
    """
    quota = current_user.usage_quota
    
    # 1. Ensure Quota Record Exists
    if not quota:
        # Default to Demo if no record found (Safe fallback)
        quota = UsageQuota(user_id=current_user.id, plan_tier="demo", analyses_limit=3, analyses_used=0)
        db.add(quota)
        db.commit()
        db.refresh(quota)
        # Reload user to ensure relationship is populated
        db.refresh(current_user)
    
    # 2. Check Limit
    # Assuming -1 or very large number means unlimited
    if quota.analyses_limit != -1 and quota.analyses_used >= quota.analyses_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Monthly upload limit reached ({quota.analyses_used}/{quota.analyses_limit}). Upgrade to Pro for more."
        )
        
    return current_user

def increment_usage(user: User, db: Session):
    """
    Increments the usage user usage count.
    Should be called AFTER successful analysis.
    """
    if user.usage_quota:
        user.usage_quota.analyses_used += 1
        user.usage_quota.updated_at = datetime.now() # if updated_at existed, but it doesn't on UsageQuota, so just commit
        db.commit()
