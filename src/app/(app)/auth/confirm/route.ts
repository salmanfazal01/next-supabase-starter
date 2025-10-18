import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();

    // Exchange code for session (PKCE flow)
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the specified page after successful confirmation
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Redirect to error page if confirmation fails
  return NextResponse.redirect(new URL("/auth/auth-error", requestUrl.origin));
}
