import { createClient } from "@/lib/supabase/client";
import type { PostWithDetails } from "@/types/database/posts";

export async function createPost(caption: string, imageFile: File) {
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
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data || [];
}
