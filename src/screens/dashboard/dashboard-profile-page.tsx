"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import ProfileForm from "@/components/forms/profile-form";
import { useAuth } from "@/context/auth-context";
import { useUpdateProfile } from "@/hooks/supabase/use-profile";
import { ProfileFormData } from "@/types/forms/profile-form-types";
import React from "react";

const DashboardProfilePage = () => {
  const profile = useAuth((state) => state.profile);
  const mounted = useAuth((state) => state.mounted);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const handleSubmit = async (data: ProfileFormData) => {
    await updateProfile({
      updates: {
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        // avatar_url: data.avatar_url,
      },
    });
  };

  if (!mounted || !profile) return null;

  return (
    <div className="flex flex-col gap-4 flex-1 container mx-auto">
      <DashboardHeader
        title="Profile"
        description="Manage your personal information"
      />

      <ProfileForm
        profile={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        }}
        handleSubmit={handleSubmit}
        loading={isPending}
        disabled={isPending}
      />
    </div>
  );
};

export default DashboardProfilePage;
