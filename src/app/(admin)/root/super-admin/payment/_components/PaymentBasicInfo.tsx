import { Skeleton } from '@/components/ui/skeleton';
import { currentPeriodByTimezone, getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { Badge } from 'rizzui';

export function PaymentBasicInfo({
  isLoading,
  isError,
  data,
  timezone,
}: {
  isLoading: boolean;
  isError: boolean;
  data: any;
  timezone: string;
}) {
  const validityToUtc = moment.tz(data?.validityTo, timezone).utc();

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
      <div className="flex flex-col items-center justify-between font-medium md:flex-row">
        <span className="font-bold">Store</span>{' '}
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : (
          <div className="flex items-center gap-x-1">
            {data?.retailer?.image ? (
              <div>
                <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${data?.retailer?.image}`} alt="image" className="h-8 w-8 rounded" />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
            )}
            {data?.retailer?.storeName}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between font-medium md:flex-row">
        <span className="font-bold">Subscription ID</span>
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
        <span className="font-bold">Enroll Status</span>{' '}
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
            <HiShoppingCart className="mr-1 text-xl" />
            {'Free Subscription'}
          </Badge>
        ) : (
          <Badge className="!bg-danger text-white">
            <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(data?.enrollStatus)}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between font-medium">
        <span className="font-bold">Purchased At</span>{' '}
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : (
          <span>{getFormatDateByTimezone(data?.createdAt, timezone)}</span>
        )}
      </div>
      <div className="flex items-center justify-between font-medium">
        <span className="font-bold">Current Period</span>{' '}
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : (
          <span>
            {data?.enrollStatus === 'trial' && data?.enrollSubscriptions[0]?.unlimitedFieldName
              ? data?.enrollSubscriptions[0]?.unlimitedFieldName
              : currentPeriodByTimezone(data?.validityFrom, data?.validityTo, timezone)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between font-medium">
        <span className="font-bold">Billing Cycle</span>{' '}
        {isLoading || isError ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : data?.status === true && moment().isBefore(validityToUtc) ? (
          <Badge className="!bg-success text-white">
            <GiSandsOfTime className="mr-1 text-xl" /> Running
          </Badge>
        ) : (
          <Badge className="!bg-danger text-white">
            <PiFlagCheckeredFill className="mr-1 text-xl" /> Cancelled
          </Badge>
        )}
      </div>
      {!isLoading && data?.stripe?.renewCancelAt !== null && (
        <div className="flex items-center justify-between font-medium">
          <span className="font-semibold">Subscription Cancel At</span>{' '}
          <span className="text-danger">{getFormatDateByTimezone(data?.stripe?.renewCancelAt, timezone)}</span>
        </div>
      )}
      {!data?.stripe?.renewCancelAt && (
        <div className="flex items-center justify-between font-medium">
          {data?.enrollStatus === 'trial' ? (
            <span className="font-semibold">{'Expired At'}</span>
          ) : (
            <span className="font-semibold">{'Next Invoice'}</span>
          )}
          {isLoading || isError ? (
            <Skeleton className="h-6 w-32 rounded" />
          ) : (
            <span>
              {data?.enrollStatus === 'trial' && data?.enrollSubscriptions[0]?.unlimitedFieldName
                ? data?.enrollSubscriptions[0]?.unlimitedFieldName
                : getFormatDateByTimezone(data?.validityTo, timezone)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
