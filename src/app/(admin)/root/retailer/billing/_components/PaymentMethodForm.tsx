import Button from '@/components/Formik/Button';
import { useAttachPaymentMethodMutation } from '@/features/retailer/billing/billingApi';
import useResponsiveFontSize from '@/hooks/useResponsiveFontSize';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentMethodResult, StripeCardElementChangeEvent, StripeCardNumberElement } from '@stripe/stripe-js';
import React, { useMemo } from 'react';
import { HiPlus } from 'react-icons/hi2';

const useOptions = (): { style: { base: object; invalid: object } } => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const PaymentMethodForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const [attachPaymentMethod] = useAttachPaymentMethodMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardNumberElement) as StripeCardNumberElement;

    const payload: PaymentMethodResult = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      customer_balance: {},
    });

    const res = await attachPaymentMethod({ paymentMethodId: payload?.paymentMethod?.id, customerId: 'cus_RCz82TruUZHQfB' });

    console.log('res', res);

    console.log('[PaymentMethod]', payload);
  };

  const handleChange = (event: StripeCardElementChangeEvent) => {
    console.log('Card element changed:', event);
  };

  return (
    <form className="m-auto w-full bg-gray-100 p-4" onSubmit={handleSubmit}>
      <label className="stripe-label">
        Card number
        <CardNumberElement
          options={options}
          onReady={() => {
            console.log('CardNumberElement [ready]');
          }}
          onBlur={() => {
            console.log('CardNumberElement [blur]');
          }}
          onFocus={() => {
            console.log('CardNumberElement [focus]');
          }}
        />
      </label>
      <label className="stripe-label">
        Expiration date
        <CardExpiryElement
          options={options}
          onReady={() => {
            console.log('CardExpiryElement [ready]');
          }}
          onBlur={() => {
            console.log('CardExpiryElement [blur]');
          }}
          onFocus={() => {
            console.log('CardExpiryElement [focus]');
          }}
        />
      </label>
      <label className="stripe-label">
        CVC
        <CardCvcElement
          options={options}
          onReady={() => {
            console.log('CardCvcElement [ready]');
          }}
          onBlur={() => {
            console.log('CardCvcElement [blur]');
          }}
          onFocus={() => {
            console.log('CardCvcElement [focus]');
          }}
        />
      </label>
      {/* <button className="pay-button" type="submit" disabled={!stripe}>
        Add Payment Method
      </button> */}
      <Button type="submit" className="!m-0" color="danger" text="Add Payment Method" preIcon={<HiPlus className="text-base" />} />
    </form>
  );
};

export default PaymentMethodForm;
