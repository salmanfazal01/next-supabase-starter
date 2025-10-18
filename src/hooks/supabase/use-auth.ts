"use client";

import { createClient } from "@/lib/supabase/client";
import type { LoginFormType } from "@/types/forms/login-form-types";
import type { SignupFormType } from "@/types/forms/signup-form-types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const signUp = async ({
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
  }: SignupFormType) => {
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        throw new Error("Passwords don't match");
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            window.location.origin
          }/auth/confirm`,
        },
      });

      if (error) throw error;

      toast.success(
        "Registration successful! Please check your email to confirm your account."
      );
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign up";

      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }: LoginFormType) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Signed in successfully!");

      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign in";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast.success("Signed out successfully!");
      router.push("/auth/login");
      router.refresh();

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during sign out";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationEmail = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        throw new Error("No email found. Please sign up again.");
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      if (error) throw error;

      toast.success("Confirmation email sent! Check your inbox.");
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend confirmation email";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resendConfirmationEmail,
    loading,
  };
}
