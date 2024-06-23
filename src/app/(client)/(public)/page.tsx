import { metaObject } from '@/config/site.config';
import 'aos/dist/aos.css';
import { HeroCard } from './components/HeroCard';
import Image from './components/Image';
import PricingCards from './components/PricingCards';
import Testimonial from './components/Testimonial';
import WorksCard from './components/WorksCard';

export const metadata = {
  ...metaObject('Home Page'),
};

export default async function Page() {
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
    <div className="overflow-hidden">
      {/* rgba(22, 28, 36, 0.8),  */}
      <div className="relative mx-auto mt-10  w-full">
        <div className="h-[63vh] w-full bg-red-500 object-cover sm:h-[97vh]"></div>
        <div className=" absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center ">
            <div className="absolute flex w-full items-center justify-between">
              <div className="sm-p-0 w-full p-3 text-center sm:w-1/2 sm:text-left">
                <h1 className="text-center text-4xl font-bold text-white sm:text-left sm:text-6xl">
                  Revolutionize Your Customer Experience
                </h1>
                <br />
                <div className="flex gap-3 text-4xl font-bold text-white sm:text-6xl">
                  <p className="mt-2 text-lg font-medium">
                    Engage, reward, and retain your customers with a touch of simplicity and technology and bring the future of loyalty
                    programs to your business.
                  </p>
                </div>
                <br />
                <br />
                <div className="MuiStack-root css-plpzdo" />

                <a
                  href="/"
                  className="dark:bg-primary-red rounded-full bg-white px-[40px] py-[20px] text-2xl font-bold text-black duration-300 ease-in-out focus:outline-none dark:hover:bg-[#454F5B] sm:w-full sm:max-w-md"
                >
                  GET STARTED
                </a>
              </div>
              <div className="mt-6 hidden w-full justify-center sm:mt-0 sm:w-1/2 lg:flex">
                <div className="h-[70%] w-[70%]">
                  <Image src="/default/hero-image.png" alt="hero image" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroCard />

      {/* How It Works start */}
      <section id="how_work" className=" bg-[#FCE8E8] py-10">
        <div className="container mx-auto px-4">
          <div className="text-primary-black mb-7 text-center text-5xl font-bold">How It Works?</div>
          <div className=" block items-center justify-between md:flex">
            <WorksCard
              image="/default/flex.svg"
              title="UNMATCHED FLEXIBILITY"
              description="Foster strong, lasting customer relationships."
            />
            <WorksCard image="/default/simple.svg" title="SIMPLICITY AT HAND" description="User-friendly, seamless interface." />
            <WorksCard image="/default/data.svg" title="SIMPLICITY AT HAND" description="Make growth-driving, informed decisions." />
          </div>
        </div>
      </section>
      {/* How It Works end */}

      {/* price section */}
      <section id="price" className="overflow-hidden">
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

          <section className="overflow-hidden bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-screen-xl">
              <div className=" space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
                {pricingDAta.map((item: any) => (
                  <PricingCards key={item._id} item={item} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* TESTIMONIALS start */}
      <div>
        <div>
          <div className="mt-5 text-center">
            <p className="text-primary-black mb-7 text-[1.2rem] font-[600] leading-8">TESTIMONIALS</p>
            <div className="text-primary-black mb-7 text-center text-5xl font-bold">Read What Others Have to Say</div>
          </div>
          <div>
            <div className="container mx-auto grid max-w-screen-xl grid-cols-1  gap-3 p-3 md:grid-cols-2 md:p-0 lg:grid-cols-3">
              <Testimonial
                image={'/default/olivia.png'}
                name="OLIVIA COLE"
                position="Restaurant Manager"
                description={`StampEzee has been a game changer for our business. The convenience it offers our customers, coupled with the insights we've
              gained, has truly elevated our operations.`}
              />
              <Testimonial
                image={'/default/aaron.png'}
                name="OLIVIA COLE"
                position="Restaurant Manager"
                description={`StampEzee has been a game changer for our business. The convenience it offers our customers, coupled with the insights we've
              gained, has truly elevated our operations.`}
              />
              <Testimonial
                image={'/default/symon.png'}
                name="OLIVIA COLE"
                position="Restaurant Manager"
                description={`StampEzee has been a game changer for our business. The convenience it offers our customers, coupled with the insights we've
              gained, has truly elevated our operations.`}
              />
            </div>
          </div>
        </div>
      </div>
      {/* TESTIMONIALS end */}
    </div>
  );
}
