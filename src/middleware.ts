import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { routes } from './config/routes';

const adminProtectedRoutes: string[] = [routes.admin.dashboard];
const userProtectedRoutes: string[] = [];
const publicRoutes: string[] = [routes.adminLogin];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = adminProtectedRoutes.includes(path);
  const isPublicRoute =
    publicRoutes.includes(path) || userProtectedRoutes.includes(path);

  const accessToken = cookies().get('act')?.value;

  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (accessToken) {
    const response: any = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth-check`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => res.json())
      .catch(() => null);

    // Server Issue
    if (response === null) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Invalid Token Check
    if (isProtectedRoute && response?.status === false) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // if (isPublicRoute && response?.status === true && req.nextUrl.pathname.startsWith("/login")) {
    //   return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    // }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
