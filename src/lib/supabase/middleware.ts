import { UserRoleEnum } from "@/types/database/profile";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "../api/server/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const HOME_ROUTES = ["/"];
const ADMIN_ONLY_ROUTES = ["/dashboard/all-users", "/dashboard/all-posts"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refreshing the auth token
  const { user, profile } = await getCurrentUser();
  const role = profile?.role;

  // Protected routes
  if (
    !HOME_ROUTES.includes(request.nextUrl.pathname) &&
    !user &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Confirm email
  if (
    user &&
    !user.email_confirmed_at &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/posts/create"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/confirm-email";
    return NextResponse.redirect(url);
  }

  // Admin only routes
  if (
    ADMIN_ONLY_ROUTES.includes(request.nextUrl.pathname) &&
    role !== UserRoleEnum.ADMIN
  ) {
    console.log(role, request.nextUrl.pathname, role, UserRoleEnum.ADMIN);

    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/profile";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    !!user &&
    (request.nextUrl.pathname.startsWith("/auth/login") ||
      request.nextUrl.pathname.startsWith("/auth/register"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
