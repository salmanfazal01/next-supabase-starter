"use client";

import { Button } from "@/components/ui/button";
import {
  profileFormSchema,
  type ProfileFormData,
} from "@/types/forms/profile-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import HeaderSection from "./header-section";
import OtherSection from "./other-section";

interface ProfileFormProps {
  profile: ProfileFormData;
  handleSubmit: (data: ProfileFormData) => void;
  loading: boolean;
  disabled: boolean;
}

const ProfileForm = ({
  profile,
  handleSubmit,
  loading,
  disabled,
}: ProfileFormProps) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
    },
  });

  // Reset form when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile, form]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    handleSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header section with avatar and stats */}
        <HeaderSection />

        {/* Form fields section */}
        <OtherSection />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!form.formState.isDirty || loading || disabled}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfileForm;
