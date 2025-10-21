"use client";

import { cn } from "@/lib/utils";
import { AlertCircleIcon, PencilIcon, UserIcon } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  useFileUpload,
  type FileUploadOptions,
  type FileWithPreview,
} from "@/hooks/ui/use-file-upload";

export interface AvatarImageUploaderProps
  extends Omit<FileUploadOptions, "onFilesChange"> {
  /** The file currently uploaded */
  file?: FileWithPreview;
  /** Callback when file changes */
  onFileChange?: (file: FileWithPreview | null) => void;
  /** Custom className for the container */
  className?: string;
  /** Custom className for the avatar */
  avatarClassName?: string;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Size of the avatar */
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AvatarImageUploader({
  file: controlledFile,
  onFileChange,
  className,
  avatarClassName,
  disabled = false,
  size = "lg",
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/png,image/jpeg,image/jpg",
  ...options
}: AvatarImageUploaderProps) {
  const maxSizeMB = Math.round(maxSize / (1024 * 1024));

  const handleFilesChange = useCallback(
    (files: FileWithPreview[]) => {
      onFileChange?.(files.length > 0 ? files[0] : null);
    },
    [onFileChange]
  );

  const [
    { files: internalFiles, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    ...options,
    accept,
    maxSize,
    multiple: false,
    maxFiles: 1,
    onFilesChange: handleFilesChange,
  });

  // Use controlled file if provided, otherwise use internal file
  const file = controlledFile ?? internalFiles[0];

  const sizes = {
    sm: {
      avatar: "size-16",
      icon: "size-6",
      button: "size-7",
      pencil: "size-3",
    },
    md: {
      avatar: "size-24",
      icon: "size-8",
      button: "size-8",
      pencil: "size-3.5",
    },
    lg: {
      avatar: "size-32",
      icon: "size-12",
      button: "size-9",
      pencil: "size-4",
    },
    xl: {
      avatar: "size-40",
      icon: "size-16",
      button: "size-10",
      pencil: "size-4.5",
    },
  }[size];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative w-fit">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={!disabled ? openFileDialog : undefined}
          data-dragging={isDragging || undefined}
          data-disabled={disabled || undefined}
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-full border-2 transition-all",
            sizes.avatar,
            file ? "border-border" : "border-input border bg-muted",
            !disabled && "cursor-pointer hover:border-primary/50",
            isDragging && "border-primary bg-accent/50",
            disabled && "cursor-not-allowed opacity-50",
            avatarClassName
          )}
        >
          <input
            {...getInputProps({ disabled })}
            className="sr-only"
            aria-label="Upload avatar image"
          />

          {file ? (
            <img
              src={file.preview}
              alt="Avatar"
              className="size-full object-cover"
            />
          ) : (
            <UserIcon className={cn(sizes.icon, "text-muted-foreground")} />
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              if (file) {
                removeFile(file.id);
              } else {
                openFileDialog();
              }
            }
          }}
          size="icon"
          disabled={disabled}
          className={cn(
            "absolute bottom-1 right-1 shadow-md rounded-full",
            sizes.button
          )}
          aria-label={file ? "Change avatar" : "Upload avatar"}
        >
          <PencilIcon className={sizes.pencil} />
        </Button>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
