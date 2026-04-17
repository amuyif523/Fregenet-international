import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/session';
import { getAuthEnv } from '@/lib/env';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isApiAdminPath = pathname.startsWith('/api/admin');
  const isLoginPath = pathname === '/login';

  const cookie = request.cookies.get('fregenet_session');
  let isValidSession = false;

  if (cookie?.value) {
    const { jwtSecret } = getAuthEnv();
    // In local dev, environments might not be fully loaded, but next runtime will provide them.
    if (jwtSecret) {
      isValidSession = await verifySessionToken(cookie.value, jwtSecret);
    }
  }

  // Redirect unauthenticated users trying to access secure paths
  if (isAdminPath && !isValidSession) {
    if (isApiAdminPath) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from the login page
  if (isLoginPath && isValidSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Ensure middleware only intercepts related paths
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/login'],
};
