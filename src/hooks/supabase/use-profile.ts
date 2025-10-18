import {
  countProfiles,
  fetchProfile,
  fetchProfiles,
  searchProfiles,
  updateProfile,
  updateUserRole,
  updateUserStatus,
} from "@/lib/api/client/profiles";
import type {
  BaseProfile,
  Profile,
  UserRoleType,
  UserStatusType,
} from "@/types/database/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });
}

export function useProfiles(limit = 20, offset = 0) {
  return useQuery<Profile[]>({
    queryKey: ["profiles", limit, offset],
    queryFn: () => fetchProfiles(limit, offset),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useProfilesCount() {
  return useQuery<number>({
    queryKey: ["profiles-count"],
    queryFn: countProfiles,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useSearchProfiles(query: string, enabled = true) {
  return useQuery<Profile[]>({
    queryKey: ["profiles-search", query],
    queryFn: () => searchProfiles(query),
    enabled: enabled && query.length > 0,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<BaseProfile>;
    }) => updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRoleType }) =>
      updateUserRole(userId, role),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profiles-count"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user role"
      );
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: UserStatusType;
    }) => updateUserStatus(userId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status"
      );
    },
  });
}
