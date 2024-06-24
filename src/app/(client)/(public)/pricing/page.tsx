import { SubscriptionHome } from './component/SubscriptionHome';

export default function page() {
  const pricingDAta = [
    {
      _id: '1',
      plan_name: 'Free Plan',
      pricing: 29.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: ['Dedicated account manager and 24/7 support', '50 GB storage', 'Ticket support system', 'Basic analytics'],
    },
    {
      _id: '2',
      plan_name: 'Premium Plan',
      pricing: 49.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: ['Dedicated account manager and 24/7 support', '100 GB storage', 'Priority email support', 'Advanced analytics'],
    },
    {
      _id: '3',
      plan_name: 'Business Plan',
      pricing: 79.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: ['Dedicated account manager and 24/7 support', '250 GB storage', 'Phone support', 'Custom reports'],
    },
    {
      _id: '4',
      plan_name: 'Enterprise Plan',
      pricing: 99.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: [
        'Dedicated account manager and 24/7 support',
        '500 GB storage',
        '24/7 chat support',
        'Advanced security features',
      ],
    },
  ];

  return (
    <div>
      <SubscriptionHome />
    </div>
  );
}
