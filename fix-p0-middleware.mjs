import { readFileSync, writeFileSync, existsSync } from "fs";

// === 1) Create middleware.ts ===
const middleware = `import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_TO_BASE: Record<string, string> = {
  Core: "/dashboard/core",
  SPV_Owner: "/dashboard/owner",
  Vertical: "/dashboard/vertical",
  Knjigovodja: "/dashboard/knjigovodja",
  Bank: "/dashboard/bank",
  Holding: "/dashboard/holding",
};

const PUBLIC_PATHS = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths and API routes (API routes have own auth)
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Create Supabase client with cookie forwarding
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

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

  const { data: { user } } = await supabase.auth.getUser();

  // No session → login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Dashboard root → let client-side redirect handle role routing
  if (pathname === "/dashboard") {
    return response;
  }

  // Role enforcement for dashboard sections
  if (pathname.startsWith("/dashboard/")) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile?.role) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const allowedBase = ROLE_TO_BASE[profile.role];
    if (!allowedBase) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Core can access everything
    if (profile.role === "Core") {
      return response;
    }

    // Others can only access their section + /dashboard (redirect page)
    if (!pathname.startsWith(allowedBase)) {
      const url = request.nextUrl.clone();
      url.pathname = allowedBase;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
`;

writeFileSync("middleware.ts", middleware, "utf8");
console.log("1) middleware.ts created");
console.log("Done.");
