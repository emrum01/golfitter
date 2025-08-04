-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    arm_length INTEGER NOT NULL,
    strength_level INTEGER CHECK (strength_level >= 1 AND strength_level <= 5),
    current_score INTEGER,
    target_score INTEGER,
    experience_years INTEGER,
    budget INTEGER,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pro_golfers table
CREATE TABLE IF NOT EXISTS pro_golfers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    arm_length INTEGER NOT NULL,
    strength_level INTEGER CHECK (strength_level >= 1 AND strength_level <= 5),
    image_url TEXT,
    swing_video_url TEXT,
    club_set JSONB,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample pro golfer data
INSERT INTO pro_golfers (name, height, weight, arm_length, strength_level, image_url, swing_video_url, club_set, achievements) VALUES
('田中 太郎', 175, 70, 85, 4, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=300&width=400', 
 '{"driver": "TaylorMade SIM2 Driver", "irons": "Titleist T100 Irons", "wedges": "Vokey SM9 Wedges", "putter": "Scotty Cameron Newport"}',
 ARRAY['PGAツアー優勝3回', '日本オープン優勝', '平均スコア68.5']),
('佐藤 花子', 165, 58, 78, 3, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=300&width=400',
 '{"driver": "Callaway Epic Speed Driver", "irons": "Mizuno JPX921 Irons", "wedges": "Cleveland RTX ZipCore", "putter": "Odyssey White Hot"}',
 ARRAY['LPGA優勝5回', 'メジャー準優勝', '平均スコア70.2']),
('山田 次郎', 180, 85, 90, 5, '/placeholder.svg?height=200&width=200', '/placeholder.svg?height=300&width=400',
 '{"driver": "Ping G425 LST Driver", "irons": "PXG 0311 T Irons", "wedges": "Titleist Vokey SM8", "putter": "TaylorMade Spider X"}',
 ARRAY['飛距離平均320ヤード', 'PGAツアー優勝1回', '平均スコア69.8']);
