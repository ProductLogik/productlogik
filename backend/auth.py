import logging
import os
logging.info("DEBUG: Loading auth.py module")
# logging.basicConfig is already called in main but safe to call again or rely on existing handlers if shared
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
import bcrypt

from database import get_db
from models import User, UsageQuota
from pydantic import BaseModel, EmailStr

# --- Config ---
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    logging.error("❌ CRITICAL: SECRET_KEY not found in environment variables! JWT security is compromised.")
    SECRET_KEY = "unsafe-default-development-only-key"
else:
    logging.info("✅ SECRET_KEY loaded from environment variables")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

router = APIRouter()

# --- Pydantic Models ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    company_name: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    company_name: str | None = None

# --- Password Hashing ---
def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# --- JWT Token ---
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# --- Routes ---

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Validate Password Strength
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    # Validate Email Format
    if "@" not in user.email or "." not in user.email:
        raise HTTPException(status_code=400, detail="Please enter a valid email address")

    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="This email is already registered. Please log in.")

    try:
        # Create new user
        import secrets
        verification_token = secrets.token_urlsafe(32)
        
        hashed_password = get_password_hash(user.password)
        new_user = User(
            email=user.email,
            password_hash=hashed_password,
            full_name=user.full_name,
            company_name=user.company_name,
            email_verified=False,
            verification_token=verification_token
        )
        db.add(new_user)
        # Flush to get ID but don't commit yet until email sends? 
        # Actually email service sends email. If it fails we want to rollback.
        # But we need to commit to resolve relationships?
        # We can flush.
        db.flush()

        if pending_invites:
            for invite in pending_invites:
                invite.shared_with_user_id = new_user.id
                invite.invited_email = None  # Clear pending email
            logging.info(f"✅ Activated {len(pending_invites)} pending invite(s) for {user.email}")

        # Create UsageQuota record
        usage_quota = UsageQuota(
            user_id=new_user.id,
            plan_tier="demo",
            analyses_limit=3,
            analyses_used=0
        )
        db.add(usage_quota)

        # Send verification email
        logging.info(f"DEBUG: Attempting to send verification email to {new_user.email}")
        from services.email_service import email_service
        sent = email_service.send_verification_email(
            to_email=new_user.email,
            to_name=new_user.full_name or new_user.email,
            verification_token=verification_token
        )
        logging.info(f"DEBUG: Email sent result: {sent}")
        
        if not sent:
            # Email failed, rollback everything
            # db.rollback()
            # raise HTTPException(status_code=500, detail="Failed to send verification email. Please try again later.")
            logging.warning("⚠️ Email failed to send, but creating user anyway for debugging")

        # If email sent successfully, commit
        db.commit()
        db.refresh(new_user)

        # Return success message (no token until verified)
        return {
            "message": "Account created! Please check your email to verify your account.",
            "email": new_user.email,
            "verification_required": True
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logging.error(f"❌ Registration error: {e}")
        import traceback
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if email is verified
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in. Check your inbox for the verification link.",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user profile
@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "company_name": current_user.company_name,
        "role": current_user.role,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "usage_quota": {
            "plan_tier": current_user.usage_quota.plan_tier if current_user.usage_quota else "demo",
            "analyses_limit": current_user.usage_quota.analyses_limit if current_user.usage_quota else 3,
            "analyses_used": current_user.usage_quota.analyses_used if current_user.usage_quota else 0
        }
    }

# Update user profile
@router.patch("/me")
def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's profile information"""
    # Update fields if provided
    if profile_update.full_name is not None:
        current_user.full_name = profile_update.full_name
    if profile_update.company_name is not None:
        current_user.company_name = profile_update.company_name
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "company_name": current_user.company_name,
        "role": current_user.role,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user's email address with verification token"""
    # Find user with this verification token
    user = db.query(User).filter(User.verification_token == token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link"
        )
    
    if user.email_verified:
        return {
            "message": "Email already verified. You can log in now.",
            "already_verified": True
        }
    
    # Mark email as verified
    user.email_verified = True
    # user.verification_token = None  # Clear token after use - DISABLED to allow idempotent verification (React double-fetch)
    db.commit()
    
    return {
        "message": "Email verified successfully! You can now log in.",
        "email": user.email,
        "verified": True
    }
