import ImageUploader, {
  type ImageUploaderProps,
} from "@/components/ui/image-uploader";
import { cn } from "@/lib/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormImageUploadProps
  extends Omit<ImageUploaderProps, "files" | "onFilesChange"> {
  name: string;
  className?: string;
  label?: string;
  description?: string;
}

const FormImageUpload: React.FC<FormImageUploadProps> = ({
  name,
  className,
  label,
  description,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn("w-full", className)}>
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

            <ImageUploader
              {...props}
              files={field.value || []}
              onFilesChange={field.onChange}
              className={cn(
                error && "border-destructive focus-visible:ring-destructive/50"
              )}
              aria-invalid={error ? "true" : "false"}
            />

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
