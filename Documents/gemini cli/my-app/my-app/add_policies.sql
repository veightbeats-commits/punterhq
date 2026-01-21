For user_favorites table:
-- Allow users to insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON user_favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own favorites
CREATE POLICY "Users can select their own favorites" ON user_favorites
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON user_favorites
FOR DELETE USING (auth.uid() = user_id);

For status_card_comments table:
-- Allow authenticated users to insert comments
CREATE POLICY "Users can insert comments" ON status_card_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow anyone to select comments
CREATE POLICY "Anyone can view comments" ON status_card_comments
FOR SELECT USING (true);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" ON status_card_comments
FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
