// OrderBalance.tsx
'use client';

import { RootState } from '@/features/store';
import { roundToTwoDecimals } from '@/features/subscription/subscriptionSlice';
import { calculateBalancePrice } from '@/utils';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

const OrderBalance = () => {
  const { data: session }: any = useSession();
  const { activeSubscription } = useSelector((state: RootState) => state.subscriptionSlice);
  const remainingAmount =
    activeSubscription?.slug && activeSubscription?.slug !== 'trial'
      ? roundToTwoDecimals(
          calculateBalancePrice(session?.user?.planStartAt as Date, session?.user?.planValidAt as Date, session?.user?.planPayment)
        )
      : 0;

  return (
    activeSubscription?.slug &&
    activeSubscription?.slug !== 'trial' && (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Balance</h2>
        <div className="mb-5 rounded-lg border p-4">
          <div className="mb-2 flex justify-between">
            <span>Current Amount</span>
            <span className="text-red-500">{remainingAmount.toFixed(2)} CAD</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>Usage Amount</span>
            <span className="text-red-500">{Math.abs(remainingAmount - session?.user?.planPayment).toFixed(2)} CAD</span>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderBalance;
