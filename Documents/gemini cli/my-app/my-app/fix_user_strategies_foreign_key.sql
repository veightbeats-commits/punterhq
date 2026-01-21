-- Fix user_strategies foreign key to reference profiles instead of auth.users
-- This fixes the relationship error in the enhanced-strategies API endpoint

-- First, drop the existing foreign key constraint
ALTER TABLE user_strategies DROP CONSTRAINT IF EXISTS user_strategies_user_id_fkey;

-- Add the correct foreign key constraint to profiles
ALTER TABLE user_strategies 
ADD CONSTRAINT user_strategies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;