import Button from '@/components/Formik/Button';
import RadioInput from '@/components/ui/RadioInput';
import { Skeleton } from '@/components/ui/skeleton';
import { SerializedError } from '@/features/api/apiSlice';
import { useChangePaymentMethodMutation } from '@/features/retailer/billing/billingApi';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiPlus } from 'react-icons/hi2';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDoNotDisturb } from 'react-icons/md';
import { ActionIcon, Modal } from 'rizzui';

const cardImageMap: any = {
  visa: '/images/visa.svg',
  mastercard: '/images/mastercard.svg',
  amex: '/images/amex.svg',
  default: '/images/default-card.svg',
};

export function ChangePaymentMethodModal({
  modalState = false,
  setModalState,
  isLoading = false,
  allPaymentMethod,
  subscriptionId,

  setAddPaymentCardModal,
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  isLoading: boolean;
  allPaymentMethod: any;
  subscriptionId: string;
  setAddPaymentCardModal: any;
}) {
  const t6 = useTranslations('RetailerBillingPaymentCard');
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<any>({});
  const [changePaymentMethodSubmitting, setChangePaymentMethodSubmitting] = useState(false);

  const [
    changePaymentMethod,
    { error: changePaymentMethodError, isSuccess: changePaymentMethodSuccess, isError: isChangePaymentMethodError },
  ] = useChangePaymentMethodMutation();

  const handleSelectPaymentMethod = (paymentMethod: any) => {
    setSelectPaymentMethod(paymentMethod);
  };

  const handleChangePaymentMethod = async () => {
    setChangePaymentMethodSubmitting(true);
    await changePaymentMethod({ paymentMethodId: selectPaymentMethod?.id, subscriptionId: subscriptionId });
  };

  // Handle change payment method Response
  useEffect(() => {
    if (isChangePaymentMethodError) {
      const myError = changePaymentMethodError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }
    if (changePaymentMethodSuccess) {
      toast.success('Change Payment card successfully!');
      setModalState(false);
      setSelectPaymentMethod({});
      setChangePaymentMethodSubmitting(false);
    }
  }, [changePaymentMethodError, changePaymentMethodSuccess, isChangePaymentMethodError, setModalState]);

  return (
    <Modal
      isOpen={modalState}
      onClose={() => {
        setSelectPaymentMethod({});
        setModalState(false);
      }}
      customSize="700px"
    >
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className=" text-xl font-bold text-black">{`Change Card`}</h2>
          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setSelectPaymentMethod({});
              setModalState(false);
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>

        <div className="my-4 flex items-center justify-end">
          <Button
            onClick={() => {
              setAddPaymentCardModal(true);
              setModalState(false);
            }}
            type="submit"
            className="!m-0 !px-2.5 !py-2"
            color="danger"
            text={t6('addNewCard')}
            preIcon={<HiPlus className="text-base" />}
          />
        </div>

        <div className=" space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          {isLoading ? (
            [1, 2, 3, 4]?.map((item) => <Skeleton key={item} className="h-10 w-60 rounded" />)
          ) : allPaymentMethod?.length === 0 ? (
            <div className="text-center text-base font-semibold text-black">{'No Card Available!'}</div>
          ) : (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-black">Select a Card</h2>
              {allPaymentMethod?.map((item: any) => (
                <div
                  key={item?.id}
                  className="mb-4 flex cursor-pointer items-center justify-between"
                  onClick={() => handleSelectPaymentMethod(item)}
                >
                  <div className=" flex items-center gap-4">
                    <RadioInput checked={selectPaymentMethod?.id === item?.id} onChange={() => {}} />
                    <img
                      src={cardImageMap.hasOwnProperty(item?.card?.brand) ? cardImageMap[item?.card?.brand] : cardImageMap['default']}
                      alt={'card'}
                      style={{ width: '50px', marginRight: '10px' }}
                    />
                    <div className="flex items-center justify-center">
                      <span className="text-base font-medium capitalize">{item?.card?.brand} </span>
                      <span className="text-center text-base font-medium capitalize"> ....{item?.card?.last4}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {allPaymentMethod?.length > 0 && (
            <div className="flex items-center justify-center gap-x-4">
              <Button
                onClick={handleChangePaymentMethod}
                disabled={!selectPaymentMethod?.id}
                type="submit"
                className="!m-0 !px-2.5 !py-2"
                color="danger"
                text={'Confirm'}
                preIcon={<BsCheck2Circle className="text-base" />}
                isSubmitting={changePaymentMethodSubmitting}
              />

              <Button
                color="danger"
                className="!m-0 !px-2.5 !py-2"
                onClick={() => {
                  setModalState(false);
                  setSelectPaymentMethod({});
                }}
                text={'Not Now'}
                postIcon={<MdDoNotDisturb className="text-base" />}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
