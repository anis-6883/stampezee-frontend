import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getUserCurrency } from '@/services/currency';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import AddOnsList from './_components/AddOnsList';
import OrderBalance from './_components/OrderBalance';
import OrderSummary from './_components/OrderSummary';
import SubscriptionList from './_components/SubscriptionList';

export const metadata = {
  ...metaObject('Checkout'),
};

export default async function Page() {
  const session: any = await getServerSession(authOptions);
  if (session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.superAdmin.dashboard);
  }
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const selectedCurrency = await getUserCurrency();
  const locale = await getLocale();
  const t = await getTranslations('CheckoutPage');

  return (
    <div className="mx-auto mt-28 w-full max-w-[1300px]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold sm:text-5xl">{t('checkout')}</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold sm:text-4xl">{t('plans')}</h2>
            {session?.user?.plan && session?.user?.plan !== 'trial' ? (
              <p className="mb-6 text-lg text-gray-600">{t('switchPlan')}</p>
            ) : (
              <p className="mb-6 text-lg text-gray-600">{t('selectPlan')}</p>
            )}
            <SubscriptionList locale={locale} />
            <div className="mt-6">
              <h2 className="mb-4 text-2xl font-semibold sm:text-4xl">{t('addOns')}</h2>
              <p className="mb-6 text-lg text-gray-600">{t('selectAddOn')}</p>
              <AddOnsList locale={locale} />
            </div>
          </div>
          <div>
            <OrderBalance />
            <h2 className="mb-4 text-xl font-semibold sm:text-2xl">{t('orderSummary')}</h2>
            <OrderSummary stripeInfo={data?.data?.stripe} selectedCurrency={selectedCurrency} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
