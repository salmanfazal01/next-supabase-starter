-- =============================================================================
-- Script: 05_views.sql
-- Description: Creates database views for simplified queries
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
