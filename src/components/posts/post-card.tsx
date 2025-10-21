"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useDeletePost } from "@/hooks/supabase/use-posts";
import { hasPermission } from "@/lib/constants/roles";
import type { PostWithDetails } from "@/types/database/posts";
import { getInitials } from "@/utils/helperFunctions";
import { formatDistanceToNow } from "date-fns";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PostCardProps {
  post: PostWithDetails;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
}

export function PostCard({ post, onLike, onUnlike }: PostCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const profile = useAuth((state) => state.profile);

  const { mutateAsync: deletePost, isPending } = useDeletePost();

  const isOwnPost = profile?.id === post.user_id;
  const canDelete =
    isOwnPost || (profile && hasPermission(profile.role, "moderator"));

  const handleLikeToggle = () => {
    if (post.is_liked) {
      onUnlike?.(post.id);
    } else {
      onLike?.(post.id);
    }
  };

  const handleDelete = async () => {
    await deletePost(post.id);
    setShowDeleteDialog(false);
  };

  const initials = getInitials([post.author.first_name, post.author.last_name]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar_url || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {post.author.username || "Anonymous"}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.caption}</p>
          {post.image_url && (
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.image_url || "/placeholder.svg"}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            variant={post.is_liked ? "default" : "outline"}
            size="sm"
            onClick={handleLikeToggle}
            disabled={!profile}
            className="gap-2"
          >
            <Heart
              className={`h-4 w-4 ${post.is_liked ? "fill-current" : ""}`}
            />
            <span>{post.like_count}</span>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
