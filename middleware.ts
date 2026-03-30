import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/session'
import { getAuthEnv } from '@/lib/env'

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('fregenet_session')?.value
  const { jwtSecret } = getAuthEnv()
  const isAuthenticated = jwtSecret
    ? await verifySessionToken(sessionToken, jwtSecret)
    : false

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
