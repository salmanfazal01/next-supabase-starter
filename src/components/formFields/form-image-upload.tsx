import ImageUploader, {
  type ImageUploaderProps,
} from "@/components/ui/image-uploader";
import AvatarImageUploader, {
  type AvatarImageUploaderProps,
} from "@/components/ui/avatar-image-uploader";
import { cn } from "@/lib/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type BaseFormImageUploadProps = {
  name: string;
  className?: string;
  label?: string;
  description?: string;
};

type FormImageUploadProps =
  | (BaseFormImageUploadProps &
      Omit<ImageUploaderProps, "files" | "onFilesChange"> & {
        type?: "default";
      })
  | (BaseFormImageUploadProps &
      Omit<AvatarImageUploaderProps, "file" | "onFileChange"> & {
        type: "avatar";
      });

const FormImageUpload: React.FC<FormImageUploadProps> = ({
  name,
  className,
  label,
  description,
  type = "default",
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn(type === "avatar" ? "w-fit" : "w-full", className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            {label && (
              <label
                htmlFor={name}
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}

            {type === "avatar" ? (
              <AvatarImageUploader
                {...(props as Omit<
                  AvatarImageUploaderProps,
                  "file" | "onFileChange"
                >)}
                file={field.value || null}
                onFileChange={field.onChange}
                className={cn(
                  error &&
                    "border-destructive focus-visible:ring-destructive/50"
                )}
                aria-invalid={error ? "true" : "false"}
              />
            ) : (
              <ImageUploader
                {...(props as Omit<
                  ImageUploaderProps,
                  "files" | "onFilesChange"
                >)}
                files={field.value || []}
                onFilesChange={field.onChange}
                className={cn(
                  error &&
                    "border-destructive focus-visible:ring-destructive/50"
                )}
                aria-invalid={error ? "true" : "false"}
              />
            )}

            {description && !error && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        )}
      />

      {error && (
        <p className="text-destructive mt-1 text-sm">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default FormImageUpload;
