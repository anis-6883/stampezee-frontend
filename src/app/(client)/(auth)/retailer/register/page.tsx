import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import RegisterForm from './components/RegisterForm';

export const metadata = {
  ...metaObject('Register Page'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  if (session) {
    if (session?.user?.role === ROLE.RETAILER) redirect(routes.privateRoutes.retailer.dashboard);
    if (session?.user?.role === ROLE.SUPER_ADMIN) redirect(routes.privateRoutes.superAdmin.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-10 w-full rounded-lg bg-white shadow md:max-w-2xl">
        <div className="p-5">
          <div className="mx-auto w-24">
            <Link href="/">
              <img src="/images/logo.png" alt="logo" />
            </Link>
          </div>

          <div className="mt-4 px-3">
            <h1 className="text-center text-xl font-bold xl:text-xl">Store Registration</h1>

            <RegisterForm terms={data?.data?.page?.terms} policy={data?.data?.page?.policy} />

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
