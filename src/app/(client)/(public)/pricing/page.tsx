import PricingCards from '../components/PricingCards';

export default function page() {
  const pricingDAta = [
    {
      _id: '1',
      plan_name: 'Basic Plan',
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
    {
      _id: '5',
      plan_name: 'Starter Plan',
      pricing: 19.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: [
        'Dedicated account manager and 24/7 support',
        '25 GB storage',
        'Ticket support system',
        'Basic reporting',
        'Dedicated account manager and 24/7 support',
        '25 GB storage',
        'Ticket support system',
        'Basic reporting',
      ],
    },
    {
      _id: '6',
      plan_name: 'Standard Plan',
      pricing: 39.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: ['Dedicated account manager and 24/7 support', '75 GB storage', 'Email support', 'Standard analytics'],
    },
    {
      _id: '7',
      plan_name: 'Professional Plan',
      pricing: 69.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: ['Dedicated account manager and 24/7 support', '150 GB storage', 'Phone support', 'Advanced reporting'],
    },
    {
      _id: '8',
      plan_name: 'Premium Plus Plan',
      pricing: 129.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: [
        'Dedicated account manager and 24/7 support',
        '300 GB storage',
        'Priority email and phone support',
        'Customizable dashboard',
      ],
    },
    {
      _id: '9',
      plan_name: 'Ultimate Plan',
      pricing: 199.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: [
        'Dedicated account manager and 24/7 support',
        'Unlimited storage',
        '24/7 chat and phone support',
        'Advanced analytics and security',
      ],
    },
    {
      _id: '10',
      plan_name: 'Small Business Plan',
      pricing: 59.99,
      currency: 'USD',
      duration: 'monthly',
      package_information: [
        'Dedicated account manager and 24/7 support',
        '100 GB storage',
        'Email and chat support',
        'Customizable reports',
      ],
    },
  ];

  return (
    <div>
      <div className="relative mx-auto w-full">
        <img src="default/pricing-hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
        <div className="pricing-hero absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%] sm:absolute">
              <div className="text-center text-[3rem]  font-bold leading-10 text-[#DF2828] sm:text-left md:text-[4rem]">
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
                <span style={{ opacity: 1, transform: 'none' }}>x</span>
                <span style={{ opacity: 1, transform: 'none' }}>p</span>
                <span style={{ opacity: 1, transform: 'none' }}>l</span>
                <span style={{ opacity: 1, transform: 'none' }}>o</span>
                <span style={{ opacity: 1, transform: 'none' }}>r</span>
                <span style={{ opacity: 1, transform: 'none' }}>e</span>
              </div>
              <br />
              <div className="flex gap-3 text-[1rem] font-bold	leading-10	text-white md:text-[3rem]">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>our</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Subscription</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>and</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>Add-on</span>
                </div>
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>
      <div className=" ms-px-0 container mx-auto mt-16 max-w-screen-xl px-5">
        <div className="mx-auto  text-start">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Subscriptions</h2>
          <p className="mb-4 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Our Plans</p>
        </div>

        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl">
            <div className=" space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
              {pricingDAta.map((item: any) => (
                <PricingCards key={item._id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
