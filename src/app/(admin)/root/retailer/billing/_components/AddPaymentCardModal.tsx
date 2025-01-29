'use client';

import { useSetupPaymentIntentMutation } from '@/features/retailer/billing/billingApi';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal, Title } from 'rizzui';
import AddPaymentCardForm from './AddPaymentCardForm';

export default function AddPaymentCardModal({
  modalState,
  setModalState,
  customerId,
  stripePublishKey,
}: {
  customerId: string;
  stripePublishKey: string;
  modalState: boolean;
  setModalState: (state: boolean) => void;
}) {
  const [clientSecret, setClientSecret] = useState('');
  const appearance: { theme: 'flat' | 'stripe' | 'night' } = {
    theme: 'stripe',
  };

  const loader = 'auto';

  const [setupPaymentIntent, { data: paymentIntent }] = useSetupPaymentIntentMutation();

  const stripePromise = loadStripe(stripePublishKey);

  useEffect(() => {
    (async () => {
      const res: any = await setupPaymentIntent({});

      setClientSecret(res?.data?.data?.client_secret);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4">Add Payment Card</Title>
          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          {clientSecret && (
            <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
              <AddPaymentCardForm setModalState={setModalState} setClientSecret={setClientSecret} customerId={customerId} />
            </Elements>
          )}
        </div>
      </div>
    </Modal>
  );
}
