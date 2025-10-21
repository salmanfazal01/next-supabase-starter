-- =============================================================================
-- Script: 03_rls.sql
-- Description: Enables row level security for all tables
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

-- Authenticated users can create posts (regular users can only set published/hidden status)
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT WITH CHECK (
  auth.uid() = user_id AND (
    public.get_user_role(auth.uid()) IN ('moderator', 'admin') OR
    status IN ('published', 'hidden')
  )
);

-- Users can update their own posts
-- Regular users can only change status to 'published' or 'hidden'
-- Admins/moderators can set any status
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND (
      public.get_user_role(auth.uid()) IN ('moderator', 'admin') OR
      status IN ('published', 'hidden')
    )
  );

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