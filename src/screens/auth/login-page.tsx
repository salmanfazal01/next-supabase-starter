"use client";

import LoginForm from "@/components/forms/auth/login-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/supabase/use-auth";
import type { LoginFormType } from "@/types/forms/login-form-types";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const { signIn, loading } = useAuth();

  const handleSubmit = async (data: LoginFormType) => {
    try {
      await signIn({ email: data.email, password: data.password });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      // Error is handled by the mutation
    }
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="md: flex w-full flex-1 justify-center p-6 md:p-10 md:py-16">
      <div className="w-full max-w-sm">
        <Text variant="h6" className="mb-4">
          Login
        </Text>

        <LoginForm handleSubmit={handleSubmit} disabled={loading} />

        {/* Or separator */}
        <div className="my-6 flex w-full items-center">
          <Separator className="flex-1" />

          <Text variant="small" className="px-2">
            Or
          </Text>

          <Separator className="flex-1" />
        </div>

        {/* Google button */}
        <Button variant="outline" type="button" className="w-full" disabled>
          {/* Google Icon Placeholder */}
          <div className="mr-2 h-4 w-4 rounded bg-gray-300" />
          Sign in with Google
        </Button>

        {/* Sign up link */}
        <div className="mt-4 text-center">
          <Text
            variant="small"
            className="text-muted-foreground cursor-pointer"
            onClick={handleSignUp}
          >
            Don't have an account? <span className="text-primary">Sign up</span>
          </Text>
        </div>

        {/* {error && <p className="mt-4 text-red-500">{error.message}</p>} */}
      </div>
    </div>
  );
};

export default LoginPage;
