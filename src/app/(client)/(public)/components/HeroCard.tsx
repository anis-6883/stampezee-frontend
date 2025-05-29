import { useTranslations } from 'next-intl';
import Featured from './Featured';
import IntroVideoSection from './IntroVideoSection';

export const HeroCard = ({ isRtl }: { isRtl: boolean }) => {
  const t = useTranslations('HomePage');
  return (
    <div className=" px-5 md:px-8 lg:px-10">
      <IntroVideoSection
        title={t('introVideoTitle')}
        description={t('introVideoDescription')}
        subtitle={t('introVideoSubtitle')}
        isRtl={isRtl}
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
