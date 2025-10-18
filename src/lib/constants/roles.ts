import { UserRoleType, UserRoleEnum } from "@/types/database/profile";

export const ROLES_LABELS: Record<UserRoleEnum, string> = {
  [UserRoleEnum.USER]: "User",
  [UserRoleEnum.MODERATOR]: "Moderator",
  [UserRoleEnum.ADMIN]: "Admin",
};

export const ROLE_HIERARCHY: Record<UserRoleType, number> = {
  user: 1,
  moderator: 2,
  admin: 3,
};

export function hasPermission(
  userRole: UserRoleType,
  requiredRole: UserRoleType
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
