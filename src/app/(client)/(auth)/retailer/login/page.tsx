import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoHomeOutline } from 'react-icons/io5';
import LoginForm from './components/LoginForm';

export const metadata = {
  ...metaObject('Login Page'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session?.user?.role === ROLE.RETAILER) redirect(routes.retailer.dashboard);
    if (session?.user?.role === ROLE.SUPER_ADMIN) redirect(routes.superAdmin.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-10 grid w-full grid-cols-12 rounded-lg bg-white shadow md:max-w-6xl">
        <div className="col-span-12 p-5 md:col-span-6">
          <Link href={routes.publicRoutes.home}>
            <IoHomeOutline className="text-lg text-danger" />
          </Link>
          <Link href={routes.publicRoutes.home}>
            <img src="/images/logo.png" className="mx-auto w-28" alt="logo" />
          </Link>

          <div className="mt-8 px-1 lg:px-16">
            <h1 className="text-center text-xl font-bold xl:text-xl">Sign In</h1>

            <LoginForm />
            <div className="mt-3">
              <Link href={routes.publicRoutes.retailerForgotPassword} className="text-xs font-semibold text-danger">
                Forgot Password?
              </Link>
            </div>

            <div className="mt-10 text-center">
              New Retailer?{' '}
              <Link href={routes.publicRoutes.retailerRegister} className="font-semibold text-danger">
                Sign Up
              </Link>{' '}
              Here
            </div>
          </div>
        </div>
        <div className="col-span-12 hidden md:col-span-6 md:block lg:block">
          <div className="flex h-full items-center justify-center">
            <img src="/images/retailer-login.png" className="w-3/4 rounded-r-lg" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
