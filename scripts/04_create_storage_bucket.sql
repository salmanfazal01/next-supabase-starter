-- =============================================================================
-- Script: 04_create_storage_bucket.sql
-- Description: Creates storage buckets and policies for file uploads
-- =============================================================================

-- =============================================================================
-- CREATE BUCKETS
-- =============================================================================

-- Posts images bucket (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true) ON CONFLICT (id) DO NOTHING;

-- Profile pictures bucket (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_pictures', 'profile_pictures', true) ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- POSTS POLICIES
-- =============================================================================

-- Anyone can view post images
CREATE POLICY "posts_select_all" ON storage.objects FOR SELECT TO public USING (bucket_id = 'posts');

-- Users can manage their own images
CREATE POLICY "posts_manage_own" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins/Moderators can manage all post images
CREATE POLICY "posts_admin_moderator_all" 
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'posts' AND
    public.get_user_role(auth.uid()) IN ('admin', 'moderator')
  );


-- =============================================================================
-- PROFILE PICTURES POLICIES
-- =============================================================================

-- Anyone can view profile pictures
CREATE POLICY "profile_pictures_select_all" ON storage.objects FOR SELECT TO public USING (bucket_id = 'profile_pictures');

-- Users can manage their own profile pictures
CREATE POLICY "profile_pictures_manage_own" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'profile_pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins/Moderators can manage all profile pictures
CREATE POLICY "profile_pictures_admin_moderator_all" 
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'profile_pictures' AND
    public.get_user_role(auth.uid()) IN ('admin', 'moderator')
  );
