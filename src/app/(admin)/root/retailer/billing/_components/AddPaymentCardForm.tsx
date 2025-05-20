import Button from '@/components/Formik/Button';
import { useAttachPaymentMethodMutation, useChangePaymentMethodMutation } from '@/features/retailer/billing/billingApi';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { ImSpinner9 } from 'react-icons/im';

const AddPaymentCardForm = ({
  setModalState,
  setClientSecret,
  customerId,
  subscriptionId,
}: {
  setModalState: any;
  setClientSecret: any;
  customerId: string;
  subscriptionId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [attachPaymentMethod] = useAttachPaymentMethodMutation();
  const [
    changePaymentMethod,
    { error: changePaymentMethodError, isSuccess: changePaymentMethodSuccess, isError: isChangePaymentMethodError },
  ] = useChangePaymentMethodMutation();
  const [message, setMessage] = useState<string | null>(null); // state for message, which can be a string or null
  const [isLoading, setIsLoading] = useState<boolean>(false); // state for loading, which is a boolean

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Ensure that Stripe.js has loaded
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { setupIntent, error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          // Pass a return URL if needed, or leave this empty if not required.
          return_url: '',
        },
        redirect: 'if_required',
      });

      if (error) {
        // Handle error and show error message to the user
        setMessage(error.message || 'An error occurred while saving your payment method.');
      } else if (setupIntent) {
        // Optionally call your API to attach the payment method if needed
        await attachPaymentMethod({ paymentMethodId: setupIntent.payment_method, customerId });
        await changePaymentMethod({ paymentMethodId: setupIntent.payment_method, subscriptionId: subscriptionId });
        setMessage('Payment method added successfully!');
        toast.success('Payment method added successfully!');
        setModalState(false);
        setClientSecret('');
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      setMessage('An unexpected error occurred.');
      toast.error('Something went wrong!');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const, // ensures that `layout` is treated as a constant value
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div className="flex items-center justify-end">
          <Button
            disabled={isLoading || !stripe || !elements}
            type="submit"
            className="!mt-4 !px-3 !py-2"
            color="danger"
            text="Submit"
            postIcon={isLoading ? <ImSpinner9 className="animate-spin text-lg" /> : <BsCheck2Circle className="text-base" />}
          />
        </div>
      </form>
    </>
  );
};

export default AddPaymentCardForm;
