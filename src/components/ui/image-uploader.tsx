"use client";

import { cn } from "@/lib/utils";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useFileUpload,
  type FileUploadOptions,
  type FileWithPreview,
} from "@/hooks/ui/use-file-upload";

export interface ImageUploaderProps
  extends Omit<FileUploadOptions, "onFilesChange"> {
  /** Array of files currently uploaded */
  files?: FileWithPreview[];
  /** Callback when files change */
  onFilesChange?: (files: FileWithPreview[]) => void;
  /** Custom className for the container */
  className?: string;
  /** Custom className for the drop area */
  dropAreaClassName?: string;
  /** Whether to show the API link in footer */
  showApiLink?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
  /** Custom description text */
  description?: string;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Custom grid columns for file display */
  gridCols?: "2" | "3" | "4" | "5" | "6";
}

export default function ImageUploader({
  files: controlledFiles,
  onFilesChange,
  className,
  dropAreaClassName,
  showApiLink = false,
  placeholder = "Drop your images here",
  description,
  disabled = false,
  gridCols = "3",
  maxFiles = 6,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
  multiple = true,
  ...options
}: ImageUploaderProps) {
  const maxSizeMB = Math.round(maxSize / (1024 * 1024));

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
    multiple,
    maxFiles,
    onFilesChange,
  });

  // Use controlled files if provided, otherwise use internal files
  const files = controlledFiles ?? internalFiles;

  const gridColsClass = {
    "2": "grid-cols-2",
    "3": "grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-2 md:grid-cols-4",
    "5": "grid-cols-2 md:grid-cols-5",
    "6": "grid-cols-2 md:grid-cols-6",
  }[gridCols];

  const defaultDescription =
    description ?? `SVG, PNG, JPG or GIF (max. ${maxSizeMB}MB)`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={files.length === 0 && !disabled ? openFileDialog : undefined}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          "border-input data-[dragging=true]:bg-accent/50 relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center",
          "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          files.length === 0 &&
            !disabled &&
            "hover:bg-accent/30 cursor-pointer",
          dropAreaClassName
        )}
      >
        <input
          {...getInputProps({ disabled })}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="mb-1 truncate text-sm">
                Uploaded Files ({files.length})
              </h3>

              {files.length < maxFiles && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled}
                >
                  <UploadIcon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Add more
                </Button>
              )}
            </div>

            <div className={cn("grid gap-4", gridColsClass)}>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-accent relative aspect-square rounded-md"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    disabled={disabled}
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">{placeholder}</p>
            <p className="text-muted-foreground text-xs">
              {defaultDescription}
            </p>
          </div>
        )}
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

      {showApiLink && (
        <p
          aria-live="polite"
          role="region"
          className="text-muted-foreground mt-2 text-center text-xs"
        >
          Multiple image uploader w/ image grid ∙{" "}
          <a
            href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
            className="hover:text-foreground underline"
          >
            API
          </a>
        </p>
      )}
    </div>
  );
}
