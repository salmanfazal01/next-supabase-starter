import { PostStatusEnum, type PostStatusType } from "@/types/database/posts";

export const POST_STATUS_LABELS: Record<PostStatusEnum, string> = {
  [PostStatusEnum.PUBLISHED]: "Published",
  [PostStatusEnum.DRAFT]: "Draft",
  [PostStatusEnum.REVIEW]: "In Review",
  [PostStatusEnum.HIDDEN]: "Hidden",
  [PostStatusEnum.DELETED]: "Deleted",
};

export const POST_STATUS_COLORS: Record<
  PostStatusType,
  { bg: string; text: string; icon: string }
> = {
  published: {
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-400",
    icon: "text-green-600 dark:text-green-500",
  },
  draft: {
    bg: "bg-gray-100 dark:bg-gray-950",
    text: "text-gray-700 dark:text-gray-400",
    icon: "text-gray-600 dark:text-gray-500",
  },
  review: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "text-yellow-600 dark:text-yellow-500",
  },
  hidden: {
    bg: "bg-orange-100 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-400",
    icon: "text-orange-600 dark:text-orange-500",
  },
  deleted: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-400",
    icon: "text-red-600 dark:text-red-500",
  },
};

