'use client';

import { useGetSubscriptionQuery } from '@/features/super-admin/Subscription/stampImageApi';
import { Loader } from 'rizzui';
import PricingCard from './PricingCard';

export default function SubscriptionList() {
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const subscription = data?.data.filter((item: any) => item.type === 'subscription');

  return (
    <div>
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-4">
          {isLoading === false ? (
            subscription?.map((item: any) => <PricingCard key={item._id} item={item} />)
          ) : (
            <Loader variant="spinner" />
          )}
        </div>
      </div>
    </div>
  );
}
