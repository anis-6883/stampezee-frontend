import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { ROLE } from './config/constants';
import { routes } from './config/routes';

function extractLinks(obj: any) {
  let links: any = [];

  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      links.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      links = links.concat(extractLinks(obj[key]));
    } else if (typeof obj[key] === 'function') {
      // If it's a function, you can call it with a sample ID to get a sample link
      links.push(obj[key]());
    }
  }

  return links;
}

const superAdminProtectedRoutes = extractLinks(routes?.privateRoutes?.superAdmin);
const retailerProtectedRoutes = extractLinks(routes?.privateRoutes?.retailer);

retailerProtectedRoutes?.push('/checkout');

const middleware = withAuth(
  function middleware(request) {
    const token = request.nextauth?.token;
    const pathname = request.nextUrl.pathname;

    const isSuperAdminProtected = superAdminProtectedRoutes.includes(pathname);
    const isRetailerProtected = retailerProtectedRoutes.includes(pathname);

    console.log({ pathname, isRetailerProtected });

    if (!token && (isSuperAdminProtected || isRetailerProtected)) {
      return NextResponse.redirect(new URL(routes.publicRoutes.retailerLogin, request.nextUrl));
    }

    if (token) {
      if (token.role === ROLE.RETAILER && isSuperAdminProtected) {
        return NextResponse.redirect(new URL(routes.privateRoutes.retailer.dashboard, request.nextUrl));
      }

      if (token.role === ROLE.SUPER_ADMIN && isRetailerProtected) {
        return NextResponse.redirect(new URL(routes.privateRoutes.superAdmin.dashboard, request.nextUrl));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|fonts|default|$).*)'],
};
