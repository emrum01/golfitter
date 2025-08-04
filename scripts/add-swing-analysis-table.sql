-- Create swing_analysis table for storing analysis results
CREATE TABLE IF NOT EXISTS swing_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_url TEXT,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    tempo_score INTEGER CHECK (tempo_score >= 0 AND tempo_score <= 100),
    posture_score INTEGER CHECK (posture_score >= 0 AND posture_score <= 100),
    balance_score INTEGER CHECK (balance_score >= 0 AND balance_score <= 100),
    club_path_score INTEGER CHECK (club_path_score >= 0 AND club_path_score <= 100),
    analysis_data JSONB, -- Store detailed analysis results
    improvements TEXT[],
    strengths TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_swing_analysis_user_id ON swing_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_swing_analysis_created_at ON swing_analysis(created_at DESC);
