import { metaObject } from '@/config/site.config';
import 'aos/dist/aos.css';
import { getLocale, getTranslations } from 'next-intl/server';
import Explore from './_components/Explore';
import SubscriptionList from './_components/SubscriptionList';

export const metadata = {
  ...metaObject('Pricing'),
};

export default async function Page() {
  const t = await getTranslations('pricingPage');
  const locale = await getLocale();

  return (
    <div>
      <Explore />
      <div className=" ms-px-0 container  mx-auto mt-16 max-w-screen-xl px-5">
        <div className="mx-auto  text-start">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{t('subscriptions')}</h2>
          <p className="mb-4 text-xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-2xl">{t('subtitle')}</p>
        </div>

        <SubscriptionList locale={locale} />
      </div>
    </div>
  );
}
