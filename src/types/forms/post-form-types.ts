import z from "zod";

// Create a Zod schema for FileWithPreview
const fileWithPreviewSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
  preview: z.string().optional(),
});

export const createPostSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(500, "Caption must be less than 500 characters"),
  image: z
    .array(fileWithPreviewSchema)
    .min(1, "Please select an image")
    .max(1, "Only one image is allowed")
    .refine((files) => files.length > 0, "Please select an image"),
});

export type CreatePostFormType = z.infer<typeof createPostSchema>;
