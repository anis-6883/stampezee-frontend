import { NextRequest, NextResponse } from 'next/server';
import { routes } from './config/routes';

const adminProtectedRoutes = [routes.superAdmin.dashboard];
const userProtectedRoutes = ['/root/retailer/dashboard'];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute = adminProtectedRoutes.includes(pathname) || userProtectedRoutes.includes(pathname);

  const accessToken = req.cookies.get('act')?.value;

  // No Access Token & Route is Protected, Redirect to Login
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
  }

  if (accessToken) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/verify-token`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: any = await response.json();

      // If the token is invalid or there's no response, redirect to login
      if (!data || data.status === false) {
        return NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
      }

      const role = data.data.role;

      // Redirect to the dashboard upon login
      if (pathname === '/retailer/login' || pathname === '/super-admin/login') {
        if (role === 'retailer') {
          return NextResponse.redirect(new URL('/root/retailer/dashboard', req.nextUrl));
        }
        if (role === 'super_admin') {
          return NextResponse.redirect(new URL('/root/super-admin/dashboard', req.nextUrl));
        }
      }

      // Allow access to the home page after login
      if (pathname === '/') {
        return NextResponse.next();
      }

      // Role-based redirection logic
      if (
        (role === 'retailer' && pathname.startsWith('/root/retailer')) ||
        (role === 'super_admin' && pathname.startsWith('/root/super-admin'))
      ) {
        return NextResponse.next();
      }

      // If the user role does not match the required role for the path, redirect to login
      if (
        (role !== 'retailer' && pathname.startsWith('/root/retailer')) ||
        (role !== 'super_admin' && pathname.startsWith('/root/super-admin'))
      ) {
        return NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
      }
    } catch {
      return NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
    }
  }

  // Redirect to login if accessing protected routes without access token
  if (pathname.startsWith('/root/retailer')) {
    return NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
  }
  if (pathname.startsWith('/root/super-admin')) {
    return NextResponse.redirect(new URL('/super-admin/login', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
