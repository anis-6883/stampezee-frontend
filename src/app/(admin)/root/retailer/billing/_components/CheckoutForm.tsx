import { useAttachPaymentMethodMutation } from '@/features/retailer/billing/billingApi';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [attachPaymentMethod] = useAttachPaymentMethodMutation();

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
        await attachPaymentMethod({ paymentMethodId: setupIntent.payment_method, customerId: 'cus_RCz82TruUZHQfB' });
        setMessage('Payment method added successfully!');
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      setMessage('An unexpected error occurred.');
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
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : 'Add'}</span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
};

export default CheckoutForm;
