"use client";

import FormImageUpload from "@/components/formFields/form-image-upload";
import FormTextareaField from "@/components/formFields/form-textarea-field";
import { Button } from "@/components/ui/button";
import {
  CreatePostFormType,
  createPostSchema,
} from "@/types/forms/post-form-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

interface CreatePostFormProps {
  loading?: boolean;
  disabled?: boolean;
  handleSubmit: (data: CreatePostFormType) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  loading = false,
  disabled = false,
  handleSubmit,
}) => {
  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: "",
      image: [],
    },
  });

  const onSubmit = (data: CreatePostFormType) => {
    handleSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormImageUpload
          name="image"
          disabled={disabled || loading}
          maxFiles={1}
          maxSize={5 * 1024 * 1024} // 5MB
          gridCols="3"
          multiple={false}
        />

        <FormTextareaField
          name="caption"
          placeholder="Write a caption..."
          disabled={disabled || loading}
          rows={3}
        />

        <Button type="submit" disabled={disabled || loading} className="w-full">
          {loading ? "Creating post..." : "Create Post"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default CreatePostForm;
