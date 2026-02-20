// RIVUS v1.0 â€” Middleware (IDE U ROOT: middleware.ts pored app/)

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/invite"];

const ROLE_DASHBOARDS: Record<string, string> = {
  Core: "/dashboard/core",
  SPV_Owner: "/dashboard/owner",
  Vertical: "/dashboard/vertical",
  Bank: "/dashboard/bank",
  Knjigovodja: "/dashboard/accounting",
  Holding: "/dashboard/holding",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public / static / assets
  if (
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in â†’ to /login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get role (source of truth)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "SPV_Owner";
  const dashboard = ROLE_DASHBOARDS[role] ?? "/dashboard/owner";

  // Root or /dashboard â†’ send to role dashboard
  if (pathname === "/" || pathname === "/dashboard") {
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Prevent cross-role dashboard access
  // If user tries to open /dashboard/<something>, force them to their own dashboard base
  if (pathname.startsWith("/dashboard/")) {
    const isAllowedBase =
      pathname === dashboard || pathname.startsWith(dashboard + "/");

    // Special case: allow /dashboard/core/... only for Core, etc.
    if (!isAllowedBase && role !== "Core") {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};

