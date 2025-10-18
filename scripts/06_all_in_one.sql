-- =============================================================================
-- Script: 06_all_in_one.sql
-- Description: Complete database setup - combines all scripts into one
-- =============================================================================
-- This script includes:
--   - Database setup (tables, enums, indexes)
--   - Functions and triggers
--   - Row level security policies
--   - Storage buckets and policies
--   - Database views
-- =============================================================================


-- =============================================================================
-- PART 1: DATABASE SETUP
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================
-- User roles enum
CREATE TYPE public.user_role AS ENUM ('user', 'moderator', 'admin');

-- User status enum
CREATE TYPE public.user_status AS ENUM ('active', 'banned', 'pending', 'inactive');

-- =============================================================================
-- TABLES
-- =============================================================================
-- Profiles table - stores user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  status public.user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts table - stores user posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Likes table - stores post likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================
-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);


-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- PART 2: FUNCTIONS AND TRIGGERS
-- =============================================================================

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- AUTO-UPDATE TIMESTAMP
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for tables with updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.posts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- GET USER ROLE (BYPASSES RLS)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id LIMIT 1);
END;
$$;


-- =============================================================================
-- PART 3: ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- =============================================================================
-- PROFILES POLICIES
-- =============================================================================

-- Anyone can view all profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- =============================================================================
-- POSTS POLICIES
-- =============================================================================

-- Anyone can view all posts
CREATE POLICY "posts_select_all" ON public.posts FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- LIKES POLICIES
-- =============================================================================

-- Anyone can view all likes
CREATE POLICY "likes_select_all" ON public.likes FOR SELECT USING (true);

-- Authenticated users can create likes
CREATE POLICY "likes_insert_own" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "likes_delete_own" ON public.likes FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- ADMIN AND MODERATOR POLICIES
-- =============================================================================

-- Admins can manage all profiles
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Mods can manage all posts
CREATE POLICY "posts_mod_all" ON public.posts FOR ALL USING (
  public.get_user_role(auth.uid()) IN ('moderator', 'admin')
);


-- =============================================================================
-- PART 4: STORAGE BUCKETS AND POLICIES
-- =============================================================================

-- =============================================================================
-- CREATE BUCKETS
-- =============================================================================

-- Posts images bucket (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true) ON CONFLICT (id) DO NOTHING;

-- Profile pictures bucket (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_pictures', 'profile_pictures', true) ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- POSTS STORAGE POLICIES
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
-- PROFILE PICTURES STORAGE POLICIES
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


-- =============================================================================
-- PART 5: DATABASE VIEWS
-- =============================================================================

-- =============================================================================
-- POSTS VIEW WITH DETAILS
-- =============================================================================
CREATE OR REPLACE VIEW public.posts_with_details AS
SELECT 
  p.*,
  jsonb_build_object(
    'id', pr.id,
    'username', pr.username,
    'first_name', pr.first_name,
    'last_name', pr.last_name,
    'avatar_url', pr.avatar_url,
    'bio', pr.bio
  ) AS author,
  (SELECT COUNT(*) FROM public.likes WHERE post_id = p.id) AS like_count,
  EXISTS (SELECT 1 FROM public.likes WHERE post_id = p.id AND user_id = auth.uid()) AS is_liked
FROM public.posts p
JOIN public.profiles pr ON p.user_id = pr.id;

-- Grant access to the view
GRANT SELECT ON public.posts_with_details TO authenticated;
GRANT SELECT ON public.posts_with_details TO anon;


-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================

