"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROLES_LABELS } from "@/lib/constants/roles";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants/status";
import type {
  Profile,
  UserRoleType,
  UserStatusType,
} from "@/types/database/profile";
import { UserRoleEnum, UserStatusEnum } from "@/types/database/profile";
import { getInitials } from "@/utils/helperFunctions";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  Clock,
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { RoleBadge } from "./role-badge";

export function createColumns(
  onChangeRole: (userId: string, role: UserRoleType) => void,
  onChangeStatus: (userId: string, status: UserStatusType) => void
): ColumnDef<Profile>[] {
  return [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar_url} alt={user.username} />
              <AvatarFallback>
                {getInitials([user.first_name, user.last_name])}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-muted-foreground text-sm">
                @{user.username}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground">{row.original.email}</span>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return <RoleBadge role={row.original.role} />;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <span
            className={`${STATUS_COLORS[user.status].bg} ${
              STATUS_COLORS[user.status].text
            } text-xs px-2 py-1 rounded-md font-medium inline-block`}
          >
            {STATUS_LABELS[user.status]}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return (
          <span className="text-muted-foreground text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center justify-end gap-1">
            {/* Change Role Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Shield className="h-4 w-4" />
                      <span className="sr-only">Change role</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Change role</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Role</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onChangeRole(user.id, UserRoleEnum.USER)}
                  disabled={user.role === UserRoleEnum.USER}
                >
                  {ROLES_LABELS.user}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onChangeRole(user.id, UserRoleEnum.MODERATOR)}
                  disabled={user.role === UserRoleEnum.MODERATOR}
                >
                  {ROLES_LABELS.moderator}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onChangeRole(user.id, UserRoleEnum.ADMIN)}
                  disabled={user.role === UserRoleEnum.ADMIN}
                >
                  {ROLES_LABELS.admin}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Change Status Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {user.status === "active" && (
                        <UserCheck className="h-4 w-4" />
                      )}

                      {user.status === "banned" && <Ban className="h-4 w-4" />}

                      {user.status === "pending" && (
                        <Clock className="h-4 w-4" />
                      )}

                      {user.status === "inactive" && (
                        <UserX className="h-4 w-4" />
                      )}

                      <span className="sr-only">Change status</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Change status</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onChangeStatus(user.id, UserStatusEnum.ACTIVE)}
                  disabled={user.status === UserStatusEnum.ACTIVE}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  {STATUS_LABELS.active}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onChangeStatus(user.id, UserStatusEnum.INACTIVE)
                  }
                  disabled={user.status === UserStatusEnum.INACTIVE}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {STATUS_LABELS.inactive}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    onChangeStatus(user.id, UserStatusEnum.PENDING)
                  }
                  disabled={user.status === UserStatusEnum.PENDING}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {STATUS_LABELS.pending}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onChangeStatus(user.id, UserStatusEnum.BANNED)}
                  disabled={user.status === UserStatusEnum.BANNED}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  {STATUS_LABELS.banned}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Copy</DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                  }}
                >
                  Copy user ID
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user.email);
                  }}
                >
                  Copy email
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user.username);
                  }}
                >
                  Copy username
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
