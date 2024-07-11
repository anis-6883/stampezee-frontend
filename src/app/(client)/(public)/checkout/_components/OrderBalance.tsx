// OrderBalance.tsx
'use client';

import { RootState } from '@/features/store';
import { useSelector } from 'react-redux';

const OrderBalance = () => {
  const { activeSubscription, remainingBalance } = useSelector((state: RootState) => state.subscriptionSlice);

  return (
    activeSubscription?.slug &&
    activeSubscription?.slug !== 'trial' && (
      <div className="my-5">
        <h2 className="pb-2 text-lg font-medium">Balance</h2>
        <hr className="p-2 text-lg font-bold" />
        <div className="mb-2 flex justify-between">
          <span>Current Amount</span>
          <span className="text-red-500">{remainingBalance.toFixed(2)} CAD</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span>Usage Amount</span>
          <span className="text-red-500">{Math.abs(remainingBalance - activeSubscription?.price).toFixed(2)} CAD</span>
        </div>
      </div>
    )
  );
};

export default OrderBalance;
