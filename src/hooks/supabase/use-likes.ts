"use client";

import { likePost, unlikePost } from "@/lib/api/client/likes";
import type { PostWithDetails } from "@/types/database/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: PostWithDetails[]) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    like_count: post.like_count + 1,
                    is_liked: true,
                  }
                : post
            )
          ),
        };
      });

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to like post"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: PostWithDetails[]) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    like_count: Math.max(0, post.like_count - 1),
                    is_liked: false,
                  }
                : post
            )
          ),
        };
      });

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to unlike post"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
