export type UserRoleType = "user" | "moderator" | "admin";

export enum UserRoleEnum {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export type UserStatusType = "active" | "banned" | "pending" | "inactive";

export enum UserStatusEnum {
  ACTIVE = "active",
  BANNED = "banned",
  PENDING = "pending",
  INACTIVE = "inactive",
}

export interface BaseProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

export interface Profile extends BaseProfile {
  email: string;
  role: UserRoleType;
  status: UserStatusType;
  created_at: string;
  updated_at: string;
}
