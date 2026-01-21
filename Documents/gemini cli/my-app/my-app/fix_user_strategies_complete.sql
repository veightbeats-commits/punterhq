-- Fix user_strategies foreign key to reference profiles instead of auth.users
-- This fixes the relationship error in the enhanced-strategies API endpoint

-- First, drop the existing foreign key constraint
ALTER TABLE user_strategies DROP CONSTRAINT IF EXISTS user_strategies_user_id_fkey;

-- Add the correct foreign key constraint to profiles
ALTER TABLE user_strategies 
ADD CONSTRAINT user_strategies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update RLS policies to work with the new relationship
DROP POLICY IF EXISTS "Users can insert their own strategies" ON user_strategies;
DROP POLICY IF EXISTS "Anyone can view public strategies" ON user_strategies;
DROP POLICY IF EXISTS "Users can update their own strategies" ON user_strategies;
DROP POLICY IF EXISTS "Users can delete their own strategies" ON user_strategies;

-- Recreate policies with the correct relationship
CREATE POLICY "Users can insert their own strategies" ON user_strategies 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view public strategies" ON user_strategies 
FOR SELECT USING (public = true);

CREATE POLICY "Users can update their own strategies" ON user_strategies 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies" ON user_strategies 
FOR DELETE USING (auth.uid() = user_id);