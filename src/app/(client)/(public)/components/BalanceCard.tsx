import { RootState } from '@/features/store';
import { roundToTwoDecimals } from '@/features/subscription/subscriptionSlice';
import { calculateBalancePrice, calculateCurrencyExchangeRate, countDaysLeft } from '@/utils';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoDiamondOutline } from 'react-icons/io5';
import { LuCircleDollarSign } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const BalanceCard = () => {
  const { data: session }: any = useSession();
  const { currency } = useSelector((state: RootState) => state.subscriptionSlice);

  const remainingAmount = roundToTwoDecimals(
    calculateCurrencyExchangeRate({
      selectedCurrencyExchangeRate: currency,
      price: calculateBalancePrice(session?.user?.planStartAt as Date, session?.user?.planValidAt as Date, session?.user?.planPayment),
    })
  );

  const usageAmount = roundToTwoDecimals(
    Math.abs(remainingAmount - calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate: currency, price: session?.user?.planPayment }))
  );
  return (
    <div className="m-4 flex flex-col gap-y-2 rounded-lg bg-[#F4F6F8] p-3">
      <div className="flex">
        <IoDiamondOutline className="text-xl" /> <p className="pl-3 text-center font-semibold">Plan : </p>
        <span className="pl-3 font-medium">{_.capitalize(session?.user?.plan)}</span>
      </div>
      <div className="flex">
        <GiSandsOfTime className="text-xl" /> <p className="pl-3 text-center font-semibold">Expire : </p>
        <span className="pl-3 font-medium text-danger">{countDaysLeft(session?.user?.planValidAt)} days left</span>
      </div>
      {session?.user?.plan !== 'trial' && (
        <>
          <div className="flex">
            <LuCircleDollarSign className="text-xl" /> <p className="pl-3 text-center font-semibold">Current : </p>
            <span className="pl-3 font-medium text-danger">
              {remainingAmount?.toFixed(2)} {currency?.name}
            </span>
          </div>
          <div className="flex">
            <LuCircleDollarSign className="text-xl" /> <p className="pl-3 text-center font-semibold">Usage : </p>
            <span className="pl-3 font-medium text-danger">
              {usageAmount?.toFixed(2)} {currency?.name}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default BalanceCard;
