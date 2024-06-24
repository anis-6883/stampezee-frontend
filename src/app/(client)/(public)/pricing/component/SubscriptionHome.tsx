'use client';

import { useGetSubscriptionQuery } from '@/features/super-admin/Subscription/stampImageApi';
import { Loader } from 'rizzui';
import PricingCards from './PricingCards';

export const SubscriptionHome = () => {
  const { data, isLoading, isFetching } = useGetSubscriptionQuery(undefined);

  return (
    <div>
      <div className="relative mx-auto w-full">
        <img src="default/pricing-hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
        <div className="pricing-hero absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%] sm:absolute">
              <div className="mb-3 text-center text-[3rem] font-bold leading-10 text-[#DF2828] sm:text-left md:text-[4rem]">
                <span style={{ opacity: 1, transform: 'none' }}>E</span>
                <span style={{ opacity: 1, transform: 'none' }}>x</span>
                <span style={{ opacity: 1, transform: 'none' }}>p</span>
                <span style={{ opacity: 1, transform: 'none' }}>l</span>
                <span style={{ opacity: 1, transform: 'none' }}>o</span>
                <span style={{ opacity: 1, transform: 'none' }}>r</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
              </div>
              <br />
              <div className="flex gap-3 text-[1rem] font-bold	leading-10	text-white md:text-[3rem]">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Our</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Subscription</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>and</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Add-on</span>
                </div>
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>
      <div className=" ms-px-0 container  mx-auto mt-16 max-w-screen-xl px-5">
        <div className="mx-auto  text-start">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Subscriptions</h2>
          <p className="mb-4 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Our Plans</p>
        </div>

        <div className="dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl">
            <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-4">
              {isLoading === false ? (
                data?.data?.map((item: any) => <PricingCards key={item._id} item={item} />)
              ) : (
                <Loader variant="spinner" className="" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
