"use client";
import { usePosts } from "@/hooks/supabase/use-posts";
import { useLikePost, useUnlikePost } from "@/hooks/supabase/use-likes";
import { PostCard } from "./post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const PostsFeed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(10);
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLike = (postId: string) => {
    likePost.mutate(postId);
  };

  const handleUnlike = (postId: string) => {
    unlikePost.mutate(postId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  const posts = data?.pages.flat() || [];

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No posts yet. Be the first to create one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={ref} className="py-4">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-center text-muted-foreground">
            You've reached the end!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostsFeed;
