-- Migration Query: Add new fields to existing tables
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS birth_year integer,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean default false;

-- 2. Add bio column to academic_profiles and ensure user_id is unique
ALTER TABLE public.academic_profiles 
ADD COLUMN IF NOT EXISTS bio text;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'academic_profiles_user_id_key'
    ) THEN
        ALTER TABLE public.academic_profiles 
        ADD CONSTRAINT academic_profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 3. Optional: Update existing users to have onboarding_completed = true if they have academic_profiles
UPDATE public.profiles p
SET onboarding_completed = true
WHERE EXISTS (
    SELECT 1 FROM public.academic_profiles ap 
    WHERE ap.user_id = p.id
);
