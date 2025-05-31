import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import HomeAndLocalButton from './components/HomeAndLocalButton';
import RegisterForm from './components/RegisterForm';

export const metadata = {
  ...metaObject('Register Page'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const t = await getTranslations('RegisterPage');

  if (session) {
    if (session?.user?.role === ROLE.RETAILER) redirect(routes.privateRoutes.retailer.dashboard);
    if (session?.user?.role === ROLE.SUPER_ADMIN) redirect(routes.privateRoutes.superAdmin.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-10 w-full rounded-lg bg-white shadow md:max-w-2xl">
        <HomeAndLocalButton />
        <div className="p-5">
          <div className="mx-auto w-24">
            <Link href="/">
              <img src="/images/logo.png" alt="logo" />
            </Link>
          </div>

          <div className="mt-4 px-3">
            <h1 className="text-center text-xl font-bold xl:text-xl">{t('title')}</h1>

            <RegisterForm
              terms={data?.data?.page?.terms}
              policy={data?.data?.page?.policy}
              locale={locale}
              googleMapsApiKey={data?.data?.googleMap?.googleMapsApiKey}
            />

            <div className=" text-center">
              {t('alreadyHaveAccount')}{' '}
              <Link href={routes.publicRoutes.retailerLogin} className="font-semibold text-danger">
                {t('signIn')}
              </Link>{' '}
              {t('here')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
