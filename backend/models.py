from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Float, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    company_name = Column(String)
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    uploads = relationship("Upload", back_populates="user", cascade="all, delete-orphan")
    usage_quota = relationship("UsageQuota", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UsageQuota(Base):
    __tablename__ = "usage_quotas"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    plan_tier = Column(String, default="free")
    analyses_limit = Column(Integer, default=5)
    analyses_used = Column(Integer, default=0)
    reset_date = Column(DateTime(timezone=True), default=func.now())

    user = relationship("User", back_populates="usage_quota")

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_size_bytes = Column(BigInteger)
    row_count = Column(Integer, default=0)
    status = Column(String, default="pending") # pending, processing, completed, failed
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="uploads")
    feedback_entries = relationship("FeedbackEntry", back_populates="upload", cascade="all, delete-orphan")
    analysis_result = relationship("AnalysisResult", back_populates="upload", uselist=False, cascade="all, delete-orphan")

class FeedbackEntry(Base):
    __tablename__ = "feedback_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String)
    sentiment_score = Column(Float)
    metadata_json = Column(JSONB, name="metadata") # Renamed to avoid reserved word conflict, mapped to "metadata" column
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    upload = relationship("Upload", back_populates="feedback_entries")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    themes_json = Column(JSONB)
    agile_risks_json = Column(JSONB)
    executive_summary = Column(Text)
    
    confidence_score = Column(Float)
    processing_time_ms = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    upload = relationship("Upload", back_populates="analysis_result")
