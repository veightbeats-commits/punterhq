-- Create status_card_comments table
CREATE TABLE status_card_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status_card_id UUID REFERENCES status_cards(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE status_card_comments ENABLE ROW LEVEL SECURITY;

-- Policies for status_card_comments
CREATE POLICY "Users can insert comments" ON status_card_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON status_card_comments
FOR SELECT USING (true);

CREATE POLICY "Users can delete their own comments" ON status_card_comments
FOR DELETE USING (auth.uid() = user_id);