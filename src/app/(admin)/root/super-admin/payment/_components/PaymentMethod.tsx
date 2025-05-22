import { Skeleton } from '@/components/ui/skeleton';
import { useGetSinglePaymentMethodBySuperAdminQuery } from '@/features/super-admin/payment/paymentApi';

const cardImageMap: any = {
  visa: '/images/visa.svg',
  mastercard: '/images/mastercard.svg',
  amex: '/images/amex.svg',
  default: '/images/default-card.svg',
};
export function PaymentMethod({ data }: { data: any }) {
  const { data: paymentMethod, isLoading: isPaymentMethodLoading } = useGetSinglePaymentMethodBySuperAdminQuery(
    data?.stripe?.paymentMethodId,
    {
      skip: !data?.stripe?.paymentMethodId,
    }
  );

  return (
    <div className="h-40 space-y-6 rounded-xl border border-gray-200 px-5 py-6">
      <h2 className="border-b-[1px] pb-1 text-lg font-medium">Payment Methods</h2>

      {isPaymentMethodLoading ? (
        [1]?.map((item) => <Skeleton key={item} className="h-10 w-60 rounded" />)
      ) : !paymentMethod?.data?.id ? (
        <div className="text-center text-base font-semibold text-black">No Card Available</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img
            src={
              cardImageMap.hasOwnProperty(paymentMethod?.data?.card?.brand)
                ? cardImageMap[paymentMethod?.data?.card?.brand]
                : cardImageMap['default']
            }
            alt={'card'}
            style={{ width: '50px', marginRight: '10px' }}
          />
          <div className="flex items-center justify-center">
            <span className="text-base font-medium capitalize">{paymentMethod?.data?.card?.brand} </span>
            <span className="text-center text-base font-medium capitalize"> ....{paymentMethod?.data?.card?.last4}</span>
          </div>
        </div>
      )}
    </div>
  );
}
