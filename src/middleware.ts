import { NextRequest, NextResponse } from 'next/server';
import { routes } from './config/routes';

// function extractLinks(obj: any) {
//   let links: any = [];

//   for (let key in obj) {
//     if (typeof obj[key] === 'string') {
//       links.push(obj[key]);
//     } else if (typeof obj[key] === 'object') {
//       links = links.concat(extractLinks(obj[key]));
//     } else if (typeof obj[key] === 'function') {
//       // If it's a function, you can call it with a sample ID to get a sample link
//       links.push(obj[key]());
//     }
//   }

//   return links;
// }

const adminProtectedRoutes = [routes.superAdmin.dashboard];
const userProtectedRoutes = [routes.retailer.dashboard];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute = adminProtectedRoutes.includes(pathname) || userProtectedRoutes.includes(pathname);

  const accessToken = req.cookies.get('act')?.value;

  console.log('accessToken', accessToken);

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

      console.log(data);

      // If the token is invalid or there's no response, redirect to login
      if (!data || data.status === false) {
        const response = NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
        response.cookies.delete('act');
        response.cookies.delete('rft');
        return response;
      }

      const role = data.data.role;

      // Redirect to the dashboard upon login
      if ([routes.retailer.login, routes.retailer.register, routes.superAdmin.login].includes(pathname)) {
        if (role === 'retailer') {
          return NextResponse.redirect(new URL('/root/retailer/dashboard', req.nextUrl));
        }
        if (role === 'super_admin') {
          return NextResponse.redirect(new URL('/root/super-admin/dashboard', req.nextUrl));
        }
      }

      // Access Control
      if (role === 'retailer' && adminProtectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/root/retailer/dashboard', req.nextUrl));
      }
      if (role === 'super_admin' && userProtectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/root/super-admin/dashboard', req.nextUrl));
      }
    } catch {
      console.log('first');
      // const response = NextResponse.redirect(new URL('/retailer/login', req.nextUrl));
      // response.cookies.delete('act');
      // response.cookies.delete('rft');
      // return response;
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|fonts|default|$).*)'],
};
