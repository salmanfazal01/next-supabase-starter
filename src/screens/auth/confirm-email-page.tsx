"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/supabase/use-auth";
import { Mail } from "lucide-react";
import Link from "next/link";

const ConfirmEmailPage = () => {
  const { resendConfirmationEmail, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>

          <CardTitle>Confirm Your Email</CardTitle>

          <CardDescription>
            Please check your email and click the confirmation link to access
            your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">What to do next:</p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
                <li>Check your email inbox</li>
                <li>Look for an email from us</li>
                <li>Click the confirmation link</li>
                <li>You'll be redirected back automatically</li>
              </ol>
            </div>

            <div className="space-y-2 text-center text-sm text-muted-foreground">
              <p>Didn't receive the email?</p>
              <ul className="space-y-1">
                <li>Check your spam folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and check again</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => resendConfirmationEmail()}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "Sending..." : "Resend Confirmation Email"}
              </Button>

              <Link href="/">
                <Button className="w-full" variant="ghost">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmailPage;
