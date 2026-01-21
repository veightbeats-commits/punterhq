-- By default, RLS is enabled on new tables.
-- You need to create a policy to allow access to the table.
-- This policy allows everyone to read the posts table.
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."posts";
CREATE POLICY "Enable read access for all users" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- This policy allows authenticated users to insert, update and delete their own posts
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."posts";
CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Enable update for users based on user_id" ON "public"."posts";
CREATE POLICY "Enable update for users based on user_id" ON "public"."posts"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."posts";
CREATE POLICY "Enable delete for users based on user_id" ON "public"."posts"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.uid() = user_id);