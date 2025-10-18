import { createClient } from "@/lib/supabase/client";

export async function likePost(postId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("likes").insert({
    user_id: user.id,
    post_id: postId,
  });

  if (error) throw error;
}

export async function unlikePost(postId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", user.id)
    .eq("post_id", postId);

  if (error) throw error;
}
