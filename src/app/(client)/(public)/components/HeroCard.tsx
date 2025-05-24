import { useTranslations } from 'next-intl';
import Featured from './Featured';
import IntroVideoSection from './IntroVideoSection';

export const HeroCard = () => {
  const t = useTranslations('HomePage');
  return (
    <div className="px-5 md:px-8 lg:px-10">
      <IntroVideoSection
        imagePosition="right"
        title={'What is StampEzee?'}
        description={
          'StampEzee is a smart loyalty solution that replaces outdated paper cards with digital stamp cards, all stored conveniently in your customer’s phone. With every visit or purchase, customers earn digital stamps they can redeem for exciting rewards — keeping them engaged and coming back for more.'
        }
        bgHeight="py-6 md:py-10 lg:py-12 xl:py-16 sxl:py-20"
      />
      <Featured
        image="/default/why-stamp.png"
        title={t('heroTitleOne')}
        description={t('heroDescriptionOne')}
        bgHeight="py-6 md:py-10 lg:py-12 xl:py-16 sxl:py-20"
      />
      <Featured
        imagePosition="right"
        image="/default/empower.png"
        title={t('heroTitleTwo')}
        description={t('heroDescriptionTwo')}
        bgHeight="py-6 md:py-10 lg:py-12 xl:py-16 sxl:py-20"
      />
    </div>
  );
};
