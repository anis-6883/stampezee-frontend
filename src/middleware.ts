import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { routes } from './config/routes';

const adminProtectedRoutes: string[] = [routes.admin.dashboard];
const userProtectedRoutes: string[] = [routes.user.profile];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = adminProtectedRoutes.includes(path) || userProtectedRoutes.includes(path);

  const accessToken = cookies().get('act')?.value;

  // No Access Token & Route is Protected, Redirect to Login
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (accessToken) {
    const response: any = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/auth-check`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .catch(() => null);

    // Server Issue
    if (response === null && !path.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Invalid Token Check
    if (isProtectedRoute && response?.status === false) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    const role: 'admin' | 'user' | 'retailer' = response?.data?.role;

    // Redirect to Admin Dashboard
    if (['admin', 'retailer'].includes(role) && path.startsWith('/login')) {
      return NextResponse.redirect(new URL('/project-admin/dashboard', req.nextUrl));
    }

    // Redirect to User Dashboard
    if (role === 'user' && (path.startsWith('/login') || adminProtectedRoutes.includes(path))) {
      return NextResponse.redirect(new URL('/profile', req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
