import { UserStatusType, UserStatusEnum } from "@/types/database/profile";

export const STATUS_LABELS: Record<UserStatusEnum, string> = {
  [UserStatusEnum.ACTIVE]: "Active",
  [UserStatusEnum.BANNED]: "Banned",
  [UserStatusEnum.PENDING]: "Pending",
  [UserStatusEnum.INACTIVE]: "Inactive",
};

export const STATUS_COLORS: Record<
  UserStatusType,
  { bg: string; text: string; icon: string }
> = {
  active: {
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-400",
    icon: "text-green-600 dark:text-green-500",
  },
  banned: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-400",
    icon: "text-red-600 dark:text-red-500",
  },
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "text-yellow-600 dark:text-yellow-500",
  },
  inactive: {
    bg: "bg-gray-100 dark:bg-gray-950",
    text: "text-gray-700 dark:text-gray-400",
    icon: "text-gray-600 dark:text-gray-500",
  },
};
