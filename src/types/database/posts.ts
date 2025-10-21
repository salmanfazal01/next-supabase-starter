import type { BaseProfile } from "./profile";

export type PostStatusType = "published" | "draft" | "review" | "hidden" | "deleted";

export enum PostStatusEnum {
  PUBLISHED = "published",
  DRAFT = "draft",
  REVIEW = "review",
  HIDDEN = "hidden",
  DELETED = "deleted",
}

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  status: PostStatusType;
  created_at: string;
  updated_at: string;
}

export interface PostWithDetails extends Post {
  author: BaseProfile;
  like_count: number;
  is_liked?: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
