import { ROLES_LABELS } from "@/lib/constants/roles";
import type { UserRole } from "@/types/database/profile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleVariants: Record<UserRole, string> = {
  user: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  moderator: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  admin: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(roleVariants[role], "font-medium", className)}
    >
      {ROLES_LABELS[role]}
    </Badge>
  );
}



