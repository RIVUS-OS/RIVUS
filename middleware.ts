// RIVUS v1.0 — Middleware (IDE U ROOT: middleware.ts pored app/)

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/invite'];

const ROLE_DASHBOARDS: Record<string, string> = {
  Core: '/dashboard/core',
  SPV_Owner: '/dashboard/spv_owner',
  Vertical: '/dashboard/vertical',
  Bank: '/dashboard/bank',
  Knjigovodja: '/dashboard/knjigovodja',
  Holding: '/dashboard/holding',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_ROUTES.some(r => pathname.startsWith(r)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) return NextResponse.next();

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
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

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/' || pathname === '/dashboard') {
    const { data: profile } = await supabase
      .from('user_profiles').select('role').eq('id', user.id).single();
    const dashboard = ROLE_DASHBOARDS[profile?.role ?? 'SPV_Owner'] ?? '/dashboard/spv_owner';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
