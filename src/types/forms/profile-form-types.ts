import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
