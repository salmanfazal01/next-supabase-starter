"use client";

import DashboardContentCard from "@/components/dashboard/dashboard-content-card";
import FormTextareaField from "@/components/formFields/form-textarea-field";
import FormTextField from "@/components/formFields/form-textfield";

const OtherSection = () => {
  return (
    <DashboardContentCard className="p-2" contentClassName="gap-5">
      {/* Name Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormTextField
          name="first_name"
          placeholder="John"
          label="First Name"
        />

        <FormTextField name="last_name" placeholder="Doe" label="Last Name" />
      </div>

      {/* Bio */}
      <FormTextareaField
        name="bio"
        placeholder="Photography enthusiast 📸 | Travel lover ✈️ | Coffee addict ☕"
        rows={4}
        label="Bio"
      />
    </DashboardContentCard>
  );
};

export default OtherSection;
