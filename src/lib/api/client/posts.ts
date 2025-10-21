import { createClient } from "@/lib/supabase/client";
import type { PostStatusType, PostWithDetails } from "@/types/database/posts";

export async function createPost(
  caption: string,
  imageFile: File,
  status: PostStatusType = "published"
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Upload image to user-specific folder
  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("posts")
    .upload(filePath, imageFile);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("posts").getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      image_url: publicUrl,
      caption,
      status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(postId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) throw error;
}

export async function updatePost(postId: string, caption: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("posts")
    .update({ caption })
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPosts(
  page = 0,
  limit = 10
): Promise<PostWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .eq("status", "published") // Only show published posts on homepage
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data || [];
}

export async function fetchUserPosts(
  page = 0,
  limit = 10
): Promise<PostWithDetails[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Users can see all their own posts (including drafts, hidden, etc.)
  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data || [];
}

export async function fetchMyPosts(
  limit: number,
  offset: number
): Promise<PostWithDetails[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function fetchMyPostsCount(): Promise<number> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) throw error;
  return count || 0;
}

export async function fetchAllPosts(
  limit: number,
  offset: number
): Promise<PostWithDetails[]> {
  const supabase = createClient();

  // Admin view - shows all posts regardless of status
  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function fetchPostsCount(): Promise<number> {
  const supabase = createClient();

  // Count all posts (used for admin view)
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
}

export async function updatePostStatus(postId: string, status: PostStatusType) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
