'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { currentPeriodByTimezone, getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { Badge } from 'rizzui';

export function SubscriptionBasicInfo({ isLoading, isError, data }: { isLoading: boolean; isError: boolean; data: any }) {
  const t = useTranslations('RetailerBillingDetailsCard');
  const t5 = useTranslations('RetailerBranchTable');
  const t7 = useTranslations('RetailerBillingTable');
  const { data: session }: any = useSession();
  const validityToUtc = moment.tz(data?.validityTo, session?.user?.timezone?.label).utc();

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
      <div className="flex flex-col justify-between font-medium md:flex-row">
        <span className="font-semibold">{t('subscriptionID')}</span>
        <span>
          {isLoading || isError ? (
            <Skeleton className="h-6 w-32 rounded" />
          ) : data?.stripe?.subscriptionId ? (
            data?.stripe?.subscriptionId
          ) : (
            'N/A'
          )}
        </span>
      </div>
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">{t('enrollStatus')}</span>
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : data?.enrollStatus === 'purchase' ? (
          <Badge className="bg-primary text-white">
            <HiShoppingCart className="mr-1 text-xl" /> {'Paid Subscription'}
          </Badge>
        ) : data?.enrollStatus === 'upgrade' ? (
          <Badge className="!bg-success text-white">
            <IoArrowUpCircle className="mr-1 text-xl" /> {_.capitalize(data?.enrollStatus)}
          </Badge>
        ) : data?.enrollStatus === 'trial' ? (
          <Badge className="!bg-black text-white">
            <HiShoppingCart className="mr-1 text-xl" /> {'Free Subscription'}
          </Badge>
        ) : (
          <Badge className="!bg-danger text-white">
            <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(data?.enrollStatus)}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">{t('purchasedAt')}</span>{' '}
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : (
          <span>{getFormatDateByTimezone(data?.createdAt, session?.user?.timezone?.label || '')}</span>
        )}
      </div>
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">{t('currentPeriod')}</span>{' '}
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : (
          <span>
            {data?.enrollStatus === 'trial' && session?.user?.unlimitedFieldName
              ? session?.user?.unlimitedFieldName
              : currentPeriodByTimezone(data?.validityFrom, data?.validityTo, session?.user?.timezone?.label || '')}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">{t5('billingCycle')}</span>
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : data?.status === true && moment().isBefore(validityToUtc) ? (
          <Badge className="!bg-success text-white">
            <GiSandsOfTime className="mr-1 text-xl" /> {t('running')}
          </Badge>
        ) : (
          <Badge className="!bg-danger text-white">
            <PiFlagCheckeredFill className="mr-1 text-xl" /> {t7('cancelled')}
          </Badge>
        )}
      </div>
      {!isLoading && data?.stripe?.renewCancelAt !== null && (
        <div className="flex items-center justify-between font-medium">
          <span className="font-semibold">{t('subscriptionCancelAt')}</span>{' '}
          <span className="text-danger">{getFormatDateByTimezone(data?.stripe?.renewCancelAt, session?.user?.timezone?.label || '')}</span>
        </div>
      )}
      {!data?.stripe?.renewCancelAt && (
        <div className="flex items-center justify-between font-medium">
          {data?.enrollStatus === 'trial' ? (
            <span className="font-semibold">{'Expired At'}</span>
          ) : (
            <span className="font-semibold">{t('nextInvoice')}</span>
          )}
          {isLoading || isError ? (
            <Skeleton className="h-6 w-32 rounded" />
          ) : (
            <span>
              {data?.enrollStatus === 'trial' && session?.user?.unlimitedFieldName
                ? session?.user?.unlimitedFieldName
                : getFormatDateByTimezone(data?.validityTo, session?.user?.timezone?.label || '')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
