'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useDetachPaymentMethodMutation,
  useGetAllPaymentMethodQuery,
  useGetSinglePaymentMethodByIdQuery,
  useSetDefaultPaymentMethodMutation,
} from '@/features/retailer/billing/billingApi';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  const { data: session }: any = useSession();
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

  const validityToUtc = moment.tz(data?.validityTo, session?.user?.timezone?.label || '').utc();

  const filteredPaymentMethods = allPaymentMethod?.data?.filter((item: any) => item?.id !== paymentMethod?.data?.id);

  const [
    setDefaultPaymentMethod,
    { error: defaultPaymentMethodError, isSuccess: defaultPaymentMethodSuccess, isError: isDefaultPaymentMethodError },
  ] = useSetDefaultPaymentMethodMutation();

  const [
    detachPaymentMethod,
    { error: detachPaymentMethodError, isSuccess: detachPaymentMethodSuccess, isError: isDetachPaymentMethodError },
  ] = useDetachPaymentMethodMutation();

  const handleSetDefaultPaymentMethod = async ({ paymentMethodId, customerId }: { paymentMethodId: string; customerId: string }) => {
    await setDefaultPaymentMethod({ paymentMethodId, customerId });
  };

  const handleDetachPaymentMethod = async (paymentMethodId: string) => {
    await detachPaymentMethod({ paymentMethodId });
  };

  // Handle default payment method Response
  useEffect(() => {
    if (isDefaultPaymentMethodError) {
      const myError = defaultPaymentMethodError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }
    if (defaultPaymentMethodSuccess) {
      toast.success('Add default card successfully!');
    }
  }, [defaultPaymentMethodError, isDefaultPaymentMethodError, defaultPaymentMethodSuccess]);

  // Handle detach payment method Response
  useEffect(() => {
    if (isDetachPaymentMethodError) {
      const myError = detachPaymentMethodError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }
    if (detachPaymentMethodSuccess) {
      toast.success('Delete card successfully!');
    }
  }, [detachPaymentMethodError, detachPaymentMethodSuccess, isDetachPaymentMethodError]);

  return (
    <div className="h-48 space-y-6 rounded-xl border border-gray-200 px-5 py-6">
      <h2 className="border-b-[1px] pb-1 text-lg font-medium">{t6('paymentMethod')}</h2>

      {isLoading ? (
        [1]?.map((item) => <Skeleton key={item} className="h-10 w-60 rounded" />)
      ) : !paymentMethod?.data?.id ? (
        <div className="text-center text-base font-semibold text-black">{t6('noDataAvailable')}</div>
      ) : (
        <>
          {/* {[...paymentMethod?.data]?.map((item: any) => (
            <div key={item?.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={cardImageMap.hasOwnProperty(item?.card?.brand) ? cardImageMap[item?.card?.brand] : cardImageMap['default']}
                alt={'card'}
                style={{ width: '50px', marginRight: '10px' }}
              />
              <div className="flex items-center justify-center">
                <span className="text-base font-medium capitalize">{item?.card?.brand} </span>
                <span className="text-center text-base font-medium capitalize"> ....{item?.card?.last4}</span>
              </div>
              {allPaymentMethod?.data?.length > 1 ? (
                <>
                  {item?.isDefault ? (
                    <Badge className="ml-5 !bg-[#FF7C56] text-white">{t6('default')}</Badge>
                  ) : data?.status === true && moment().isBefore(validityToUtc) ? (
                    <Dropdown placement="bottom-start" className="ml-10">
                      <Dropdown.Trigger>
                        <BsThreeDotsVertical className=" text-base" />
                      </Dropdown.Trigger>
                      <Dropdown.Menu className="w-[170px]">
                        <Dropdown.Item
                          onClick={() => handleSetDefaultPaymentMethod({ paymentMethodId: item?.id, customerId: item?.customer })}
                          className="hover:bg-gray-200"
                        >
                          <div className="flex cursor-pointer items-center justify-center text-base">
                            <MdAddCard className=" text-base" />
                            <span className="ml-3 text-[14px] font-normal text-black">{t6('setAsDefault')}</span>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDetachPaymentMethod(item?.id)} className="hover:bg-gray-200">
                          <div className="flex cursor-pointer items-center justify-center text-base">
                            <RiDeleteBackLine className=" text-base" />
                            <span className="ml-3 text-[14px] font-normal text-black">Delete</span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : null}
                </>
              ) : (
                <></>
              )}
            </div>
          ))} */}

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
        </>
      )}

      {/* {data?.status === true && moment().isBefore(validityToUtc) && (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => setAddPaymentCardModal(true)}
            type="submit"
            className="!m-0 !px-2.5 !py-2"
            color="danger"
            text={t6('addNewCard')}
            preIcon={<HiPlus className="text-base" />}
          />
        </div>
      )} */}

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
