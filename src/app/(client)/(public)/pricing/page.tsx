import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getTranslations } from 'next-intl/server';
import SubscriptionList from './_components/SubscriptionList';

export const metadata = {
  ...metaObject('Pricing'),
};

export default async function Page() {
  const t = await getTranslations('pricingPage');
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  return (
    <div>
      <div className="relative mx-auto w-full">
        <img src="default/pricing-hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
        <div className="pricing-hero absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%]  sm:absolute">
              <div className="text-center text-[2.5rem] font-bold leading-10 text-[#DF2828] sm:mb-3 sm:text-left md:text-[4rem]">
                <span style={{ opacity: 1, transform: 'none' }}>{t('explore')}</span>
                {/* <span style={{ opacity: 1, transform: 'none' }}>x</span>
                <span style={{ opacity: 1, transform: 'none' }}>p</span>
                <span style={{ opacity: 1, transform: 'none' }}>l</span>
                <span style={{ opacity: 1, transform: 'none' }}>o</span>
                <span style={{ opacity: 1, transform: 'none' }}>r</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span> */}
              </div>
              <br />
              <div className="flex gap-3 text-[1rem] font-bold	leading-10	text-white md:text-[3rem]">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>{t('title')}</span>
                </div>
                {/* <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Subscription</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>and</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Add-on</span>
                </div> */}
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>
      <div className=" ms-px-0 container  mx-auto mt-16 max-w-screen-xl px-5">
        <div className="mx-auto  text-start">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{t('subscriptions')}</h2>
          <p className="mb-4 text-xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-2xl">{t('subtitle')}</p>
        </div>

        <SubscriptionList stripeInfo={data?.data?.stripe} />
      </div>
    </div>
  );
}
