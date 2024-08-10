import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ForgotPassword from './components/ForgotPassword';

export const metadata = {
  ...metaObject('Forgot Password Page'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session && session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.retailer.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-900 lg:bg-gray-100">
      <div className="m-0 grid max-w-screen-xl grid-cols-6 rounded-lg bg-white shadow-none sm:m-10 md:grid-cols-12 lg:shadow">
        <div className="col-span-12 p-7">
          <ForgotPassword />
        </div>
      </div>
    </div>
  );
}
