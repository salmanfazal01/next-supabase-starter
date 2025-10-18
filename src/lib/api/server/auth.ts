import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database/profile";
import type { User } from "@supabase/supabase-js";

export async function getCurrentProfile(
  userId: string
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return profile;
}

export async function getCurrentUser(): Promise<{
  user: User | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const profile = await getCurrentProfile(user.id);

  return { user, profile };
}

export async function getCurrentRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getCurrentProfile(user.id);
  return profile?.role;
}

export async function requireAuth() {
  const { user, profile } = await getCurrentUser();

  if (!user || !profile) {
    throw new Error("Unauthorized");
  }

  return { user, profile };
}
