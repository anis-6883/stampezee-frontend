import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import HomeAndLocalButton from '../register/components/HomeAndLocalButton';
import LoginForm from './components/LoginForm';

export const metadata = {
  ...metaObject('Login Page'),
};

export default async function Page() {
  const t = await getTranslations('LoginPage');
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (session) {
    if (session?.user?.role === ROLE.RETAILER) redirect(routes.privateRoutes.retailer.dashboard);
    if (session?.user?.role === ROLE.SUPER_ADMIN) redirect(routes.privateRoutes.superAdmin.dashboard);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-10 grid w-full grid-cols-12 rounded-lg bg-white shadow md:max-w-6xl">
        <div className="col-span-12 p-5 md:col-span-6">
          <HomeAndLocalButton />
          <div className="mx-auto w-28">
            <Link href={routes.publicRoutes.home}>
              <img src="/images/logo.png" alt="logo" />
            </Link>
          </div>

          <div className="mt-8 px-1 lg:px-16">
            <h1 className="text-center text-xl font-bold xl:text-xl">{t('signIn')}</h1>

            <LoginForm locale={locale} />
            <div className="mt-3">
              <Link href={routes.publicRoutes.retailerForgotPassword} className="text-xs font-semibold text-danger">
                {t('forgotPassword')}
              </Link>
            </div>

            <div className="mt-10 text-center">
              {t('newRetailer')}?{' '}
              <Link href={routes.publicRoutes.retailerRegister} className="font-semibold text-danger">
                {t('signUp')}
              </Link>{' '}
              {t('here')}
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
