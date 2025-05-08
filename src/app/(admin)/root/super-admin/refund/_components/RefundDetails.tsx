import { Skeleton } from '@/components/ui/skeleton';
import { useSingleRefundBySuperAdminQuery } from '@/features/super-admin/refund/refundApi';
import RefundForCancelled from './RefundForCancelled';
import RefundForDowngrade from './RefundForDowngrade';

export function RefundDetails({ id, timezone }: { id: string | null; timezone: string }) {
  const { isLoading, data: singleRefund } = useSingleRefundBySuperAdminQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-28 w-full" />
      </>
    );
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const retailerEmail = singleRefund?.data?.enrollment?.retailer?.email?.split(/[-\s]/)?.find((part: string) => emailRegex.test(part));
  return (
    <div className="h-[90dvh] space-y-4 overflow-auto pt-6">
      <div className="m-4 flex  justify-center rounded-lg border-2 p-6">
        <div className="flex w-[30%] flex-col justify-center gap-2 border-r-2">
          <div className="mx-auto">
            {singleRefund?.data?.enrollment?.retailer?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${singleRefund?.data?.enrollment?.retailer?.image}`}
                  alt="image"
                  className="h-full w-12 rounded"
                />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-full w-12 rounded" />
            )}
          </div>
          <div>
            <div className="text-md">
              <p className=" mr-1 text-center font-semibold">{singleRefund?.data?.enrollment?.retailer?.storeName}</p>
            </div>
          </div>
        </div>
        <div className="text-md ml-3 w-[70%] text-start">
          <p>
            <span className="break-all font-bold">Full name:</span>{' '}
            {`${singleRefund?.data?.enrollment?.retailer?.firstName} ${singleRefund?.data?.enrollment?.retailer?.lastName}`}
          </p>
          <p>
            <span className="font-bold">Email:</span> {retailerEmail}
          </p>
          <p>
            <span className="font-bold">Phone:</span>{' '}
            {singleRefund?.data?.enrollment?.retailer?.phone && singleRefund?.data?.enrollment?.retailer?.dialCode
              ? `${singleRefund?.data?.enrollment?.retailer?.dialCode}${singleRefund?.data?.enrollment?.retailer?.phone}`
              : 'N/A'}
          </p>
          <p>
            <span className="font-bold">Country:</span>{' '}
            {singleRefund?.data?.enrollment?.retailer?.country ? singleRefund?.data?.enrollment?.retailer?.country : 'N/A'}
          </p>
        </div>
      </div>

      {singleRefund?.data?.reason === 'downgrade' ? (
        <RefundForDowngrade data={singleRefund?.data} timezone={timezone} />
      ) : (
        <RefundForCancelled data={singleRefund?.data} timezone={timezone} />
      )}
    </div>
  );
}
