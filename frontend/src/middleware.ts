import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];

// Runs on every request before the page renders: bounces anonymous users
// to /login, and logged-in users away from /login.
export function middleware(request: NextRequest) {
  const token = request.cookies.get('task_app_token')?.value;
  const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard'],
};
