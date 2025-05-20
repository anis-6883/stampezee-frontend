'use client';

import Button from '@/components/Formik/Button';
import { PACKAGES } from '@/config/constants';
import { routes } from '@/config/routes';
import { roundToTwoDecimals } from '@/features/subscription/subscriptionSlice';
import { calculateBalancePrice, countDaysLeft } from '@/utils';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaArrowTrendUp, FaRegCircleUser } from 'react-icons/fa6';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoDiamondOutline } from 'react-icons/io5';
import { PiStampFill } from 'react-icons/pi';

const BalanceCard = ({ showUpButton = false }: { showUpButton?: boolean }) => {
  const { data: session }: any = useSession();
  const t = useTranslations('RetailerBalanceCard');
  const t2 = useTranslations('RetailerBranchTable');

  console.log(session);

  const remainingAmount = calculateBalancePrice(
    session?.user?.planStartAt as Date,
    session?.user?.planValidAt as Date,
    session?.user?.planPayment
  );

  const usageAmount = roundToTwoDecimals(Math.abs(remainingAmount - session?.user?.planPayment));

  return (
    <div className="m-4 flex flex-col gap-y-2 rounded-lg bg-[#F4F6F8] p-3">
      {/* plan */}
      <div className="flex">
        <IoDiamondOutline className="text-xl" /> <p className="pl-3 text-center font-semibold">{t('plan')} :</p>
        <span className="pl-3 font-medium capitalize">{session?.user?.planTitle}</span>
      </div>

      {/* next renewal */}
      <div className="flex ">
        <GiSandsOfTime className="flex-shrink-0 text-xl" /> <p className="pl-3   font-semibold">{t('expire')} : </p>
        {session?.user?.plan === 'trial' && session?.user?.unlimitedFieldName ? (
          <span className="pl-3 font-medium text-danger">{session?.user?.unlimitedFieldName}</span>
        ) : (
          <span className="pl-3 font-medium text-danger">
            {countDaysLeft(session?.user?.planValidAt)} {t2('daysLeft')}
          </span>
        )}
      </div>

      {showUpButton && session?.user?.plan == 'trial' && (
        <>
          {/* user limit */}
          <div className="flex  ">
            <FaRegCircleUser className="flex-shrink-0 text-xl" /> <p className="pl-3 text-center font-semibold">{t('userLimit')} : </p>
            {session?.user?.allowTotalUser ? (
              <span className="pl-3 font-medium text-danger">{session?.user?.allowTotalUser}</span>
            ) : (
              <span className="pl-3 font-medium capitalize text-danger">{t('unlimited')}</span>
            )}
          </div>
          {/* stamp limit */}
          <div className="flex  ">
            <PiStampFill className="flex-shrink-0 text-xl" /> <p className="pl-3 text-center font-semibold">{t('stampLimit')} : </p>
            {session?.user?.allowTotalScan ? (
              <span className="pl-3 font-medium text-danger">{session?.user?.allowTotalScan}</span>
            ) : (
              <span className="pl-3 font-medium capitalize text-danger">{t('unlimited')}</span>
            )}
          </div>
        </>
      )}

      {/* {session?.user?.plan !== 'trial' && (
        <>
          <div className="flex">
            <LuCircleDollarSign className="text-xl" /> <p className="pl-3 text-center font-semibold">{t('current')} : </p>
            <span className="pl-3 font-medium text-danger">
              {remainingAmount?.toFixed(2)} {session?.user?.planPaymentCurrency}
            </span>
          </div>

          <div className="flex">
            <LuCircleDollarSign className="text-xl" /> <p className="pl-3 text-center font-semibold">{t('usage')} : </p>
            <span className="pl-3 font-medium text-danger">
              {usageAmount?.toFixed(2)} {session?.user?.planPaymentCurrency}
            </span>
          </div>
        </>
      )} */}

      {session?.user?.plan !== PACKAGES.ADVANCED && showUpButton && (
        <div className="mt-2 flex justify-center">
          <Link href={routes.privateRoutes.retailer.membershipPlan}>
            <Button text="Upgrade" color="danger" postIcon={<FaArrowTrendUp className="text-lg" />} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
