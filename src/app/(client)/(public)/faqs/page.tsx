import { metaObject } from '@/config/site.config';
import { useTranslations } from 'next-intl';
import Accordion from '../components/Accordion';

export const metadata = {
  ...metaObject('FAQs'),
};

export default function Page() {
  const t = useTranslations('FaqPage');
  return (
    <div>
      <div className="relative mx-auto w-full">
        <img src="default/faq-hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
        <div className="faq-hero absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%] sm:absolute">
              <div className="text-center text-4xl font-bold text-[#DF2828] sm:text-left sm:text-6xl">
                <span style={{ opacity: 1, transform: 'none' }}>{t('how')}</span>
                {/* <span style={{ opacity: 1, transform: 'none' }}>o</span>
                <span style={{ opacity: 1, transform: 'none' }}>w</span> */}
              </div>
              <br />
              <div className="flex gap-3 text-[1.5rem]  font-bold text-white sm:text-6xl md:text-[4rem]">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>{t('title')}</span>
                  {/* <span style={{ opacity: 1, transform: 'none' }}>a</span>
                  <span style={{ opacity: 1, transform: 'none' }}>n</span> */}
                </div>
                {/* <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>w</span>
                  <span style={{ opacity: 1, transform: 'none' }}>e</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>h</span>
                  <span style={{ opacity: 1, transform: 'none' }}>e</span>
                  <span style={{ opacity: 1, transform: 'none' }}>l</span>
                  <span style={{ opacity: 1, transform: 'none' }}>p</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>y</span>
                  <span style={{ opacity: 1, transform: 'none' }}>o</span>
                  <span style={{ opacity: 1, transform: 'none' }}>u</span>
                  <span style={{ opacity: 1, transform: 'none' }}>?</span>
                </div> */}
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>
      <div className="md-px-0 container mx-auto mt-10 max-w-screen-xl px-3">
        <h1 className="text-xl font-bold leading-tight  sm:text-[2rem]">{t('questionTitle')}</h1>
      </div>

      <div className="md-px-0 container mx-auto mt-10 max-w-screen-xl px-3">
        <Accordion />
      </div>
    </div>
  );
}
