"use client";

import {
  createPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "@/lib/api/client/posts";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function usePosts(limit = 10) {
  return useInfiniteQuery({
    queryKey: ["posts", limit],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caption,
      imageFile,
    }: {
      caption: string;
      imageFile: File;
    }) => createPost(caption, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, caption }: { postId: string; caption: string }) =>
      updatePost(postId, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
      );
    },
  });
}
