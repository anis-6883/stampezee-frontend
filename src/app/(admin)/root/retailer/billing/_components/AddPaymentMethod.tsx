import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import React, { useState } from 'react';

const AddPaymentMethod: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [country, setCountry] = useState(''); // Store the selected country
  const [defaultPayment, setDefaultPayment] = useState(false); // Store default payment method status

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet.
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement as StripeCardElement,
        billing_details: {
          address: {
            country: country || undefined, // Optional country field
          },
        },
      });

      if (error) {
        setError(error.message || 'An error occurred');
      } else {
        // Example API call to save the payment method
        const response = await fetch('/save-payment-method', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            customerId: 'your-customer-id', // Replace with actual customer ID
            setAsDefault: defaultPayment,
          }),
        });

        if (response.ok) {
          setSuccess(true);
        } else {
          setError('Failed to save payment method.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
    >
      <h2>Add a Payment Method</h2>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Card Number</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <label>Expiration Date</label>
          <input type="text" placeholder="MM / YY" style={{ width: '100%', padding: '8px', fontSize: '16px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Security Code</label>
          <input type="text" placeholder="CVC" style={{ width: '100%', padding: '8px', fontSize: '16px' }} />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Country</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ width: '100%', padding: '8px', fontSize: '16px' }}>
          <option value="">Select your country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="BD">Bangladesh</option>
          {/* Add more countries as needed */}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={defaultPayment}
            onChange={(e) => setDefaultPayment(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Use as default payment method
        </label>
      </div>

      <div style={{ fontSize: '12px', color: '#555', marginBottom: '16px' }}>
        By providing your card information, you allow this service to charge your card for future payments in accordance with their terms.
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#e53e3e',
          color: '#fff',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isLoading ? 'Adding...' : 'Add'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '10px' }}>Payment method added successfully!</div>}
    </form>
  );
};

export default AddPaymentMethod;
