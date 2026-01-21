DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
CREATE POLICY "Enable insert for authenticated users only" ON storage.objects
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'post-images' );

-- Allow all uploads for post-images (bypass authentication)
DROP POLICY IF EXISTS "Enable all uploads for post-images" ON storage.objects;
CREATE POLICY "Enable all uploads for post-images" ON storage.objects
AS PERMISSIVE FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'post-images' );

DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
CREATE POLICY "Enable read access for all users" ON storage.objects
AS PERMISSIVE FOR SELECT
TO public
USING ( bucket_id = 'post-images' );
