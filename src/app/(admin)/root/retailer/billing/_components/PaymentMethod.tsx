'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllPaymentMethodQuery, useGetSinglePaymentMethodByIdQuery } from '@/features/retailer/billing/billingApi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GiCardExchange } from 'react-icons/gi';
import AddPaymentCardModal from './AddPaymentCardModal';
import { ChangePaymentMethodModal } from './ChangePaymentMethodModal';

const cardImageMap: any = {
  visa: '/images/visa.svg',
  mastercard: '/images/mastercard.svg',
  amex: '/images/amex.svg',
  default: '/images/default-card.svg',
};

export function PaymentMethod({ data, stripePublishKey }: { data: any; stripePublishKey: string }) {
  const t6 = useTranslations('RetailerBillingPaymentCard');
  const [addPaymentCardModal, setAddPaymentCardModal] = useState(false);
  const [changePaymentMethodModal, setChangePaymentMethodModal] = useState(false);
  const { data: allPaymentMethod, isLoading: isAllPaymentMethod } = useGetAllPaymentMethodQuery(
    {
      customerId: data?.stripe?.customerId,
      limit: 10,
    },
    { skip: !data?.stripe?.customerId }
  );

  const { data: paymentMethod, isLoading } = useGetSinglePaymentMethodByIdQuery(data?.stripe?.paymentMethodId, {
    skip: !data?.stripe?.paymentMethodId,
  });

  const filteredPaymentMethods = allPaymentMethod?.data?.filter((item: any) => item?.id !== paymentMethod?.data?.id);

  return (
    <div className="h-48 space-y-6 rounded-xl border border-gray-200 px-5 py-6">
      <h2 className="border-b-[1px] pb-1 text-lg font-medium">{t6('paymentMethod')}</h2>

      {isLoading ? (
        [1]?.map((item) => <Skeleton key={item} className="h-10 w-60 rounded" />)
      ) : !paymentMethod?.data?.id ? (
        <div className="text-center text-base font-semibold text-black">{t6('noDataAvailable')}</div>
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

      <div className="flex items-center justify-end">
        <Button
          onClick={() => setChangePaymentMethodModal(true)}
          type="submit"
          className="!m-0 !px-2.5 !py-2"
          color="danger"
          text={'Change Card'}
          preIcon={<GiCardExchange className="text-base" />}
        />
      </div>

      <AddPaymentCardModal
        modalState={addPaymentCardModal}
        setModalState={setAddPaymentCardModal}
        customerId={data?.stripe?.customerId}
        stripePublishKey={stripePublishKey}
        subscriptionId={data?.stripe?.subscriptionId}
      />

      <ChangePaymentMethodModal
        modalState={changePaymentMethodModal}
        setModalState={setChangePaymentMethodModal}
        isLoading={isAllPaymentMethod}
        allPaymentMethod={filteredPaymentMethods}
        subscriptionId={data?.stripe?.subscriptionId}
        setAddPaymentCardModal={setAddPaymentCardModal}
      />
    </div>
  );
}
