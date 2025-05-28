import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import 'aos/dist/aos.css';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { HeroCard } from './components/HeroCard';
import Image from './components/Image';
import Testimonial from './components/Testimonial';
import WorksCard from './components/WorksCard';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === ROLE.SUPER_ADMIN) {
    redirect(routes.privateRoutes.superAdmin.dashboard);
  }
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="relative overflow-hidden">
      {/* rgba(22, 28, 36, 0.8),  */}

      {/* hero banner */}
      <div className={`${isRtl ? 'hero-curve-rtr' : 'hero-curve'} relative mx-auto mt-[4.4rem] w-full sm:mt-10 md:mt-16`}>
        <div className="h-screen w-full  bg-[#FF3131] md:h-[70vh] lg:h-[74vh]  "></div>
        <div className="absolute inset-0"></div>
        <div
          className={`container absolute top-[60px] ${isRtl ? '' : 'mx-auto'} flex max-w-screen-xl items-center px-0 sm:inset-0 md:px-8 lg:px-10`}
        >
          <div className="flex w-full  flex-col-reverse items-center justify-between sm:flex-row-reverse lg:flex-row">
            <div className=" mt-2 block h-[60%] w-[60%] md:h-[50%]  md:w-[60%] lg:hidden  ">
              <Image src="/default/hero-image.png" alt="hero image" className=" h-full w-full object-contain" />
            </div>
            <div className="w-full p-3 text-center sm:w-full md:w-[50%] md:text-left">
              <div className="flex flex-col gap-y-1 md:gap-y-3 lg:gap-y-4 xl:gap-y-5 sxl:gap-y-6">
                {/* <h1 className="text-3xl font-semibold text-white md:text-4xl xl:text-5xl sxl:text-5xl">{t('bannerTitle')}</h1> */}
                <h1 className="text-3xl font-semibold text-white md:text-5xl xl:text-6xl sxl:text-7xl"> {t('revolutionize')}</h1>
                <h1 className="text-3xl font-semibold text-white md:text-5xl xl:text-6xl sxl:text-7xl"> {t('yourCustomer')}</h1>
                <h1 className="text-3xl font-semibold text-white md:text-5xl xl:text-6xl sxl:text-7xl">{t('experience')}</h1>
              </div>
              <p className="mt-1 text-balance py-2 text-base font-medium text-white sm:text-xl md:mt-2 md:py-3.5 lg:mt-3 lg:py-4 xl:py-4 xxl:mt-4 sxl:py-3">
                {t('bannerDetails')}
              </p>
              <div className="mt-5 md:mt-6 lg:mt-8">
                <Link
                  href={routes.publicRoutes.pricing}
                  className="dark:bg-primary-red md:text-md rounded-full bg-white px-6 py-2.5 text-base font-semibold uppercase text-black duration-300 ease-in-out focus:outline-none dark:hover:bg-[#454F5B] md:py-3 xl:px-8 xl:text-lg xxl:py-4 sxl:text-xl"
                >
                  {t('bannerButtonText')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* why choose section */}
      <HeroCard />

      {/* How It Works start */}
      <section id="how_we_work" className={`${isRtl ? 'works-curve-rtr' : 'works-curve'} bg-[#FCE8E8] px-5 py-10 md:px-8 lg:px-10`}>
        <div className="container mx-auto block  max-w-screen-xl gap-3 sm:gap-10">
          <div className="my-4 text-center text-3xl font-bold text-black md:my-6 md:text-5xl lg:my-7 lg:text-6xl sxl:text-7xl">
            {t('workMainTitle')}
          </div>
          <div className=" items-center justify-between md:flex">
            <WorksCard
              image="/default/flex.svg"
              title={t('workTitleOne')}
              subTitle={t('workSubtitleOne')}
              description={t('workDescriptionOne')}
              subDescription={t('workSubDescriptionOne')}
            />
            <WorksCard
              image="/default/simple.svg"
              title={t('workTitleTwo')}
              subTitle={t('workSubtitleTwo')}
              description={t('workDescriptionTwo')}
              subDescription={t('workSubDescriptionTwo')}
            />
            <WorksCard
              image="/default/data.svg"
              title={t('workTitleThree')}
              subTitle={t('workSubtitleThree')}
              description={t('workDescriptionThree')}
              subDescription={t('workSubDescriptionThree')}
            />
          </div>
        </div>
      </section>
      {/* How It Works end */}

      {/* TESTIMONIALS start */}
      <div>
        <div className=" mt-5 text-center">
          <p className="mb-3 text-lg font-semibold leading-8 text-black sm:text-3xl md:mb-5 lg:mb-6 sxl:mb-7">{t('testimonials')}</p>
          <div className="mb-3 text-center text-3xl font-bold text-black md:mb-5 md:text-5xl lg:mb-6 lg:text-6xl sxl:mb-7 sxl:text-7xl">
            {t('testimonialMainTitle')}
          </div>
          <div className="mb-3 text-center text-3xl font-bold text-black md:mb-5 md:text-5xl lg:mb-6 lg:text-6xl sxl:mb-7 sxl:text-7xl">
            {t('testimonialMainSubtitle')}
          </div>
        </div>

        <div className="container mx-auto mt-5 grid max-w-screen-xl grid-cols-1 gap-7 px-5 py-8 sm:mb-8 sm:gap-10 md:mt-16 md:grid-cols-2 md:p-0 md:px-8 lg:grid-cols-3 lg:px-10 xl:mt-[76px] sxl:mb-20 sxl:px-0">
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
      <div className="px-5 sm:m-0 md:px-8 lg:m-7 lg:px-10">
        <div className="container mx-auto max-w-screen-xl rounded-3xl bg-gradient-to-r from-[#BA0000] to-[#FB7C7C] px-8 py-8 lg:px-10">
          <div className="flex flex-col gap-y-3 md:items-center md:gap-y-5 lg:gap-y-6">
            <span className="text-base font-semibold uppercase tracking-widest text-[#000000] sm:text-xl">{t('revolutionTitle')}</span>
            <span className="text-2xl font-bold tracking-widest text-[#ffffff] sm:text-3xl md:text-4xl lg:text-5xl">
              {t('revolutionBodyTitle')}
            </span>
            <span className="text-2xl font-bold tracking-widest text-[#ffffff] sm:text-3xl md:text-4xl lg:text-5xl">
              {t('revolutionBodySubtitle')}
            </span>
            <div className="mb-3 mt-4 md:mt-6 lg:mt-8">
              <Link
                href={routes.publicRoutes.pricing}
                className="dark:bg-primary-red  rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black duration-300 ease-in-out focus:outline-none dark:hover:bg-[#454F5B] sm:px-8 md:py-4 md:text-lg lg:text-xl"
              >
                {t('revolutionButtonText')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Revolution Card End  */}
      {/* Hero Image Start */}

      <div
        className={`absolute ${isRtl ? 'left-[-15rem] top-[33rem] sm:left-56 sm:top-40 md:left-36 md:top-20 lg:left-10 lg:top-16 sxl:top-40' : 'right-[-15rem] top-[33rem] sm:right-60 sm:top-36 md:right-44 md:top-20 lg:right-0 lg:top-16 sxl:top-40'}  mt-10 items-center justify-center sm:mt-0 sm:w-1/2 md:flex lg:flex`}
      >
        <div className="hidden h-[40%] w-[40%] md:h-[60%] md:w-[60%] lg:block xl:h-[44%] xxl:w-[57%] sxl:w-[44%]">
          <Image src="/default/hero-image.png" alt="hero image" className=" h-full w-full" />
        </div>
      </div>

      {/* Hero Image End */}
    </div>
  );
}
