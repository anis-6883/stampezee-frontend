import { metaObject } from '@/config/site.config';
import 'aos/dist/aos.css';
import { HeroCard } from './components/HeroCard';
import Image from './components/Image';
import Testimonial from './components/Testimonial';
import WorksCard from './components/WorksCard';

export const metadata = {
  ...metaObject('Home Page'),
};

export default async function Page() {
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
