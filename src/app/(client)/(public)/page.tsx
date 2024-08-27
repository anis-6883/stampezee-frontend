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
    <div className="overflow-hidden">
      {/* rgba(22, 28, 36, 0.8),  */}
      <div className="relative mx-auto mt-10 w-full">
        <div className="h-[95vh] w-full bg-red-500 object-cover sm:h-[97vh]"></div>
        <div className="absolute inset-0"></div>
        <div className="absolute inset-0 mx-auto flex max-w-screen-xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row">
            <div className="w-full p-3 text-center sm:w-full md:w-[50%] md:text-left">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{t('bannerTitle')}</h1>
              <p className="mt-4 text-balance text-base font-medium text-white sm:text-xl">{t('bannerDetails')}</p>
              <div className="mt-8">
                <Link
                  href={routes.publicRoutes.pricing}
                  className="dark:bg-primary-red rounded-full bg-white px-8 py-4 text-lg font-semibold text-black duration-300 ease-in-out focus:outline-none dark:hover:bg-[#454F5B] sm:text-2xl"
                >
                  {t('bannerButtonText')}
                </Link>
              </div>
            </div>
            <div className="mt-10 hidden justify-center sm:mt-0 sm:w-1/2 md:flex lg:flex">
              <div className="h-[55%] w-[55%] xl:h-[70%] xxl:w-[70%]">
                <Image src="/default/hero-image.png" alt="hero image" className="h-full w-full " />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroCard />

      {/* How It Works start */}
      <section id="how_work" className=" bg-[#FCE8E8] py-10">
        <div className="container mx-auto px-4">
          <div className="text-primary-black mb-7 text-center text-3xl font-bold sm:text-4xl">{t('workMainTitle')}</div>
          <div className=" block items-center justify-between md:flex">
            <WorksCard image="/default/flex.svg" title={t('workTitleOne')} description={t('workDescriptionOne')} />
            <WorksCard image="/default/simple.svg" title={t('workTitleTwo')} description={t('workDescriptionTwo')} />
            <WorksCard image="/default/data.svg" title={t('workTitleThree')} description={t('workDescriptionThree')} />
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

        <div className="container mx-auto grid max-w-screen-xl grid-cols-1  gap-3 p-3 md:grid-cols-2 md:p-0 lg:grid-cols-3">
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
    </div>
  );
}
