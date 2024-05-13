import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import Featured from './components/Featured';
import Image from './components/Image';
import Testimonial from './components/Testimonial';
import WorksCard from './components/WorksCard';

export const metadata = {
  ...metaObject('Home Page'),
};

export default async function Page() {
  return (
    <div>
      {/* rgba(22, 28, 36, 0.8),  */}
      <div className="relative mx-auto w-full">
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

                <Link
                  href="/"
                  className={`dark:hover:bg[#454F5B] rounded-full bg-white 
                p-3 px-[40px]   py-[20px] text-center text-2xl font-bold text-black duration-300 ease-in-out focus:outline-none  dark:bg-primary-red `}
                >
                  GET STARTED
                </Link>
              </div>
              <div className="w-0 sm:w-1/2">
                <Image src="/default/hero-image.png" alt="hero image" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 md:p-0">
        <Featured
          image="/default/why-stamp.png"
          title="Why choose StampEzee?"
          description=" Digitalization has transformed the way businesses interact with their customers. Our platform combines intuitive design, robust
        analytics, and unparalleled customization, bringing you the ultimate tool for customer engagement."
          bgHeight="py-20"
        />
        <Featured
          imagePosition="right"
          image="/default/empower.png"
          title="Empower Customer Retention"
          description="In today's competitive market, customer retention is key. StampEzee fosters loyalty and encourages repeat business. More than a rewards system, our platform amplifies your brand engagement, nurturing long-lasting customer relationships."
          bgHeight="py-20"
        />
      </div>
      {/* How It Works start */}
      <div className=" bg-[#FCE8E8] py-10">
        <div className="container mx-auto px-4">
          <div className="mb-7 text-center text-5xl font-bold text-primary-black">How It Works?</div>
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
      </div>
      {/* How It Works end */}
      {/* TESTIMONIALS start */}
      <div>
        <div>
          <div className="text-center">
            <p className="mb-7 text-[1.2rem] font-[600] leading-8 text-primary-black">TESTIMONIALS</p>
            <div className="mb-7 text-center text-5xl font-bold text-primary-black">Read What Others Have to Say</div>
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
