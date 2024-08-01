// OrderBalance.tsx
'use client';

import { RootState } from '@/features/store';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';

const OrderBalance = () => {
  const { data: session }: any = useSession();
  const { activeSubscription, remainingBalance } = useSelector((state: RootState) => state.subscriptionSlice);

  return (
    activeSubscription?.slug &&
    activeSubscription?.slug !== 'trial' && (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Balance</h2>
        <div className="mb-5 rounded-lg border p-4">
          <div className="mb-2 flex justify-between">
            <span>Current Amount</span>
            <span className="text-red-500">{remainingBalance.toFixed(2)} CAD</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>Usage Amount</span>
            <span className="text-red-500">{Math.abs(remainingBalance - session?.user?.planPayment).toFixed(2)} CAD</span>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderBalance;
