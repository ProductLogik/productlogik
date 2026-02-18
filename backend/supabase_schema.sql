-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table
-- Stores user credentials and profile info.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    company_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USAGE_QUOTAS Table
-- Tracks usage limits for the "Pricing" page logic.
CREATE TABLE IF NOT EXISTS public.usage_quotas (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    plan_tier TEXT DEFAULT 'demo' CHECK (plan_tier IN ('demo', 'pro', 'team', 'enterprise')),
    analyses_limit INTEGER DEFAULT 5,
    analyses_used INTEGER DEFAULT 0,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + interval '1 month')
);

-- 3. UPLOADS Table
-- Represents a dataset uploaded by a user (e.g., a CSV file).
CREATE TABLE IF NOT EXISTS public.uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size_bytes BIGINT,
    row_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FEEDBACK_ENTRIES Table
-- Stores the individual rows of feedback for drill-down and traceability.
CREATE TABLE IF NOT EXISTS public.feedback_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- The main feedback text
    source TEXT,           -- e.g., "Jira", "Zendesk", "CSV"
    sentiment_score FLOAT, -- Optional pre-calc
    metadata JSONB,        -- Store extra columns dynamically
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ANALYSIS_RESULTS Table
-- Stores the AI-generated insights linked to an upload.
CREATE TABLE IF NOT EXISTS public.analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID UNIQUE NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    
    -- AI Output Storage (JSONB for flexibility)
    themes_json JSONB,       -- List of identified themes
    agile_risks_json JSONB,  -- Detected anti-patterns
    executive_summary TEXT,  -- High-level overview
    
    confidence_score FLOAT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_upload_id ON public.feedback_entries(upload_id);
CREATE INDEX IF NOT EXISTS idx_analysis_upload_id ON public.analysis_results(upload_id);

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
