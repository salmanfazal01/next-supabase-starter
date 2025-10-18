import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  UserRoleEnum,
  type BaseProfile,
  type Profile,
  type UserRoleType,
  type UserStatusType,
} from "@/types/database/profile";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  return data;
}

export async function fetchProfiles(
  limit = 20,
  offset = 0
): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function countProfiles(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count || 0;
}

export async function updateProfile(
  userId: string,
  updates: Partial<BaseProfile>
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: UserRoleType) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if current user is admin
  const profile = await fetchProfile(user.id);
  if (profile?.role !== UserRoleEnum.ADMIN) {
    throw new Error("Only admins can update user roles");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStatus(userId: string, status: UserStatusType) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if current user is admin
  const profile = await fetchProfile(user.id);
  if (profile?.role !== UserRoleEnum.ADMIN) {
    throw new Error("Only admins can update user status");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function searchProfiles(
  query: string,
  limit = 10
): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(limit);

  if (error) throw error;
  return data || [];
}
