import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import RegisterForm from './components/RegisterForm';

export const metadata = {
  ...metaObject('Register Page'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session?.user?.role === ROLE.RETAILER) redirect(routes.retailer.dashboard);
    if (session?.user?.role === ROLE.SUPER_ADMIN) redirect(routes.superAdmin.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-10 w-full rounded-lg bg-white shadow md:max-w-2xl">
        <div className="p-5">
          <Link href="/">
            <img src="/images/logo.png" className="mx-auto w-24" alt="logo" />
          </Link>
          <div className="mt-4 px-3">
            <h1 className="text-center text-xl font-bold xl:text-xl">Store Registration</h1>

            <RegisterForm />

            <div className="mt-5 text-center">
              Already have an account?{' '}
              <Link href={routes.publicRoutes.retailerLogin} className="font-semibold text-danger">
                Sign In
              </Link>{' '}
              Here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
