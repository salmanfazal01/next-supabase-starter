"use client";

import DashboardContentCard from "@/components/dashboard/dashboard-content-card";
import FormImageUpload from "@/components/formFields/form-image-upload";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth-context";
import { getInitials } from "@/utils/helperFunctions";

const HeaderSection = () => {
  const profile = useAuth((state) => state.profile);

  if (!profile) return null;

  const initials = getInitials([profile.first_name, profile.last_name]);
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <DashboardContentCard
      className="overflow-hidden"
      contentClassName="p-0 gap-4"
    >
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />

      {/* Profile Info */}
      <div className="relative flex items-center gap-8 px-6 pb-6 -mt-12">
        <FormImageUpload name="avatar" type="avatar" />

        <div className="space-y-1">
          <Text size="2xl" weight={600}>
            {fullName}
          </Text>

          <Text size="sm" weight={400} className="text-muted-foreground">
            @{profile.username}
          </Text>
        </div>
      </div>
    </DashboardContentCard>
  );
};

export default HeaderSection;
