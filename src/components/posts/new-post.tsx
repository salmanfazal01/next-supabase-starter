"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";
import { useCreatePost } from "@/hooks/supabase/use-posts";
import type { CreatePostFormType } from "@/types/forms/post-form-types";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreatePostForm from "../forms/posts/create-post-form";

const NewPost = () => {
  const user = useAuth((state) => state.user);
  const [open, setOpen] = useState(false);

  const { isPending, mutateAsync: createPost } = useCreatePost();

  const handleSubmit = async (data: CreatePostFormType) => {
    try {
      await createPost({
        caption: data.caption,
        imageFile: data.image[0].file,
      });

      // Close dialog on success
      setOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // If user is not logged in, show a simple button that redirects to login
  if (!user) {
    return null;
  }

  // If user is logged in, show the dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New Post
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <CreatePostForm
          handleSubmit={handleSubmit}
          loading={isPending}
          disabled={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewPost;
