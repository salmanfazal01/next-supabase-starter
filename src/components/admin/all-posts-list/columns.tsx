"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useDeletePost } from "@/hooks/supabase/use-posts";
import {
  POST_STATUS_COLORS,
  POST_STATUS_LABELS,
} from "@/lib/constants/post-status";
import type { PostStatusType, PostWithDetails } from "@/types/database/posts";
import { PostStatusEnum } from "@/types/database/posts";
import { getInitials } from "@/utils/helperFunctions";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Heart,
  ImageIcon,
  MoreHorizontal,
  Shield,
  Trash,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function createColumns(
  onChangeStatus: (postId: string, status: PostStatusType) => void
): ColumnDef<PostWithDetails>[] {
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
              <img
                src={post.image_url || "/placeholder.svg"}
                alt="Post"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "caption",
      header: "Caption",
      cell: ({ row }) => {
        const caption = row.original.caption;
        const truncated =
          caption.length > 60 ? `${caption.slice(0, 60)}...` : caption;
        return (
          <div className="max-w-[300px]">
            <p className="text-sm">{truncated}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => {
        const author = row.original.author;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={author.avatar_url || "/placeholder.svg"}
                alt={author.username}
              />
              <AvatarFallback>
                {getInitials([author.first_name, author.last_name])}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {author.first_name} {author.last_name}
              </span>
              <span className="text-muted-foreground text-xs">
                @{author.username}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "like_count",
      header: () => <div className="text-center">Likes</div>,
      cell: ({ row }) => {
        const likeCount = row.original.like_count;
        return (
          <div className="flex items-center justify-center gap-1">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{likeCount}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <span
            className={`${POST_STATUS_COLORS[post.status].bg} ${
              POST_STATUS_COLORS[post.status].text
            } text-xs px-2 py-1 rounded-md font-medium inline-block`}
          >
            {POST_STATUS_LABELS[post.status]}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Posted",
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
        const post = row.original;
        return <PostActions post={post} onChangeStatus={onChangeStatus} />;
      },
    },
  ];
}

// Separate component for actions to handle state
function PostActions({
  post,
  onChangeStatus,
}: {
  post: PostWithDetails;
  onChangeStatus: (postId: string, status: PostStatusType) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const { mutateAsync: deletePost, isPending } = useDeletePost();

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      setShowDeleteDialog(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getStatusIcon = (status: PostStatusType) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "review":
        return <Shield className="h-4 w-4" />;
      case "hidden":
        return <EyeOff className="h-4 w-4" />;
      case "deleted":
        return <Trash className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center justify-end gap-1">
          {/* View Full Image */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowImageDialog(true)}
              >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">View image</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View full image</p>
            </TooltipContent>
          </Tooltip>

          {/* Change Status Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <div className={POST_STATUS_COLORS[post.status].icon}>
                      {getStatusIcon(post.status)}
                    </div>
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
                onClick={() =>
                  onChangeStatus(post.id, PostStatusEnum.PUBLISHED)
                }
                disabled={post.status === PostStatusEnum.PUBLISHED}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {POST_STATUS_LABELS.published}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangeStatus(post.id, PostStatusEnum.DRAFT)}
                disabled={post.status === PostStatusEnum.DRAFT}
              >
                <FileText className="mr-2 h-4 w-4" />
                {POST_STATUS_LABELS.draft}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangeStatus(post.id, PostStatusEnum.REVIEW)}
                disabled={post.status === PostStatusEnum.REVIEW}
              >
                <Shield className="mr-2 h-4 w-4" />
                {POST_STATUS_LABELS.review}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangeStatus(post.id, PostStatusEnum.HIDDEN)}
                disabled={post.status === PostStatusEnum.HIDDEN}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                {POST_STATUS_LABELS.hidden}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onChangeStatus(post.id, PostStatusEnum.DELETED)}
                disabled={post.status === PostStatusEnum.DELETED}
              >
                <Trash className="mr-2 h-4 w-4" />
                {POST_STATUS_LABELS.deleted}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Post */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete post</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete post</p>
            </TooltipContent>
          </Tooltip>

          {/* More Actions */}
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
                  navigator.clipboard.writeText(post.id);
                }}
              >
                Copy post ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(post.user_id);
                }}
              >
                Copy user ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(post.image_url);
                }}
              >
                Copy image URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Post Image</DialogTitle>
          </DialogHeader>

          <div className="relative w-full overflow-hidden rounded-lg">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt="Post"
              className="w-full object-contain"
            />
          </div>

          {post.caption && (
            <div className="mt-4">
              <p className="text-sm">{post.caption}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
