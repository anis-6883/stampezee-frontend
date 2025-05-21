'use client';

import Button from '@/components/Formik/Button';
import { Currency } from '@/config';
import { useRetailerUpdateProfileMutation } from '@/features/auth/authApi';
import { setUserCurrency } from '@/services/currency';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal } from 'rizzui';

export default function CurrencyConvertModal({
  modalState = false,
  setModalState,
  paymentCurrency,
  selectedCurrency,
  setIsCurrencyModalOpen,
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  paymentCurrency: Currency;
  selectedCurrency: string;
  setIsCurrencyModalOpen: (state: boolean) => void;
}) {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retailerUpdateProfile, { data: updateRetailerProfile, isSuccess, error, isError }] = useRetailerUpdateProfileMutation();

  const convertCurrencyHandler = async () => {
    setIsSubmitting(true);
    await retailerUpdateProfile({ businessCurrency: paymentCurrency });
  };

  useEffect(() => {
    if (isError) {
      setIsSubmitting(false);
      toast.error('Something went wrong. Please try again!');
    }
    if (isSuccess) {
      setIsSubmitting(false);
      toast.success('Successfully change currency!');
      update({ ...session?.user, ...updateRetailerProfile?.data });
      setUserCurrency(paymentCurrency);
      setModalState(false);
      setIsCurrencyModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess]);

  return (
    <Modal
      isOpen={modalState}
      onClose={() => {
        setModalState(false);
        setIsCurrencyModalOpen(false);
      }}
    >
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">{'Currency Change Alert!'}</h3>

          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
              setIsCurrencyModalOpen(false);
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">
          {`You currently have active subscription paid in ${paymentCurrency}.
You're now attempting to pay in ${selectedCurrency}, which isn't supported by Stripe for this transaction.
`}
        </p>

        <div className="mt-10 flex justify-end gap-2">
          <Button
            color="danger"
            onClick={convertCurrencyHandler}
            text={`Change currency to ${paymentCurrency}`}
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
