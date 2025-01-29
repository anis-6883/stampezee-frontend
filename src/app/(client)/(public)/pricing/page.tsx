import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import 'aos/dist/aos.css';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import AddOnListForPricing from './_components/AddonListForPricing';
import Explore from './_components/Explore';
import SubscriptionList from './_components/SubscriptionList';

export const metadata = {
  ...metaObject('Pricing'),
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.superAdmin.dashboard);
  }

  const t = await getTranslations('pricingPage');
  const locale = await getLocale();

  return (
    <div>
      <Explore />
      <div className=" ms-px-0 container  mx-auto mt-16 max-w-screen-xl px-5">
        <div className="mx-auto  text-start">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{t('subscriptions')}</h2>
          <p className="mb-4 text-xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-4xl">{t('subtitle')}</p>
        </div>

        <SubscriptionList locale={locale} />
      </div>
      {/* Addon List  */}
      <div className=" ms-px-0 container  mx-auto mt-16 max-w-screen-xl px-5">
        <div className="mx-auto  text-start">
          <p className="mb-4 text-xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-4xl">{'Our Add-ons'}</p>
        </div>

        <AddOnListForPricing locale={locale} />
      </div>
    </div>
  );
}
