import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;
  
  const protectedRoutes = ['/dashboard', '/settings', '/drafts', '/content-preview'];
  const authRoutes = ['/sign-in', '/sign-up'];
  const publicRoutes = ['/'];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  if (isProtectedRoute) {
    if (!authToken || authToken.length < 10) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
  }
  
  if (isAuthRoute) {
    if (authToken && authToken.length >= 10) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/settings/:path*', 
    '/drafts/:path*', 
    '/content-preview/:path*',
    '/sign-in',
    '/sign-up'
  ]
};
