-- =============================================================================
-- Script: 00_teardown.sql
-- Description: Removes ALL database objects, storage, and auth users
-- =============================================================================
-- ⚠️  WARNING: This script will DELETE EVERYTHING! 
-- ⚠️  Use only for development/testing environments
-- ⚠️  All data will be permanently lost
-- =============================================================================


-- =============================================================================
-- DROP VIEWS
-- =============================================================================

DROP VIEW IF EXISTS public.posts_with_details CASCADE;


-- =============================================================================
-- DROP TRIGGERS
-- =============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_updated_at ON public.posts;


-- =============================================================================
-- DROP STORAGE POLICIES
-- =============================================================================

-- Drop all policies on storage.objects
DROP POLICY IF EXISTS "posts_select_all" ON storage.objects;
DROP POLICY IF EXISTS "posts_manage_own" ON storage.objects;
DROP POLICY IF EXISTS "posts_admin_moderator_all" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_select_all" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_manage_own" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_admin_moderator_all" ON storage.objects;


-- =============================================================================
-- DELETE STORAGE BUCKETS
-- =============================================================================

DELETE FROM storage.buckets WHERE id = 'posts';
DELETE FROM storage.buckets WHERE id = 'profile_pictures';


-- =============================================================================
-- DROP RLS POLICIES
-- =============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Posts policies
DROP POLICY IF EXISTS "posts_select_all" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_own" ON public.posts;
DROP POLICY IF EXISTS "posts_update_own" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;
DROP POLICY IF EXISTS "posts_mod_all" ON public.posts;

-- Likes policies
DROP POLICY IF EXISTS "likes_select_all" ON public.likes;
DROP POLICY IF EXISTS "likes_insert_own" ON public.likes;
DROP POLICY IF EXISTS "likes_delete_own" ON public.likes;


-- =============================================================================
-- DROP TABLES
-- =============================================================================

DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- =============================================================================
-- DROP FUNCTIONS
-- =============================================================================

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID) CASCADE;


-- =============================================================================
-- DROP TYPES/ENUMS
-- =============================================================================

DROP TYPE IF EXISTS public.user_role CASCADE;


-- =============================================================================
-- DELETE ALL AUTH USERS
-- =============================================================================

-- ⚠️  WARNING: This will delete ALL authenticated users!
-- Uncomment the line below if you want to delete all users
-- DELETE FROM auth.users;


-- =============================================================================
-- TEARDOWN COMPLETE
-- =============================================================================
-- All database objects have been removed
-- Note: Auth users are NOT deleted by default (uncomment line above to delete)
-- =============================================================================

