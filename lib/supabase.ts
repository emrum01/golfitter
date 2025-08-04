import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  name: string
  height: number
  weight: number
  arm_length: number
  strength_level: number
  current_score: number
  target_score: number
  experience_years: number
  budget: number
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface ProGolfer {
  id: string
  name: string
  height: number
  weight: number
  arm_length: number
  strength_level: number
  image_url: string
  swing_video_url: string
  club_set: {
    driver: string
    irons: string
    wedges: string
    putter: string
  }
  achievements: string[]
  created_at: string
}
