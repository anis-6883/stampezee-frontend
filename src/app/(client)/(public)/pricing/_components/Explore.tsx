'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Explore() {
  const t = useTranslations('pricingPage');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <div className="relative mx-auto w-full">
      <img src="default/pricing-hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
      <div className="pricing-hero absolute inset-0"></div>
      <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
        <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
          <div className="bottom-[28%]  sm:absolute">
            <div data-aos="flip-left" className="text-center text-2xl font-bold leading-10 text-[#DF2828] sm:mb-3 sm:text-left sm:text-6xl">
              <span style={{ opacity: 1, transform: 'none' }}>{t('explore')}</span>
            </div>
            <br />
            <div className="flex gap-3 text-2xl font-bold	leading-10	text-white sm:text-6xl">
              <div className="">
                <span style={{ opacity: 1, transform: 'none' }}>{t('title')}</span>
              </div>
            </div>
            <div className="MuiStack-root css-plpzdo" />
          </div>
        </div>
      </div>
    </div>
  );
}
