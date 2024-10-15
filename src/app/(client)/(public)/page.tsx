import { routes } from '@/config/routes';
import 'aos/dist/aos.css';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HeroCard } from './components/HeroCard';
import Image from './components/Image';
import Testimonial from './components/Testimonial';
import WorksCard from './components/WorksCard';

export default function Page() {
  const t = useTranslations('HomePage');

  return (
    <div className="relative overflow-hidden">
      {/* rgba(22, 28, 36, 0.8),  */}
      <div className="hero-curve  relative mx-auto mt-28 w-full sm:mt-10">
        <div className="h-[107vh] w-full  bg-[#FF3131] sm:h-[85vh]"></div>
        <div className="absolute inset-0"></div>
        <div className="container absolute top-[60px] mx-auto flex max-w-screen-xl items-center px-4 sm:inset-0 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row">
            <div className="w-full p-3 text-center sm:w-full md:w-[50%] md:text-left">
              <div className="flex flex-col gap-y-3 sm:gap-y-6">
                <h1 className="text-3xl font-semibold text-white sm:text-7xl">Revolutionize</h1>
                <h1 className="text-3xl font-semibold text-white sm:text-7xl">Your Customer </h1>
                <h1 className="text-3xl font-semibold text-white sm:text-7xl">Experience</h1>
              </div>
              <p className="mt-4 text-balance py-7 text-base font-medium text-white sm:text-xl">{t('bannerDetails')}</p>
              <div className="mt-8">
                <Link
                  href={routes.publicRoutes.pricing}
                  className="dark:bg-primary-red rounded-full bg-white px-8 py-4 text-lg font-semibold text-black duration-300 ease-in-out focus:outline-none dark:hover:bg-[#454F5B] sm:text-2xl"
                >
                  {t('bannerButtonText')}
                </Link>
              </div>
            </div>
            {/* <div className=" mt-10 justify-center sm:mt-0 sm:w-1/2 md:flex lg:flex">
              <div className=" h-[55%] w-[55%] xl:h-[70%] xxl:w-[70%]">
                <Image src="/default/hero-image.png" alt="hero image" className=" h-full w-full" />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <HeroCard />

      {/* How It Works start */}
      <section id="how_work" className=" works-curve bg-[#FCE8E8] py-10">
        <div className="container mx-auto block  max-w-screen-xl px-4">
          <div className="text-primary-black my-7 text-center text-3xl font-bold sm:text-4xl">{t('workMainTitle')}</div>
          <div className=" items-center justify-between md:flex">
            <WorksCard
              image="/default/flex.svg"
              title={'UNMATCHED'}
              subTitle="FLEXIBILITY
"
              description={'Foster strong, lasting'}
              subDescription="customer relationships."
            />
            <WorksCard
              image="/default/simple.svg"
              title={'SIMPLICITY AT'}
              subTitle="HAND"
              description={'User-friendly, seamless'}
              subDescription="interface."
            />
            <WorksCard
              image="/default/data.svg"
              title={'DATA'}
              subTitle="EMPOWERMENT"
              description={'Make growth-driving,'}
              subDescription="informed decisions."
            />
          </div>
        </div>
      </section>
      {/* How It Works end */}

      {/* TESTIMONIALS start */}

      <div>
        <div className="mt-5 text-center">
          <p className="text-primary-black mb-7 text-[1.2rem] font-[600] leading-8">{t('testimonials')}</p>
          <div className="text-primary-black mb-7 text-center text-3xl font-bold sm:text-4xl">{t('testimonialMainTitle')}</div>
        </div>

        <div className="container mx-auto mb-8 grid max-w-screen-xl grid-cols-1  gap-3 p-3 md:grid-cols-2 md:p-0 lg:grid-cols-3">
          <Testimonial
            image={'/default/olivia.png'}
            name={t('testimonialTitleOne')}
            position={t('testimonialSubTitleOne')}
            description={t('testimonialDescriptionOne')}
          />
          <Testimonial
            image={'/default/aaron.png'}
            name={t('testimonialTitleTwo')}
            position={t('testimonialSubTitleTwo')}
            description={t('testimonialDescriptionTwo')}
          />
          <Testimonial
            image={'/default/symon.png'}
            name={t('testimonialTitleThree')}
            position={t('testimonialSubTitleThree')}
            description={t('testimonialDescriptionThree')}
          />
        </div>
      </div>

      {/* TESTIMONIALS end */}

      {/* Revolution Card Start  */}
      <div className="m-2 sm:m-0">
        <div className="container mx-auto  mb-9 max-w-screen-xl rounded-3xl bg-gradient-to-r from-[#BA0000] to-[#FB7C7C] px-10 py-8">
          <div className="flex flex-col items-center gap-y-6">
            <span className="text-base font-semibold uppercase tracking-widest text-[#000000] sm:text-xl">
              Ready to transform your customer experience?
            </span>
            <span className="text-3xl font-bold tracking-widest text-[#ffffff] sm:text-5xl">Join The Digital Loyal</span>
            <span className="text-3xl font-bold tracking-widest text-[#ffffff] sm:text-5xl">Revolution Now!</span>
            <div className="mb-3 mt-8">
              <Link
                href={routes.publicRoutes.pricing}
                className="dark:bg-primary-red rounded-full bg-white px-8 py-4 text-lg font-semibold uppercase tracking-widest text-black duration-300 ease-in-out focus:outline-none dark:hover:bg-[#454F5B] sm:text-2xl"
              >
                Get started now!
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Revolution Card End  */}
      <div className="absolute right-[-15rem] top-[35rem] mt-10 justify-center sm:right-60 sm:top-32 sm:mt-0 sm:w-1/2 md:flex lg:flex">
        <div className=" h-[40%] w-[40%] xl:h-[50%] xxl:w-[50%]">
          <Image src="/default/hero-image.png" alt="hero image" className=" h-full w-full" />
        </div>
      </div>
    </div>
  );
}
