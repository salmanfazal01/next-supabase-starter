"use client";

import {
  createPost,
  deletePost,
  fetchAllPosts,
  fetchMyPosts,
  fetchMyPostsCount,
  fetchPosts,
  fetchPostsCount,
  fetchUserPosts,
  updatePost,
  updatePostStatus,
} from "@/lib/api/client/posts";
import type { PostStatusType } from "@/types/database/posts";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
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

export function useUserPosts(limit = 12) {
  return useInfiniteQuery({
    queryKey: ["user-posts", limit],
    queryFn: ({ pageParam = 0 }) => {
      return fetchUserPosts(pageParam, limit);
    },
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
      status,
    }: {
      caption: string;
      imageFile: File;
      status?: PostStatusType;
    }) => createPost(caption, imageFile, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-count"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts-count"] });
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
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-count"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts-count"] });
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
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Post updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
      );
    },
  });
}

export function useAllPosts(limit: number, offset: number) {
  return useQuery({
    queryKey: ["all-posts", limit, offset],
    queryFn: () => fetchAllPosts(limit, offset),
  });
}

export function usePostsCount() {
  return useQuery({
    queryKey: ["posts-count"],
    queryFn: fetchPostsCount,
  });
}

export function useUpdatePostStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      status,
    }: {
      postId: string;
      status: PostStatusType;
    }) => updatePostStatus(postId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts-count"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts-count"] });
      toast.success("Post status updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post status"
      );
    },
  });
}

export function useMyPosts(limit: number, offset: number) {
  return useQuery({
    queryKey: ["my-posts", limit, offset],
    queryFn: () => fetchMyPosts(limit, offset),
  });
}

export function useMyPostsCount() {
  return useQuery({
    queryKey: ["my-posts-count"],
    queryFn: fetchMyPostsCount,
  });
}
